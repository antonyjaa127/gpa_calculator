# GPA Hesaplayıcı

Modern ve kullanıcı dostu GPA hesaplama uygulaması.

## Özellikler

- 🎯 Dönemlik GPA hesaplama
- 📊 Kümülatif (genel) GPA hesaplama
- 🎨 Modern glassmorphism tasarım
- 📱 Mobil uyumlu responsive arayüz
- ⚡ Hızlı ve güvenilir hesaplama

## Teknolojiler

**Backend:**
- FastAPI (Python)
- Pydantic (veri doğrulama)
- Uvicorn (ASGI server)

**Frontend:**
- React + TypeScript
- Material-UI (MUI)
- Vite (build tool)
- React Hook Form + Zod

## Kurulum ve Çalıştırma

### Hızlı Başlangıç (Tek Komut)

1. **Windows'ta:**
   ```bash
   start.bat
   ```
   veya çift tıklayın.

2. **Terminal'de:**
   ```bash
   cd frontend
   npm run start
   ```

### Manuel Kurulum

1. **Backend kurulumu:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r backend\requirements.txt
   ```

2. **Frontend kurulumu:**
   ```bash
   cd frontend
   npm install
   ```

3. **Ayrı ayrı çalıştırma:**
   ```bash
   # Terminal 1 - Backend
   .venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

## Kullanım

1. Tarayıcınızda `http://localhost:5173` adresine gidin
2. Daha önceki GPA'nız varsa anahtarı açın ve bilgilerinizi girin
3. Bu dönem aldığınız dersleri ve notlarınızı ekleyin
4. "Hesapla" butonuna tıklayın
5. Dönemlik ve genel GPA'nızı görün

## Not Sistemi

Uygulama hem harf notlarını hem de sayısal notları destekler:

**Harf Notları:**
- AA = 4.0
- BA = 3.5  
- BB = 3.0
- CB = 2.5
- CC = 2.0
- DC = 1.5
- DD = 1.0
- FF = 0.0

**Sayısal Notlar:** 0.0 - 4.0 arası herhangi bir değer

## API Endpoints

- `GET /health` - Sağlık kontrolü
- `POST /api/calculate` - GPA hesaplama

## Geliştirme

Proje modern web geliştirme standartlarına uygun olarak geliştirilmiştir:

- Type safety (TypeScript)
- Form validation (Zod)
- Responsive design (MUI Grid)
- Modern CSS (Glassmorphism)
- API validation (Pydantic)
