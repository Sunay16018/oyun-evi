---
title: Oyun Evi
emoji: 🎮
colorFrom: blue
colorTo: purple
sdk: static
pinned: false
---

# 🎮 Oyun Evi

Tamamen istemci tarafında çalışan, modern ve göz alıcı bir oyun platformu.

## Özellikler

- 🎯 Dinamik oyun yükleme sistemi (JSON tabanlı)
- 🎨 Neon temalı karanlık arayüz
- 📱 Duyarlı (responsive) tasarım
- 🕹️ Canvas tabanlı labirent oyunu
- 🔮 Glassmorphism efektleri

## Oyunlar

- **Zorlabireni** - Yön tuşlarıyla oynanan labirent oyunu

## Nasıl Oyun Eklenir?

1. `oyunlar/` klasörü içinde yeni bir alt klasör oluşturun
2. Oyun dosyalarınızı (`index.html`, `style.css`, `script.js`) bu klasöre yerleştirin
3. Bir ikon resmi ekleyin (`ikon.png`)
4. `oyun-listesi.json` dosyasına yeni bir nesne ekleyin

```json
{
    "id": "yeni-oyun",
    "ad": "Yeni Oyun",
    "ikon": "oyunlar/yeni-oyun/ikon.png",
    "baglanti": "oyunlar/yeni-oyun/index.html"
}
```

Hepsi bu kadar! Ana sayfa otomatik olarak yeni oyunu gösterecektir.
