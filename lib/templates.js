// 6 onaylı şablonun düz HTML karşılığı. Ölçüler/fontlar/renkler kanvastaki .dc.html dosyalarıyla birebir.
// Her şablon: (p, L) => tam HTML. p = parseProduct çıktısı, L = logo data URI'leri.
const fs = require('fs');
const path = require('path');

const LOGO_DIR = path.join(__dirname, '..', 'assets', 'logos');
const L = {};
for (const f of fs.readdirSync(LOGO_DIR)) {
  if (f.endsWith('.png')) L[f.replace('.png', '')] = 'data:image/png;base64,' + fs.readFileSync(path.join(LOGO_DIR, f)).toString('base64');
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const when = (c, html) => (c ? html : '');

function page(fonts, body) {
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?${fonts}&display=block" rel="stylesheet">
<style>html,body{margin:0;padding:0;width:1080px;height:1080px;overflow:hidden}</style></head>
<body>${body}</body></html>`;
}

// ---------- Main (Smith) ----------
function smith(p) {
  const accent = '#FF6A3D';
  const n2 = p.n >= 2, n3 = p.n >= 3, lt3 = p.n < 3;
  return page('family=Jost:wght@300;400;500&family=Inter:wght@400;500;600', `
<div style="width: 1080px; height: 1080px; box-sizing: border-box; background: #000000; color: #FFFFFF; font-family: Jost, sans-serif; padding: 36px 52px 12px; display: flex; flex-direction: column; gap: 22px">
  <div style="height: 44px; display: flex; justify-content: space-between; align-items: center">
    <img src="${L['smith-white']}" alt="Smith" style="height: 40px">
    <span style="font-weight: 300; font-size: 20px; letter-spacing: 0.32em">KASIM İNDİRİMİ</span>
  </div>
  <div style="height: 656px; flex-shrink: 0; display: flex; gap: 20px">
    <div style="width: 656px; height: 656px; background: #FFFFFF; flex-shrink: 0">
      <img src="${esc(p.imgs[0])}" alt="" style="width: 656px; height: 656px; object-fit: contain; display: block">
    </div>
    <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 20px; min-width: 0">
      ${when(n2, `<div style="height: 318px; background: #FFFFFF"><img src="${esc(p.imgs[1])}" alt="" style="width: 100%; height: 318px; object-fit: contain; display: block"></div>`)}
      ${when(n3, `<div style="height: 318px; background: #FFFFFF"><img src="${esc(p.imgs[2])}" alt="" style="width: 100%; height: 318px; object-fit: contain; display: block"></div>`)}
      ${when(lt3, `<div style="flex-grow: 1; border: 1px solid #3A3A3A; box-sizing: border-box; padding: 28px; display: flex; flex-direction: column; justify-content: center; gap: 6px">
          <span style="font-weight: 300; font-size: 76px; line-height: 1; color: ${accent}">%40'A</span>
          <span style="font-weight: 300; font-size: 22px; letter-spacing: 0.24em">VARAN İNDİRİM</span>
          <span style="font-family: Inter, sans-serif; font-size: 16px; color: #A8A8A8; margin-top: 10px">Kar gözlükleri &amp; kasklar</span>
        </div>`)}
    </div>
  </div>
  <div style="flex-grow: 1; display: flex; align-items: flex-end; gap: 32px; min-height: 0">
    <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0">
      <span style="font-weight: 300; font-size: 18px; letter-spacing: 0.26em; color: ${accent}">KAR GÖZLÜKLERİ &amp; KASKLAR · %40'A VARAN</span>
      <span style="font-weight: 400; font-size: 36px; line-height: 1.15; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden">${esc(p.name)}</span>
      ${when(p.hasSub, `<span style="font-family: Inter, sans-serif; font-size: 17px; color: #A8A8A8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${esc(p.sub)}</span>`)}
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0">
      <div style="display: flex; align-items: center; gap: 12px">
        <span style="font-weight: 300; font-size: 24px; color: #8C8C8C; text-decoration: line-through">${p.old}</span>
        ${when(p.hasDisc, `<span style="background: ${accent}; color: #000000; font-weight: 500; font-size: 22px; padding: 4px 12px">${p.disc}</span>`)}
      </div>
      <span style="font-weight: 500; font-size: 84px; line-height: 0.95; letter-spacing: -0.02em">${p.now}</span>
    </div>
  </div>
  <div style="height: 104px; flex-shrink: 0; border-top: 1px solid #333333; display: flex; align-items: center; gap: 28px">
    <div style="flex-grow: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); min-width: 0">
      <div style="display: flex; flex-direction: column; gap: 4px; padding-right: 18px; border-right: 1px solid #333333">
        <span style="font-weight: 500; font-size: 34px; line-height: 1; color: ${accent}">+%5 İNDİRİM</span>
        <span style="font-family: Inter, sans-serif; font-size: 16px; color: #D0D0D0">Havale / EFT ödemelerinde</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding: 0 18px; border-right: 1px solid #333333">
        <span style="font-weight: 500; font-size: 34px; line-height: 1; color: ${accent}">12 TAKSİT</span>
        <span style="font-family: Inter, sans-serif; font-size: 16px; color: #D0D0D0">Kredi kartına</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding-left: 18px">
        <span style="font-weight: 500; font-size: 34px; line-height: 1; color: ${accent}">3 TAKSİT</span>
        <span style="font-family: Inter, sans-serif; font-size: 16px; color: #D0D0D0">15.000₺ üzeri vade farksız</span>
      </div>
    </div>
    <img src="${L['powdershop-white']}" alt="Powder Shop" style="height: 64px; flex-shrink: 0">
  </div>
</div>`);
}

// ---------- TNF Kış ----------
function tnfKis(p) {
  const accent = '#C8102E';
  const n2 = p.n >= 2, n3 = p.n >= 3, lt3 = p.n < 3;
  return page('family=Archivo:wght@400;500;700;800;900', `
<div style="width: 1080px; height: 1080px; box-sizing: border-box; background: #FFFFFF; color: #000000; font-family: Archivo, sans-serif; display: flex; flex-direction: column">
  <div style="flex-grow: 1; padding: 24px 32px 14px; display: flex; flex-direction: column; gap: 16px; min-height: 0">
    <div style="height: 60px; display: flex; justify-content: space-between; align-items: center">
      <img src="${L['tnf-dark']}" alt="The North Face" style="height: 60px">
      <span style="background: ${accent}; color: #FFFFFF; font-weight: 900; font-size: 22px; padding: 10px 16px; letter-spacing: 0.02em">KASIM İNDİRİMİ · KIŞ KOLEKSİYONU</span>
    </div>
    <div style="height: 672px; display: flex; gap: 16px">
      <div style="width: 672px; height: 672px; background: #F2F2F2; flex-shrink: 0">
        <img src="${esc(p.imgs[0])}" alt="" style="width: 672px; height: 672px; object-fit: contain; display: block">
      </div>
      <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px; min-width: 0">
        ${when(n2, `<div style="height: 328px; background: #F2F2F2"><img src="${esc(p.imgs[1])}" alt="" style="width: 100%; height: 328px; object-fit: contain; display: block"></div>`)}
        ${when(n3, `<div style="height: 328px; background: #F2F2F2"><img src="${esc(p.imgs[2])}" alt="" style="width: 100%; height: 328px; object-fit: contain; display: block"></div>`)}
        ${when(lt3, `<div style="flex-grow: 1; background: ${accent}; color: #FFFFFF; padding: 28px 24px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center">
            <span style="font-weight: 900; font-size: 64px; line-height: 0.9; letter-spacing: -0.02em; white-space: nowrap">%50'YE</span>
            <span style="font-weight: 900; font-size: 30px; margin-top: 6px">VARAN İNDİRİM</span>
            <span style="font-weight: 500; font-size: 17px; margin-top: 12px">Kış Koleksiyonu</span>
          </div>`)}
      </div>
    </div>
    <div style="flex-grow: 1; display: flex; align-items: center; gap: 32px; min-height: 0">
      <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0">
        <span style="font-weight: 800; font-size: 17px; letter-spacing: 0.08em; color: ${accent}">%50'YE VARAN İNDİRİM</span>
        <span style="font-weight: 700; font-size: 32px; line-height: 1.12; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden">${esc(p.name)}</span>
        ${when(p.hasSub, `<span style="font-weight: 500; font-size: 17px; color: #4A4A4A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${esc(p.sub)}</span>`)}
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0">
        <div style="display: flex; align-items: center; gap: 12px">
          <span style="font-size: 26px; font-weight: 500; color: #6B6B6B; text-decoration: line-through">${p.old}</span>
          ${when(p.hasDisc, `<span style="background: #000000; color: #FFFFFF; font-weight: 900; font-size: 24px; padding: 4px 12px">${p.disc}</span>`)}
        </div>
        <span style="font-weight: 900; font-size: 96px; line-height: 0.9; letter-spacing: -0.03em; color: ${accent}">${p.now}</span>
      </div>
    </div>
  </div>
  <div style="height: 104px; flex-shrink: 0; background: #000000; color: #FFFFFF; padding: 0 32px; display: flex; align-items: center; gap: 28px">
    <div style="flex-grow: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); min-width: 0">
      <div style="display: flex; flex-direction: column; gap: 4px; padding-right: 18px; border-right: 1px solid #3A3A3A">
        <span style="font-weight: 900; font-size: 30px; line-height: 1">+%5 İNDİRİM</span>
        <span style="font-weight: 500; font-size: 16px; color: #D0D0D0">Havale / EFT ödemelerinde</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding: 0 18px; border-right: 1px solid #3A3A3A">
        <span style="font-weight: 900; font-size: 30px; line-height: 1">12 TAKSİT</span>
        <span style="font-weight: 500; font-size: 16px; color: #D0D0D0">Kredi kartına</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding-left: 18px">
        <span style="font-weight: 900; font-size: 30px; line-height: 1">3 TAKSİT</span>
        <span style="font-weight: 500; font-size: 16px; color: #D0D0D0">15.000₺ üzeri vade farksız</span>
      </div>
    </div>
    <img src="${L['powdershop-white']}" alt="Powder Shop" style="height: 62px; flex-shrink: 0">
  </div>
</div>`);
}

// ---------- Koşu ----------
const KOSU_LOGOS = {
  'asics': ['asics-white', '52px', '34px', 'Asics'],
  'adidas': ['adidas-white', '60px', '40px', 'Adidas'],
  'new balance': ['newbalance-white', '56px', '38px', 'New Balance'],
  'brooks': ['brooks-white', '34px', '22px', 'Brooks'],
  'the north face': ['tnf-white', '56px', '38px', 'The North Face'],
};
function kosu(p) {
  const accent = '#D7FF3D';
  const n2 = p.n >= 2, n3 = p.n >= 3, lt3 = p.n < 3;
  const bk = (p.brand || '').toLowerCase();
  const lg = KOSU_LOGOS[bk];
  const strip = Object.entries(KOSU_LOGOS).map(([k, v]) =>
    `<img src="${L[v[0]]}" alt="${v[3]}" style="height: ${v[2]}; opacity: ${k === bk ? '1' : '0.35'}">`).join('\n    ');
  const tag = (t, big) => `<span style="position: absolute; left: ${big ? 16 : 12}px; top: ${big ? 16 : 12}px; background: #0B0B0B; color: ${accent}; font-family: 'Space Mono', monospace; font-weight: 700; font-size: ${big ? 20 : 16}px; padding: 2px ${big ? 8 : 6}px">${t}</span>`;
  return page('family=Anton&family=Space+Mono:wght@400;700&family=Inter:wght@500;600', `
<div style="width: 1080px; height: 1080px; box-sizing: border-box; background: #0B0B0B; color: #F5F5F0; font-family: Inter, sans-serif; display: flex; flex-direction: column; overflow: hidden">
  <div style="background: ${accent}; color: #0B0B0B; height: 60px; flex-shrink: 0; display: flex; align-items: center; gap: 28px; padding: 0 28px; white-space: nowrap; overflow: hidden; font-family: Anton, sans-serif; font-size: 28px; letter-spacing: 0.02em">
    <span>KOŞU · %45'E VARAN İNDİRİM →</span><span>KASIM İNDİRİMİ →</span><span>KOŞU · %45'E VARAN İNDİRİM →</span>
  </div>
  <div style="height: 64px; flex-shrink: 0; padding: 0 56px; border-bottom: 1px solid #2A2A2A; display: flex; align-items: center; justify-content: space-between">
    ${strip}
  </div>
  <div style="flex-grow: 1; padding: 16px 56px 16px; display: flex; flex-direction: column; gap: 20px; min-height: 0">
    <div style="height: 600px; flex-shrink: 0; display: flex; gap: 16px">
      <div style="width: 600px; height: 600px; background: #FFFFFF; position: relative; flex-shrink: 0">
        <img src="${esc(p.imgs[0])}" alt="" style="width: 600px; height: 600px; object-fit: contain; display: block">
        ${tag('01', true)}
      </div>
      <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px; min-width: 0">
        ${when(n2, `<div style="height: 292px; background: #FFFFFF; position: relative"><img src="${esc(p.imgs[1])}" alt="" style="width: 100%; height: 292px; object-fit: contain; display: block">${tag('02')}</div>`)}
        ${when(n3, `<div style="height: 292px; background: #FFFFFF; position: relative"><img src="${esc(p.imgs[2])}" alt="" style="width: 100%; height: 292px; object-fit: contain; display: block">${tag('03')}</div>`)}
        ${when(lt3, `<div style="flex-grow: 1; background: ${accent}; color: #0B0B0B; padding: 24px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center">
            <span style="font-family: Anton, sans-serif; font-size: 96px; line-height: 0.95">%45'E</span>
            <span style="font-family: Anton, sans-serif; font-size: 34px">VARAN İNDİRİM →</span>
            <span style="font-family: 'Space Mono', monospace; font-weight: 700; font-size: 15px; margin-top: 12px">KOŞU KOLEKSİYONU</span>
          </div>`)}
      </div>
    </div>
    <div style="flex-grow: 1; display: flex; align-items: flex-end; gap: 28px; min-height: 0">
      <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0">
        ${lg ? `<img src="${L[lg[0]]}" alt="${lg[3]}" style="height: ${lg[1]}; align-self: flex-start">`
             : `<span style="align-self: flex-start; font-family: Anton, sans-serif; font-size: 40px; line-height: 1; letter-spacing: 0.04em; text-transform: uppercase; color: ${accent}">${esc(p.brand || '')}</span>`}
        <span style="font-family: Anton, sans-serif; font-size: 44px; line-height: 1.02; text-transform: uppercase; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden">${esc(p.name)}</span>
        ${when(p.hasSub, `<span style="font-family: 'Space Mono', monospace; font-size: 15px; color: #BDBDBD; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${esc(p.sub)}</span>`)}
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0">
        <div style="display: flex; align-items: center; gap: 12px">
          <span style="font-family: 'Space Mono', monospace; font-size: 22px; color: #8F8F8F; text-decoration: line-through">${p.old}</span>
          ${when(p.hasDisc, `<span style="background: ${accent}; color: #0B0B0B; font-family: Anton, sans-serif; font-size: 28px; padding: 0 12px">${p.disc}</span>`)}
        </div>
        <span style="font-family: Anton, sans-serif; font-size: 100px; line-height: 0.95; color: ${accent}">${p.now}</span>
      </div>
    </div>
  </div>
  <div style="height: 108px; flex-shrink: 0; background: #1A1A1A; padding: 0 56px; display: flex; align-items: center; gap: 28px">
    <div style="flex-grow: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); min-width: 0">
      <div style="display: flex; flex-direction: column; gap: 4px; padding-right: 18px; border-right: 1px solid #3A3A3A">
        <span style="font-family: Anton, sans-serif; font-size: 36px; line-height: 1; color: ${accent}">+%5 İNDİRİM</span>
        <span style="font-family: 'Space Mono', monospace; font-size: 14px; color: #D6D6D6">HAVALE / EFT</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding: 0 18px; border-right: 1px solid #3A3A3A">
        <span style="font-family: Anton, sans-serif; font-size: 36px; line-height: 1; color: ${accent}">12 TAKSİT</span>
        <span style="font-family: 'Space Mono', monospace; font-size: 14px; color: #D6D6D6">KREDİ KARTINA</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding-left: 18px">
        <span style="font-family: Anton, sans-serif; font-size: 36px; line-height: 1; color: ${accent}">3 TAKSİT</span>
        <span style="font-family: 'Space Mono', monospace; font-size: 14px; color: #D6D6D6">15.000₺+ VADE FARKSIZ</span>
      </div>
    </div>
    <img src="${L['powdershop-white']}" alt="Powder Shop" style="height: 62px; flex-shrink: 0">
  </div>
</div>`);
}

// ---------- Stanley ----------
const BARCODE = [[0,4],[7,2],[12,6],[21,2],[26,3],[33,5],[41,2],[46,4],[53,2],[58,7],[68,2],[73,3],[80,5],[88,2],[93,4],[100,2],[105,6],[114,3],[120,2],[125,5],[133,2],[138,4],[145,7],[155,2],[160,3],[166,5],[174,2],[179,4],[186,2],[191,6],[200,3],[206,2],[211,5]]
  .map(([x, w]) => `<rect x="${x}" y="0" width="${w}" height="56"></rect>`).join('');
function stanley(p) {
  const n2 = p.n >= 2, n3 = p.n >= 3, lt3 = p.n < 3;
  return page('family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600', `
<div style="width: 1080px; height: 1080px; box-sizing: border-box; background: #FFFFFF; color: #111111; font-family: Inter, sans-serif; display: flex; flex-direction: column">
  <div style="background: #000000; color: #FFFFFF; height: 196px; flex-shrink: 0; box-sizing: border-box; padding: 26px 52px; display: flex; justify-content: space-between; align-items: stretch">
    <div style="display: flex; flex-direction: column; justify-content: space-between">
      <img src="${L['stanley-white']}" alt="Stanley" style="height: 64px; align-self: flex-start">
      <span style="font-weight: 500; font-size: 56px; line-height: 1; letter-spacing: -0.02em">Kasım İndirimi</span>
    </div>
    <div style="width: 300px; border: 2px dashed #FFFFFF; box-sizing: border-box; padding: 10px 18px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; text-align: center">
      <span style="font-size: 14px; font-weight: 600; letter-spacing: 0.14em">KASIM FIRSATI</span>
      <span style="font-size: 46px; font-weight: 600; line-height: 1">%35'E VARAN</span>
      <span style="font-size: 15px; font-weight: 600; letter-spacing: 0.08em">İNDİRİM</span>
      <svg width="200" height="26" viewBox="0 0 220 56" preserveAspectRatio="none" aria-hidden="true"><g fill="#FFFFFF">${BARCODE}</g></svg>
    </div>
  </div>
  <div style="flex-grow: 1; padding: 28px 52px 0; display: flex; flex-direction: column; gap: 22px; min-height: 0">
    <div style="height: 600px; flex-shrink: 0; display: flex; gap: 16px">
      <div style="width: 600px; height: 600px; background: #FFFFFF; border: 1px solid #E6E6E6; box-sizing: border-box; flex-shrink: 0">
        <img src="${esc(p.imgs[0])}" alt="" style="width: 598px; height: 598px; object-fit: contain; display: block">
      </div>
      <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px; min-width: 0">
        ${when(n2, `<div style="height: 292px; background: #FFFFFF; border: 1px solid #E6E6E6; box-sizing: border-box"><img src="${esc(p.imgs[1])}" alt="" style="width: 100%; height: 290px; object-fit: contain; display: block"></div>`)}
        ${when(n3, `<div style="height: 292px; background: #FFFFFF; border: 1px solid #E6E6E6; box-sizing: border-box"><img src="${esc(p.imgs[2])}" alt="" style="width: 100%; height: 290px; object-fit: contain; display: block"></div>`)}
        ${when(lt3, `<div style="flex-grow: 1; background: #000000; color: #FFFFFF; padding: 26px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; gap: 28px">
            <span style="font-weight: 500; font-size: 32px; line-height: 1.25">Stanley ile sıcak da soğuk da hep doğru ayarında.</span>
            <span style="font-weight: 700; font-size: 30px; line-height: 1.25">Şimdi Kasım fiyatıyla.</span>
          </div>`)}
      </div>
    </div>
    <div style="flex-grow: 1; display: flex; align-items: center; gap: 32px; min-height: 0">
      <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0">
        <span style="font-weight: 500; font-size: 34px; letter-spacing: -0.01em; line-height: 1.12; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden">${esc(p.name)}</span>
        ${when(p.hasSub, `<span style="font-size: 18px; color: #555555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${esc(p.sub)}</span>`)}
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0">
        <div style="display: flex; align-items: center; gap: 12px">
          <span style="font-size: 24px; color: #6E6E6E; text-decoration: line-through">${p.old}</span>
          ${when(p.hasDisc, `<span style="background: #000000; color: #FFFFFF; font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 22px; padding: 4px 10px">${p.disc}</span>`)}
        </div>
        <span style="font-weight: 600; font-size: 76px; line-height: 0.95; letter-spacing: -0.03em">${p.now}</span>
      </div>
    </div>
  </div>
  <div style="height: 104px; flex-shrink: 0; background: #F2F2F0; padding: 0 52px; display: flex; align-items: center; gap: 28px">
    <div style="flex-grow: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); min-width: 0">
      <div style="display: flex; flex-direction: column; gap: 4px; padding-right: 18px; border-right: 1px solid #D6D6D3">
        <span style="font-weight: 600; font-size: 32px; line-height: 1; letter-spacing: -0.01em">+%5 indirim</span>
        <span style="font-size: 16px; color: #444444">Havale / EFT ödemelerinde</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding: 0 18px; border-right: 1px solid #D6D6D3">
        <span style="font-weight: 600; font-size: 32px; line-height: 1; letter-spacing: -0.01em">12 taksit</span>
        <span style="font-size: 16px; color: #444444">Kredi kartına</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding-left: 18px">
        <span style="font-weight: 600; font-size: 32px; line-height: 1; letter-spacing: -0.01em">3 taksit</span>
        <span style="font-size: 16px; color: #444444">15.000₺ üzeri vade farksız</span>
      </div>
    </div>
    <img src="${L['powdershop-black']}" alt="Powder Shop" style="height: 62px; flex-shrink: 0">
  </div>
</div>`);
}

// ---------- Birkenstock ----------
function birkenstock(p) {
  const navy = '#0D285E';
  const n2 = p.n >= 2, n3 = p.n >= 3, lt3 = p.n < 3;
  return page('family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600', `
<div style="width: 1080px; height: 1080px; box-sizing: border-box; background: #F3EEE6; color: #0D285E; font-family: Inter, sans-serif; display: flex; flex-direction: column; padding: 32px 32px 0; gap: 20px">
  <div style="height: 56px; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center; gap: 24px">
    <img src="${L['birkenstock-navy']}" alt="Birkenstock" style="height: 44px">
    <span style="background: ${navy}; color: #FFFFFF; font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 32px; padding: 6px 18px; letter-spacing: 0.02em">%35'E VARAN İNDİRİM</span>
  </div>
  <div style="height: 672px; flex-shrink: 0; display: flex; gap: 16px">
    <div style="width: 672px; height: 672px; background: #FFFFFF; flex-shrink: 0">
      <img src="${esc(p.imgs[0])}" alt="" style="width: 672px; height: 672px; object-fit: contain; display: block">
    </div>
    <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 16px; min-width: 0">
      ${when(n2, `<div style="height: 328px; background: #FFFFFF"><img src="${esc(p.imgs[1])}" alt="" style="width: 100%; height: 328px; object-fit: contain; display: block"></div>`)}
      ${when(n3, `<div style="height: 328px; background: #FFFFFF"><img src="${esc(p.imgs[2])}" alt="" style="width: 100%; height: 328px; object-fit: contain; display: block"></div>`)}
      ${when(lt3, `<div style="flex-grow: 1; background: ${navy}; color: #FFFFFF; padding: 26px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; gap: 2px">
          <span style="font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 76px; line-height: 0.9">%35'E VARAN</span>
          <span style="font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 40px; letter-spacing: 0.04em">İNDİRİM</span>
          <span style="font-size: 15px; font-weight: 500; color: #C9D3E8; margin-top: 8px">Terlik koleksiyonu · Kasım</span>
        </div>`)}
    </div>
  </div>
  <div style="flex-grow: 1; display: flex; align-items: flex-end; gap: 32px; min-height: 0">
    <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0">
      <span style="font-size: 32px; font-weight: 600; line-height: 1.12; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden">${esc(p.name)}</span>
      ${when(p.hasSub, `<span style="font-size: 17px; font-weight: 500; letter-spacing: 0.06em; color: #4A5A7A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${esc(p.sub)}</span>`)}
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0">
      <div style="display: flex; align-items: center; gap: 12px">
        <span style="font-size: 24px; color: #6A7590; text-decoration: line-through">${p.old}</span>
        ${when(p.hasDisc, `<span style="background: ${navy}; color: #FFFFFF; font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 28px; padding: 0 12px">${p.disc}</span>`)}
      </div>
      <span style="font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 104px; line-height: 0.88">${p.now}</span>
    </div>
  </div>
  <div style="height: 104px; flex-shrink: 0; margin: 0 -32px; background: ${navy}; color: #FFFFFF; padding: 0 32px; display: flex; align-items: center; gap: 28px">
    <div style="flex-grow: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); min-width: 0">
      <div style="display: flex; flex-direction: column; gap: 2px; padding-right: 18px; border-right: 1px solid #3B5287">
        <span style="font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 40px; line-height: 1">+%5 İNDİRİM</span>
        <span style="font-size: 15px; font-weight: 500; color: #D3DBEC">Havale / EFT ödemelerinde</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2px; padding: 0 18px; border-right: 1px solid #3B5287">
        <span style="font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 40px; line-height: 1">12 TAKSİT</span>
        <span style="font-size: 15px; font-weight: 500; color: #D3DBEC">Kredi kartına</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2px; padding-left: 18px">
        <span style="font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 40px; line-height: 1">3 TAKSİT</span>
        <span style="font-size: 15px; font-weight: 500; color: #D3DBEC">15.000₺ üzeri vade farksız</span>
      </div>
    </div>
    <img src="${L['powdershop-white']}" alt="Powder Shop" style="height: 62px; flex-shrink: 0">
  </div>
</div>`);
}

// ---------- Slam (en fazla 2 görsel, 3:4) ----------
function slam(p) {
  const accent = '#E30613';
  const n1 = p.n === 1, n2 = p.n >= 2;
  return page('family=Archivo:ital,wght@0,500;0,700;1,800;1,900', `
<div style="width: 1080px; height: 1080px; box-sizing: border-box; background: #0A0A0A; color: #FFFFFF; font-family: Archivo, sans-serif; display: flex; flex-direction: column; padding: 36px 52px 0; gap: 22px">
  <div style="height: 60px; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center">
    <img src="${L['slam-white']}" alt="Slam" style="height: 56px">
    <div style="background: ${accent}; padding: 10px 34px 10px 22px; clip-path: polygon(6% 0, 100% 0, 94% 100%, 0 100%)">
      <span style="font-style: italic; font-weight: 900; font-size: 32px; letter-spacing: -0.01em">%40'A VARAN İNDİRİM</span>
    </div>
  </div>
  <div style="height: 640px; flex-shrink: 0; display: flex; gap: 16px">
    <div style="width: 480px; height: 640px; background: #C6C4C1; flex-shrink: 0">
      <img src="${esc(p.imgs[0])}" alt="" style="width: 480px; height: 640px; object-fit: contain; display: block">
    </div>
    ${when(n2, `<div style="width: 480px; height: 640px; background: #C6C4C1; flex-shrink: 0"><img src="${esc(p.imgs[1])}" alt="" style="width: 480px; height: 640px; object-fit: contain; display: block"></div>`)}
    ${when(n1, `<div style="width: 480px; height: 640px; background: ${accent}; box-sizing: border-box; padding: 40px; display: flex; flex-direction: column; justify-content: flex-end">
        <span style="font-style: italic; font-weight: 900; font-size: 120px; line-height: 0.9; letter-spacing: -0.03em">%40'A</span>
        <span style="font-style: italic; font-weight: 900; font-size: 44px">VARAN İNDİRİM</span>
        <span style="font-style: italic; font-weight: 800; font-size: 18px; letter-spacing: 0.08em; margin-top: 14px">YELKEN GİYİM KOLEKSİYONU</span>
      </div>`)}
  </div>
  <div style="flex-grow: 1; display: flex; align-items: center; gap: 32px; min-height: 0">
    <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0">
      <span style="font-style: italic; font-weight: 800; font-size: 18px; letter-spacing: 0.08em; color: #BDBDBD">YELKEN GİYİM KOLEKSİYONU</span>
      <span style="font-style: italic; font-weight: 900; font-size: 44px; line-height: 1; text-transform: uppercase; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden">${esc(p.name)}</span>
      ${when(p.hasSub, `<span style="font-size: 17px; font-weight: 500; color: #BDBDBD; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${esc(p.sub)}</span>`)}
    </div>
    <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0">
      <div style="display: flex; align-items: center; gap: 12px">
        <span style="font-size: 24px; font-weight: 500; color: #8E8E8E; text-decoration: line-through">${p.old}</span>
        ${when(p.hasDisc, `<span style="background: ${accent}; color: #FFFFFF; font-style: italic; font-weight: 900; font-size: 26px; padding: 2px 12px">${p.disc}</span>`)}
      </div>
      <span style="font-style: italic; font-weight: 900; font-size: 96px; line-height: 0.9; letter-spacing: -0.03em">${p.now}</span>
    </div>
  </div>
  <div style="height: 104px; flex-shrink: 0; margin: 0 -52px; background: #1A1A1A; padding: 0 52px; display: flex; align-items: center; gap: 28px">
    <div style="flex-grow: 1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); min-width: 0">
      <div style="display: flex; flex-direction: column; gap: 4px; padding-right: 18px; border-right: 1px solid #3A3A3A">
        <span style="font-style: italic; font-weight: 900; font-size: 28px; line-height: 1">+%5 İNDİRİM</span>
        <span style="font-weight: 500; font-size: 15px; color: #D0D0D0">Havale / EFT ödemelerinde</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding: 0 18px; border-right: 1px solid #3A3A3A">
        <span style="font-style: italic; font-weight: 900; font-size: 28px; line-height: 1">12 TAKSİT</span>
        <span style="font-weight: 500; font-size: 15px; color: #D0D0D0">Kredi kartına</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px; padding-left: 18px">
        <span style="font-style: italic; font-weight: 900; font-size: 28px; line-height: 1">3 TAKSİT</span>
        <span style="font-weight: 500; font-size: 15px; color: #D0D0D0">15.000₺ üzeri vade farksız</span>
      </div>
    </div>
    <img src="${L['powdershop-white']}" alt="Powder Shop" style="height: 62px; flex-shrink: 0">
  </div>
</div>`);
}

const TEMPLATES = {
  smith: { render: smith, maxImgs: 3 },
  'tnf-kis': { render: tnfKis, maxImgs: 3 },
  kosu: { render: kosu, maxImgs: 3 },
  stanley: { render: stanley, maxImgs: 3 },
  birkenstock: { render: birkenstock, maxImgs: 3 },
  slam: { render: slam, maxImgs: 2 },
};

// Şablon kodu değişince eski render'ların yenilenmesi için sürüm
const TEMPLATE_VERSION = require('crypto').createHash('sha1').update(fs.readFileSync(__filename)).digest('hex').slice(0, 8);

module.exports = { TEMPLATES, TEMPLATE_VERSION };
