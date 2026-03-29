# PRD - PELPAY (Sistem Kasir Warung Madura)

## 1. Project Overview

### Project Name
**PELPAY** - Aplikasi Kasir Sederhana untuk Warung Madura

### Project Type
Web Application (Single Page Application)

### Core Functionality
Sistem kasir berbasis web untuk mencatat penjualan, mengelola produk, dan melihat riwayat transaksi pada Warung Madura. Data disimpan secara lokal di browser menggunakan localStorage.

### Target Users
- Pemilik warung madura
- Kasir / admin operasional

---

## 2. Technology Stack

### Frontend Framework
- **Next.js 14** (App Router)
- **React 18** (via Next.js)

### Styling
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Custom CSS** - Untuk overrides spesifik

### Icons
- **lucide-react** - Library icon SVG (bukan emoji)

### State Management
- React useState + useEffect
- localStorage untuk persistensi data

### Data Storage
- **localStorage** - Penyimpanan lokal browser
- Format: JSON

### Programming Language
- **JavaScript** (bukan TypeScript - lebih sederhana untuk tugas akhir)
- ES6+ syntax

---

## 3. Arsitektur Aplikasi

### Folder Structure
```
pelpay/
├── src/
│   ├── app/
│   │   ├── globals.css      # Reset & base styles
│   │   ├── layout.js        # Root layout (font, metadata)
│   │   └── page.js          # Main page (state holder)
│   ├── components/
│   │   ├── Sidebar.js       # Navigasi sidebar
│   │   ├── Dashboard.js     # Halaman dashboard
│   │   ├── Kasir.js         # Halaman kasir (POS)
│   │   ├── Produk.js        # Manajemen produk
│   │   ├── Riwayat.js       # Riwayat transaksi
│   │   ├── ModalProduk.js   # Modal tambah/edit produk
│   │   └── ModalDetail.js   # Modal detail transaksi
│   ├── data/
│   │   └── produk.js        # Data produk awal (seed)
│   └── utils/
│       └── helpers.js       # Utility functions
├── public/                  # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

### Component Hierarchy
```
page.js (Main Container - State Holder)
├── Sidebar (Navigation)
├── Dashboard (Stats View)
├── Kasir (POS + Cart)
├── Produk (CRUD Table)
├── Riwayat (Transaction List)
├── ModalProduk (Add/Edit Product Form)
└── ModalDetail (Transaction Detail Modal)
```

---

## 4. Fitur & Requirements

### 4.1 Dashboard
- **Total Pendapatan Hari Ini** - Jumlah penjualan hari ini
- **Total Transaksi Hari Ini** - Jumlah transaksi hari ini
- **Jumlah Produk** - Total produk terdaftar
- **Produk Terjual Hari Ini** - Item terjual hari ini
- Tampilan: 4 card statistik dengan icon

### 4.2 Kasir (Point of Sale)
- **Daftar Produk** - Grid produk yang bisa diklik untuk menambah ke keranjang
- **Keranjang Belanja** - Daftar item yang dipilih
  - Nama produk
  - Jumlah (tombol + / -)
  - Subtotal per item
  - Hapus item
- **Total Pembayaran** - Akumulasi total
- **Tombol Bayar** - Simpan transaksi ke riwayat
- **Tombol Reset** - Kosongkan keranjang

### 4.3 Manajemen Produk (CRUD)
- **Daftar Produk** - Tabel dengan kolom: Nama, Harga, Stok, Aksi
- **Tambah Produk** - Modal form: Nama, Harga, Stok
- **Edit Produk** - Modal form pre-filled dengan data produk
- **Hapus Produk** - Konfirmasi sebelum hapus
- Pencarian produk (filter by nama)

### 4.4 Riwayat Transaksi
- **Daftar Transaksi** - Tabel: ID, Tanggal, Total, Aksi
- **Detail Transaksi** - Modal showing semua item purchased
- Filter berdasarkan tanggal

---

## 5. Data Models

### Produk
```javascript
{
  id: string,          // UUID
  nama: string,        // Nama produk
  harga: number,       // Harga per unit
  stok: number         // Stok tersedia
}
```

### Transaksi
```javascript
{
  id: string,                    // UUID
  tanggal: string,               // ISO date string
  items: [
    {
      produkId: string,
      nama: string,
      harga: number,
      jumlah: number,
      subtotal: number
    }
  ],
  total: number                  // Total pembayaran
}
```

### localStorage Keys
- `pelpay_produk` - Array produk
- `pelpay_transaksi` - Array transaksi

---

## 6. Design System

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Primary Orange | `#f97316` | Tombol utama, highlight |
| Primary Orange Dark | `#ea580c` | Hover state |
| White | `#ffffff` | Background |
| Gray 50 | `#f9fafb` | Background alt |
| Gray 100 | `#f3f4f6` | Card background |
| Gray 200 | `#e5e7eb` | Border |
| Gray 500 | `#6b7280` | Text secondary |
| Gray 700 | `#374151` | Text primary |
| Gray 900 | `#111827` | Heading |
| Red 500 | `#ef4444` | Tombol hapus |
| Green 500 | `#22c55e` | Success state |

### Typography
- **Font Family**: `'JetBrains Mono', monospace`
- **Ukuran**:
  - Heading 1: 24px
  - Heading 2: 20px
  - Body: 14px
  - Small: 12px

### Design Principles (Anti-AI Detection)
- **Square Corners** - Semua element menggunakan `rounded-none`
- **No Gradients** - Flat solid colors
- **Manual Spacing** - Tidak selalu konsisten, ada variasi
- **Simple Icons** - lucide-react (bervariasi ukuran)
- **Native Feel** - Terlihat seperti dibuat manusia, bukan generator
- **No Animations** - Efek transisi minimal atau tidak ada

### Component Style Guide
```css
/* Button Primary */
background: #f97316;
color: white;
padding: 8px 16px;
border: none;
border-radius: 0;  /* PENTING - square */

/* Card */
background: #f3f4f6;
border: 1px solid #e5e7eb;
border-radius: 0;  /* PENTING - square */
padding: 16px;

/* Input */
border: 1px solid #e5e7eb;
border-radius: 0;  /* PENTING - square */
padding: 8px 12px;
```

---

## 7. Menu Structure

### Sidebar Navigation
1. **Dashboard** - Icon: LayoutDashboard
2. **Kasir** - Icon: ShoppingCart
3. **Produk** - Icon: Package
4. **Riwayat** - Icon: History

### Page Flow
```
┌─────────────────────────────────────────────┐
│  SIDEBAR          │     MAIN CONTENT        │
│  ─────────────    │     ──────────────      │
│  □ Dashboard      │     [Halaman aktif]      │
│  □ Kasir          │                          │
│  □ Produk         │                          │
│  □ Riwayat        │                          │
│                   │                          │
└─────────────────────────────────────────────┘
```

---

## 8. Non-Functional Requirements

### Performance
- Initial load < 3 detik
- Responsive pada resolusi 1024px keatas

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Edge (latest)

### Keamanan
- Tidak ada data sensitif disimpan
- Sanitasi input untuk mencegah XSS (React handles this)

### Maintainability
- Kode dipecah menjadi komponen kecil
- Naming convention konsisten (camelCase)
- Komentar minimal (kode self-explanatory)

---

## 9. Acceptance Criteria

### Must Pass
- [ ] Dashboard menampilkan 4 statistik dengan benar
- [ ] Kasir bisa menambah produk ke keranjang
- [ ] Kasir bisa mengubah jumlah item
- [ ] Kasir bisa menghapus item dari keranjang
- [ ] Pembayaran menyimpan transaksi ke riwayat
- [ ] Produk bisa ditambahkan dengan form modal
- [ ] Produk bisa diedit dengan form modal
- [ ] Produk bisa dihapus dengan konfirmasi
- [ ] Riwayat menampilkan semua transaksi
- [ ] Detail transaksi bisa dilihat per transaksi
- [ ] Data tersimpan di localStorage (persisten setelah refresh)
- [ ] Semua sudut element adalah kotak (square)
- [ ] Icon menggunakan lucide-react (bukan emoji)

### Visual Checkpoints
- [ ] Tema Putih dan Oranye terlihat
- [ ] Font JetBrains Mono diterapkan
- [ ] Tampilan tidak terlihat seperti hasil AI generator
- [ ] Desain clean tapi "handmade"

---

## 10. Development Notes

### Cara Menjalankan
```bash
# Development
npm run dev
# Akses: http://localhost:3000

# Production Build
npm run build
npm start

# Install dependencies
npm install
```

### Dependencies
```json
{
  "next": "^14.2.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.300.0",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

### Key Implementation Details
1. State management di page.js (lifting state up)
2. Setiap komponen menerima props untuk data & callbacks
3. localStorage di-load saat mount, di-save saat ada perubahan
4. Generate ID menggunakan Date.now() + random untuk kesederhanaan
5. Format Rupiah dengan Intl.NumberFormat('id-ID')

---

## 11. Penutup

Dokumen ini merupakan acuan pengembangan aplikasi PELPAY. 
Setiap perubahan fitur harus didokumentasikan dan disesuaikan dengan acceptance criteria.

---

*Generated for Tugas Akhir - PELPAY System*