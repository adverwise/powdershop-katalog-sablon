// Ana akış: feed'leri oku → setleri çöz → tasarımları render et → 6 XML feed + önizleme sayfası üret.
// Kullanım: node build.js [--prev <önceki site klasörü>] [--out site] [--limit N]
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');
const { loadSources } = require('./lib/feeds');
const { parseProduct } = require('./lib/product');
const { TEMPLATES, TEMPLATE_VERSION } = require('./lib/templates');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', 'site'));
const PREV = opt('--prev', null);
const LIMIT = Number(opt('--limit', 0));
const BASE = (process.env.PAGES_BASE || 'https://adverwise.github.io/powdershop-katalog-sablon').replace(/\/$/, '');
const CONCURRENCY = Number(process.env.RENDER_CONCURRENCY || 4);

const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'sets.json'), 'utf8'));

function selectItems(t, src) {
  const idSet = t.ids ? new Set(t.ids) : null;
  const all = src.filter((it) => (idSet ? idSet.has(it.id) : it.brand.toLowerCase() === t.brand));
  const skipped = { stok: 0, indirim: 0, gorsel: 0 };
  const ok = [];
  for (const it of all) {
    if (it.availability !== 'in stock') { skipped.stok++; continue; }
    if (!(it.sale > 0 && it.sale < it.price)) { skipped.indirim++; continue; }
    if (!it.images.length) { skipped.gorsel++; continue; }
    ok.push(it);
  }
  return { ok, matched: all.length, skipped };
}

// ikas'ta silinmiş görselleri ayıkla: sıradaki ilk N çalışan görseli bul (sonuç önbellekli)
const imgOk = new Map();
async function checkImage(u) {
  if (!imgOk.has(u)) {
    imgOk.set(u, (async () => {
      for (let i = 0; i < 2; i++) {
        try {
          const r = await fetch(u, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
          if (r.status === 404 || r.status === 410) return false;
          if (r.ok) return true;
        } catch { /* tekrar dene */ }
      }
      return true; // emin değilsek render denemesine bırak
    })());
  }
  return imgOk.get(u);
}
async function workingImages(list, max) {
  const out = [];
  for (const u of list) {
    if (out.length >= max) break;
    if (await checkImage(u)) out.push(u);
  }
  return out;
}
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; await fn(items[k], k); } }));
}

function designKey(tplKey, p) {
  const h = crypto.createHash('sha1')
    .update(JSON.stringify([TEMPLATE_VERSION, tplKey, p.name, p.sub, p.old, p.now, p.disc, p.brand, p.imgs]))
    .digest('hex').slice(0, 16);
  return `img/${tplKey}/${h}.jpg`;
}

const x = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  // XML 1.0'da geçersiz kontrol karakterlerini at
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');

function feedXml(title, rows) {
  const items = rows.map(({ it, file }) => `  <item>
    <g:id>${x(it.id)}</g:id>
    ${it.group ? `<g:item_group_id>${x(it.group)}</g:item_group_id>` : ''}
    <g:title>${x(it.title)}</g:title>
    <g:description>${x((it.description || it.title).slice(0, 4900))}</g:description>
    <g:link>${x(it.link)}</g:link>
    <g:image_link>${x(BASE + '/' + file)}</g:image_link>
    <g:brand>${x(it.brand)}</g:brand>
    <g:condition>${x(it.condition || 'new')}</g:condition>
    <g:availability>${x(it.availability)}</g:availability>
    <g:price>${it.price.toFixed(2)} TRY</g:price>
    <g:sale_price>${it.sale.toFixed(2)} TRY</g:sale_price>
    ${it.gtin ? `<g:gtin>${x(it.gtin)}</g:gtin>` : ''}
    ${it.google_product_category ? `<g:google_product_category>${x(it.google_product_category)}</g:google_product_category>` : ''}
    ${it.product_type ? `<g:product_type>${x(it.product_type)}</g:product_type>` : ''}
  </item>`.replace(/\n\s*\n/g, '\n'));
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>${x(title)}</title>
  <link>https://powdershop.com.tr</link>
  <description>Powder Shop Kasım İndirimi katalog şablonları</description>
${items.join('\n')}
</channel>
</rss>
`;
}

async function renderOne(page, html, outFile) {
  await page.setContent(html, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const broken = await page.evaluate(async () => {
    const imgs = [...document.images];
    await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    return imgs.filter((i) => !i.naturalWidth).map((i) => i.src.slice(0, 120));
  });
  if (broken.length) throw new Error('görsel yüklenemedi: ' + broken.join(', '));
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  await page.screenshot({ path: outFile, type: 'jpeg', quality: 90, clip: { x: 0, y: 0, width: 1080, height: 1080 } });
}

function previewHtml(summary) {
  const cards = summary.map((s) => `
<section><h2>${x(s.key)} <small>${s.rows.length} ürün · ${s.designs} tasarım · <a href="feeds/${x(s.key)}.xml">feed</a></small></h2>
<p class="meta">Sette ${s.matched} kalem · atlanan: stok dışı ${s.skipped.stok}, indirimsiz ${s.skipped.indirim}, görselsiz ${s.skipped.gorsel}, render hatası ${s.failed}</p>
<div class="grid">${[...new Map(s.rows.map((r) => [r.file, r])).values()].map((r) =>
    `<a href="${x(r.it.link)}" target="_blank"><img loading="lazy" src="${x(r.file)}" alt=""><span>${x(r.it.title)}</span></a>`).join('')}</div></section>`).join('');
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Powder Shop katalog önizleme</title><style>
body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#f4f4f2;color:#111}h1{margin:0 0 4px}h2{margin:32px 0 4px}small{font-weight:400;color:#666}
.meta{color:#666;margin:0 0 12px;font-size:14px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.grid a{display:block;background:#fff;color:#111;text-decoration:none;font-size:12px;border-radius:6px;overflow:hidden}.grid img{width:100%;display:block}.grid span{display:block;padding:6px 8px}
</style></head><body><h1>Powder Shop · Kasım katalog önizleme</h1><p class="meta">Son güncelleme: ${new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}</p>${cards}</body></html>`;
}

(async () => {
  const t0 = Date.now();
  const sources = await loadSources();
  console.log(`Kaynak: parent ${sources.parent.length}, tr ${sources.tr.length} kalem`);

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'feeds'), { recursive: true });

  // 1) Her şablon için ürünleri seç, tasarım anahtarlarını çıkar
  const jobs = new Map(); // file -> { html }
  const summary = [];
  for (const t of cfg.templates) {
    const tpl = TEMPLATES[t.template];
    const sel = selectItems(t, sources[t.source]);
    let items = sel.ok;
    if (LIMIT) items = items.slice(0, LIMIT);
    const imgs = new Array(items.length);
    await pool(items, 16, async (it, k) => { imgs[k] = await workingImages(it.images, tpl.maxImgs); });
    const rows = [];
    for (const [k, it] of items.entries()) {
      if (!imgs[k].length) { sel.skipped.gorsel++; continue; }
      const p = parseProduct({ title: it.title, price: it.price, sale: it.sale, imgs: imgs[k], brand: it.brand }, tpl.maxImgs);
      const file = designKey(t.key, p);
      if (!jobs.has(file)) jobs.set(file, { html: tpl.render(p), key: t.key });
      rows.push({ it, file });
    }
    summary.push({ ...t, rows, matched: sel.matched, skipped: sel.skipped, designs: new Set(rows.map((r) => r.file)).size, failed: 0 });
  }

  // 2) Önceki yayında aynı dosya varsa kopyala, yoksa render et
  let reused = 0;
  const todo = [];
  for (const [file, job] of jobs) {
    const prev = PREV && path.join(PREV, file);
    if (prev && fs.existsSync(prev)) {
      fs.mkdirSync(path.dirname(path.join(OUT, file)), { recursive: true });
      fs.copyFileSync(prev, path.join(OUT, file));
      reused++;
    } else todo.push([file, job]);
  }
  console.log(`Tasarım: ${jobs.size} benzersiz · ${reused} önceki yayından · ${todo.length} render edilecek`);

  const failed = new Set();
  if (todo.length) {
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
    const ctx = await browser.newContext({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
    let i = 0;
    await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
      const page = await ctx.newPage();
      while (i < todo.length) {
        const [file, job] = todo[i++];
        try { await renderOne(page, job.html, path.join(OUT, file)); }
        catch (e) {
          try { await renderOne(page, job.html, path.join(OUT, file)); } // bir kez daha dene
          catch (e2) { failed.add(file); console.warn(`! ${file}: ${e2.message}`); }
        }
      }
      await page.close();
    }));
    await browser.close();
  }

  // 3) Feed'ler (render'ı başarısız olan ürün feed'e girmez)
  for (const s of summary) {
    s.failed = s.rows.filter((r) => failed.has(r.file)).length;
    s.rows = s.rows.filter((r) => !failed.has(r.file));
    fs.writeFileSync(path.join(OUT, 'feeds', `${s.key}.xml`), feedXml(`Powder Shop · ${s.key}`, s.rows));
    console.log(`${s.key.padEnd(12)} sette ${String(s.matched).padStart(3)} · feed ${String(s.rows.length).padStart(3)} · tasarım ${s.designs} · atlanan ${JSON.stringify(s.skipped)} · hata ${s.failed}`);
  }
  fs.writeFileSync(path.join(OUT, 'index.html'), previewHtml(summary));
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
  fs.writeFileSync(path.join(OUT, 'status.json'), JSON.stringify({
    updated: new Date().toISOString(), template_version: TEMPLATE_VERSION,
    feeds: Object.fromEntries(summary.map((s) => [s.key, { url: `${BASE}/feeds/${s.key}.xml`, items: s.rows.length, failed: s.failed }])),
  }, null, 1));
  console.log(`Bitti: ${((Date.now() - t0) / 1000).toFixed(0)} sn`);
  if (failed.size > jobs.size * 0.2) { console.error('Render hatası oranı çok yüksek, yayın durduruldu.'); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
