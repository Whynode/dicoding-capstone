// Fungsi2 bantuan (helpers) by Joan
// Biar ga pusing dibikin disini aja semua

export function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(angka)
}

export function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// cek hari ini bkn
export function isToday(dateString) {
  const today = new Date()
    const date = new Date(dateString)
  return (
    date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
  )
}

export function hitungPendapatanHariIni(transaksi) {
  return transaksi.filter((t) => isToday(t.tanggal)).reduce((total, t) => total + t.total, 0)
}

export function hitungJumlahTransaksiHariIni(transaksi) {
  return transaksi.filter((t) => isToday(t.tanggal)).length
}

// ngitung untungnya brp (modal vs jual)
export function hitungKeuntungan(transaksi, produkList) {
  let totalKeuntungan = 0
  if (!Array.isArray(transaksi) || !Array.isArray(produkList)) return 0
    transaksi.forEach((t) => {
      if (t.items && Array.isArray(t.items)) {
        t.items.forEach((item) => {
          const produk = produkList.find((p) => p.id === item.produkId)
          if (produk && typeof produk.modal !== 'undefined' && typeof item.harga !== 'undefined' && typeof item.jumlah !== 'undefined') {
            totalKeuntungan += (item.harga - produk.modal) * item.jumlah
          }
        })
      }
    })
  return totalKeuntungan
}