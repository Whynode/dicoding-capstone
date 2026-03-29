# PRD - PELPAY (Kasir Warung Madura)

## 1. Project Overview

### Project Name
**PELPAY** - Aplikasi Kasir Sederhana buat Warung Madura

### Project Type
Web App (Single Page Application)

### Core Functionality
Sistem kasir web base buat nyatet jualan, ngatur produk, sama ngeliat riwayat transaksi warung madura. Datanya langsung disimpen di cloud pake Supabase biar sinkron di semua device.

### Target Users
- Pemilik warung madura
- Kasir / yang jaga warung

---

## 2. Technology Stack

### Frontend Framework
- **Next.js 14** (App Router)
- **React 18** 

### Styling
- **Tailwind CSS 3.x** - Pake ini aja biar cepet
- **Custom CSS** - Buat yang aneh-aneh dikit

### Icons
- **lucide-react** - Ga pake emoji, pake ini biar rapi

### State Management
- React useState + useEffect
- Supabase API buat nyimpen datanya

### Programming Language
- **JavaScript** (gausah pake TypeScript, pusing nanti pas demo)

---

## 3. Arsitektur Aplikasi

### Folder Structure
```
pelpay/
├── src/
│   ├── app/
│   │   ├── globals.css      # Base css nya
│   │   ├── layout.js        # Root font dll
│   │   └── page.js          # Main page, semua state numpuk disini aja biar cepet
│   ├── components/
│   │   ├── Sidebar.js       # Navigasi kiri
│   │   ├── Dashboard.js     # Halaman depan
│   │   ├── Kasir.js         # Buat input order
│   │   ├── Produk.js        # Buat nambah/ngedit barang
│   │   ├── Riwayat.js       # Liat histori jualan
│   │   ├── ModalProduk.js   # Popup nambah produk
│   │   └── ModalDetail.js   # Popup detail transaksi
│   ├── data/
│   │   └── produk.js        # Data dummy awal
│   └── utils/
│       └── helpers.js       # Fungsi macem2
│       └── supabase.js      # Koneksi database
```

---

## 4. Fitur & Requirements

### 4.1 Dashboard
- **Total Pendapatan** - Duit masuk hari ini
- **Total Transaksi** - Berapa kali orang beli
- **Jumlah Produk** - Total barang di warung
- **Produk Terjual** - Item yang udah laku

### 4.2 Kasir 
- **Daftar Produk** - List barang yang bisa di-klik buat masuk ke keranjang
- **Keranjang Belanja** - Daftar yang mau dibeli
- **Tombol Bayar** - Simpan ke riwayat
- **Tombol Reset** - Kosongin keranjang kalo gajadi

### 4.3 Manajemen Produk 
- **Daftar Produk** - Liat barang, harga, sama sisa stok
- **Tambah/Edit/Hapus** - Ya standard CRUD lah
- Ada pencariannya juga biar gampang

### 4.4 Riwayat Transaksi
- **Daftar Transaksi** - Keliatan kapan belinya sama totalnya
- **Detail** - Kalo di klik keliatan beli apa aja

---

## 5. Database

### Produk (Supabase)
```javascript
{
  id: string,          
  nama: string,        
  harga: number,       
  stok: number         
}
```

### Transaksi (Supabase)
```javascript
{
  id: string,                    
  tanggal: string,               
  items: JSON,
  total: number                  
}
```

---

## 6. Design System

### Color Palette
Pokoknya temanya Putih Oranye. Biar keliatan terang dan melek.

### Typography
- **Font**: Inter
- Teks standar aja, yang penting kebaca.

### Design Principles
- **Membulat** - Sudutnya di round 20px biar kekinian
- **Shadow tipis** - Biar mirip aplikasi beneran
- **Night Mode** - Ada fitur mode gelap
- Engga usah tralu kaku, yang penting enak diliat.

---

## 7. Pembagian Tugas Kelompok
Biar adil ngerjainnya dibagi-bagi:
- **Arya (UI/UX)**: Bikin desain, ngatur warna, layouting, sama komponen Sidebar. Ngatur CSS nya juga.
- **Joan (Backend)**: Setup API Supabase, benerin query, auth (kalo ada), dan logic fetch data.
- **Salma (Frontend)**: Ngerjain page Kasir, Riwayat, state management keranjang.
- **Ellen (Frontend)**: Ngerjain Dashboard, modal Produk, list Produk, sama fixing bug tampilan.

---

## 8. Catatan Dev
Cara jalanin di laptop masing-masing:
```bash
npm install
npm run dev
# Buka localhost:3000
```

Jangan lupa `.env.local` nya diisi API Supabase dari Joan. Kalo error kabari di grup.

---
*Tugas Akhir - Kelompok PELPAY*