# GPA Hesaplayıcı - Deploy Rehberi

## Vercel ile Deploy (Önerilen)

### 1. Build Hazırlığı
```bash
cd frontend
npm run build
```

### 2. Vercel Hesabı
1. [vercel.com](https://vercel.com) adresinden ücretsiz hesap aç
2. GitHub hesabınla giriş yap

### 3. Deploy Yöntemleri

#### A) GitHub'dan Otomatik Deploy
1. Projeyi GitHub'a yükle
2. Vercel'de "Import Project" tıkla
3. GitHub repository'ni seç
4. Build settings:
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/dist`
5. Deploy'a tıkla

#### B) CLI ile Deploy
```bash
# Vercel CLI kur
npm i -g vercel

# Login ol
vercel login

# Deploy et
cd frontend
vercel --prod
```

#### C) Drag & Drop Deploy
1. `npm run build` çalıştır
2. `frontend/dist` klasörünü zip'le
3. Vercel'e sürükle bırak

## Netlify ile Deploy

### 1. Build
```bash
cd frontend
npm run build
```

### 2. Deploy
1. [netlify.com](https://netlify.com) hesap aç
2. "Sites" > "Add new site" > "Deploy manually"
3. `frontend/dist` klasörünü sürükle bırak

## GitHub Pages ile Deploy

### 1. GitHub Actions Workflow
`.github/workflows/deploy.yml` dosyası oluştur:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd frontend
        npm install
        
    - name: Build
      run: |
        cd frontend
        npm run build
        
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/dist
```

### 2. Repository Settings
1. Repository > Settings > Pages
2. Source: "GitHub Actions" seç

## Özel Domain (Opsiyonel)

Tüm servisler özel domain destekler:
- **Namecheap**: $8.88/yıl (.com)
- **Cloudflare**: $9.15/yıl (.com)
- **GoDaddy**: $11.99/yıl (.com)

## Performance Optimizasyonu

### Vite Build Optimizasyonu
`frontend/vite.config.ts` dosyasına ekle:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

## SEO ve Meta Tags

`frontend/index.html` dosyasını güncelle:

```html
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Modern ve kullanıcı dostu GPA hesaplama uygulaması. Dönemlik ve kümülatif GPA hesaplayın." />
    <meta name="keywords" content="gpa hesaplama, not ortalaması, üniversite, akademik" />
    <meta name="author" content="GPA Calculator" />
    <meta name="theme-color" content="#667eea" />
    <title>GPA Hesaplayıcı - Not Ortalaması Hesaplama</title>
    
    <!-- Open Graph -->
    <meta property="og:title" content="GPA Hesaplayıcı" />
    <meta property="og:description" content="Modern ve kullanıcı dostu GPA hesaplama uygulaması" />
    <meta property="og:type" content="website" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Maliyet Karşılaştırması

| Servis | Bandwidth | Storage | Fiyat |
|--------|-----------|---------|-------|
| Vercel | 100GB/ay | Sınırsız | Ücretsiz |
| Netlify | 100GB/ay | Sınırsız | Ücretsiz |
| GitHub Pages | 100GB/ay | 1GB | Ücretsiz |
| Firebase | 360MB/gün | 10GB | Ücretsiz |

## Sonuç

**En kolay**: Netlify (drag & drop)
**En profesyonel**: Vercel (GitHub entegrasyonu)
**En güvenilir**: GitHub Pages (Microsoft altyapısı)

Hepsi senin uygulamam için fazlasıyla yeterli! 🚀
