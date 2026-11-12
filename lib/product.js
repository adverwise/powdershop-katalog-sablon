// Şablonlardaki parseProduct mantığının birebir kopyası (katalog/sablonlar/*.dc.html).
const BRANDS = ['The North Face', 'New Balance', 'Birkenstock', 'Stanley', 'Smith', 'Slam', 'Asics', 'Adidas', 'Brooks'];

const fmt = (n) => n.toLocaleString('tr-TR') + '₺';

function parseProduct(p, maxImgs = 3) {
  let t = p.title.trim();
  for (const b of BRANDS) {
    if (t.toLowerCase().indexOf(b.toLowerCase() + ' ') === 0) { t = t.slice(b.length + 1); break; }
  }
  // " - ", " -X", "X- " ve " | " ayırıcı sayılır; "T-Shirt" gibi boşluksuz tireler bölünmez
  const parts = t.split(/\s-\s?|\s?-\s|\s\|\s?/);
  const name = parts[0].trim();
  const sub = parts.slice(1).join(' ').replace(/-\s*/g, ' · ').replace(/^[\s·]+|[\s·]+$/g, '').trim();
  const disc = Math.floor(Math.round((1 - p.sale / p.price) * 10000) / 100);
  const imgs = p.imgs.slice(0, maxImgs);
  return {
    name, sub, hasSub: sub.length > 0,
    old: fmt(Math.floor(p.price)), now: fmt(Math.ceil(p.sale)),
    disc: '-%' + disc, hasDisc: disc >= 1, discNum: disc,
    imgs, n: imgs.length, brand: p.brand,
  };
}

module.exports = { parseProduct, fmt };
