# Powder Shop · Kasım katalog şablonları

ikas'ın Meta feed'lerindeki ürünleri 6 onaylı tasarımla 1080×1080 görsele çevirir ve her şablon için ayrı, tam bir Meta katalog XML feed'i yayınlar. FramePX'in yerine geçer.

**Her saat** GitHub Actions çalışır: feed'leri okur → setleri çözer → değişen ürünleri render eder → `gh-pages` dalına yayınlar.

## Yayın adresleri

- Önizleme (tüm ürünler): https://adverwise.github.io/powdershop-katalog-sablon/
- Durum: https://adverwise.github.io/powdershop-katalog-sablon/status.json
- Feed'ler (Meta'da yeni kataloğa veri kaynağı olarak, saatlik çekme):
  - `…/feeds/smith.xml` · `…/feeds/tnf-kis.xml` · `…/feeds/kosu.xml`
  - `…/feeds/stanley.xml` · `…/feeds/birkenstock.xml` · `…/feeds/slam.xml`

## Kurallar

- Sadece **stokta + indirimli** ürünler girer. `id` = ikas varyant UUID'si (kaynak katalogla aynı → piksel eşleşir).
- Görseller ikas sırasıyla, en fazla 3 (Slam 2); silinmiş görseller atlanır, eksik slotu kategori bloğu doldurur.
- Aynı görsel + fiyatı paylaşan varyantlar tek tasarımı paylaşır (dosya adı içerik hash'i; fiyat değişince adres de değişir, Meta yeniden çeker).
- Fiyat: eski = aşağı yuvarla, yeni = yukarı yuvarla; indirim yüzdesi aşağı yuvarlanır (asla olduğundan büyük görünmez).

## Dosyalar

- `config/sets.json` — 6 Meta ürün seti. Slam/Stanley/Birkenstock marka kuralıyla; TNF/Koşu/Smith Meta'dan alınmış ID listesiyle. Setler Meta'da değişirse bu liste yenilenmeli.
- `lib/templates.js` — 6 şablon (kanvastaki tasarımların birebir HTML'i). `lib/product.js` — başlık/fiyat/indirim kuralları. `lib/feeds.js` — ikas feed okuyucu.
- `build.js` — ana akış. Yerelde: `npm ci && npx playwright install chromium && node build.js --limit 3`

Kaynak feed adresleri `config/sources.json` içinde.

Kampanya bitince: **Actions → Katalog görselleri ve feed'ler → ⋯ → Disable workflow**.
