'use client'
import { 
  TrendingUp, ShoppingCart, Package, AlertTriangle, 
  Clock, Star, BarChart3, Users, Calendar, ArrowUp, ArrowDown 
} from 'lucide-react'
import { formatRupiah, hitungPendapatanHariIni, hitungJumlahTransaksiHariIni } from '../utils/helpers'

export default function Dashboard({ produk, transaksi }) {
  const pendapatanHariIni = hitungPendapatanHariIni(transaksi)
  const transaksiHariIni = hitungJumlahTransaksiHariIni(transaksi)
  const totalProduk = produk.length

  // hitung produk terjual hari ini
  const transaksiHari = transaksi.filter((t) => {
    const today = new Date()
    const date = new Date(t.tanggal)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  })

  let produkTerjualHariIni = 0
  transaksiHari.forEach((t) => {
    t.items.forEach((item) => {
      produkTerjualHariIni += item.jumlah
    })
  })

  // produk stok rendah (batas 10)
  const stokRendah = produk.filter((p) => p.stok < 10).slice(0, 8)

  // transaksi terakhir (5 terakhir)
  const transaksiTerakhir = [...transaksi]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0, 5)

  // hitung kategori terlaris
  const kategoriCount = {}
  transaksi.forEach(t => {
    t.items.forEach(item => {
      const produkItem = produk.find(p => p.id === item.produkId)
      if (produkItem) {
        kategoriCount[produkItem.kategori] = (kategoriCount[produkItem.kategori] || 0) + item.jumlah
      }
    })
  })
  const kategoriTerlaris = Object.entries(kategoriCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  // hitung barang paling laku
  const barangCount = {}
  transaksi.forEach(t => {
    t.items.forEach(item => {
      barangCount[item.nama] = (barangCount[item.nama] || 0) + item.jumlah
    })
  })
  const barangTerlaris = Object.entries(barangCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  // total omset (semua waktu)
  const totalOmset = transaksi.reduce((sum, t) => sum + t.total, 0)

  // rata-rata per transaksi
  const rataRata = transaksi.length > 0 ? totalOmset / transaksi.length : 0

  const cards = [
    {
      title: 'Pemasukan Hari Ini',
      value: formatRupiah(pendapatanHariIni),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      change: '+12%',
      up: true,
    },
    {
      title: 'Orderan Hari Ini',
      value: transaksiHariIni,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: '+5%',
      up: true,
    },
    {
      title: 'Jumlah Barang',
      value: totalProduk,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: `${stokRendah.length} stok rendah`,
      up: false,
    },
    {
      title: 'Barang Laku Hari Ini',
      value: produkTerjualHariIni,
      icon: Star,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      change: '+8%',
      up: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>

      {/* Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white border border-gray-200 p-5 square hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${card.bg} p-2 square`}>
                  <Icon className={card.color} size={20} />
                </div>
                <div className={`flex items-center text-xs ${
                  card.up ? 'text-green-600' : 'text-red-500'
                }`}>
                  {card.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  <span className="ml-1">{card.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-xl font-bold mt-1">{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* Row 2: Statistik Kasir & Produk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaksi Terakhir */}
        <div className="bg-white border border-gray-200 p-5 square">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-500" size={18} />
            <h3 className="font-semibold">Transaksi Terakhir</h3>
          </div>
          
          {transaksiTerakhir.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada transaksi</p>
          ) : (
            <div className="space-y-3">
              {transaksiTerakhir.map((t) => {
                const tanggal = new Date(t.tanggal)
                const waktu = tanggal.toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
                return (
                  <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{waktu}</p>
                      <p className="text-xs text-gray-500">{t.items.length} item</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">
                      {formatRupiah(t.total)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Barang Paling Laku */}
        <div className="bg-white border border-gray-200 p-5 square">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-orange-500" size={18} />
            <h3 className="font-semibold">Barang Paling Laku</h3>
          </div>
          
          {barangTerlaris.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada data penjualan</p>
          ) : (
            <div className="space-y-3">
              {barangTerlaris.map(([nama, jumlah], index) => {
                const maxJumlah = barangTerlaris[0][1]
                const persentase = (jumlah / maxJumlah) * 100
                return (
                  <div key={nama}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium truncate">{nama}</span>
                      <span className="text-gray-500">{jumlah} terjual</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 square">
                      <div 
                        className="bg-orange-500 h-2 square" 
                        style={{ width: `${persentase}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Kategori Terlaris */}
        <div className="bg-white border border-gray-200 p-5 square">
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-purple-500" size={18} />
            <h3 className="font-semibold">Kategori Terlaris</h3>
          </div>
          
          {kategoriTerlaris.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Belum ada data penjualan</p>
          ) : (
            <div className="space-y-3">
              {kategoriTerlaris.map(([kategori, jumlah], index) => {
                const maxJumlah = kategoriTerlaris[0][1]
                const persentase = (jumlah / maxJumlah) * 100
                return (
                  <div key={kategori}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{kategori}</span>
                      <span className="text-gray-500">{jumlah} item</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 square">
                      <div 
                        className="bg-purple-500 h-2 square" 
                        style={{ width: `${persentase}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Statistik Lain & Stok Rendah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statistik Tambahan */}
        <div className="bg-white border border-gray-200 p-5 square">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-green-500" size={18} />
            <h3 className="font-semibold">Statistik Warung</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 square">
              <p className="text-2xl font-bold text-gray-800">{transaksi.length}</p>
              <p className="text-sm text-gray-500">Total Transaksi</p>
            </div>
            <div className="text-center p-4 bg-gray-50 square">
              <p className="text-2xl font-bold text-gray-800">{formatRupiah(totalOmset)}</p>
              <p className="text-sm text-gray-500">Omset Total</p>
            </div>
            <div className="text-center p-4 bg-gray-50 square">
              <p className="text-2xl font-bold text-gray-800">{formatRupiah(rataRata)}</p>
              <p className="text-sm text-gray-500">Rata-rata/Transaksi</p>
            </div>
            <div className="text-center p-4 bg-gray-50 square">
              <p className="text-2xl font-bold text-gray-800">
                {produk.filter(p => p.stok > 0).length}
              </p>
              <p className="text-sm text-gray-500">Barang Tersedia</p>
            </div>
          </div>
        </div>

        {/* Barang Mau Habis */}
        <div className="bg-white border border-gray-200 p-5 square">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={18} />
              <h3 className="font-semibold">Barang Mau Habis</h3>
            </div>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 square">
              {stokRendah.length} barang
            </span>
          </div>
          
          {stokRendah.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Stok semua aman</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {stokRendah.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.nama}</p>
                    <p className="text-xs text-gray-500">{item.kategori}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${
                      item.stok < 3 ? 'text-red-600' : 'text-orange-500'
                    }`}>
                      {item.stok} tersisa
                    </span>
                    <div className="w-20 bg-gray-100 h-1.5 mt-1 square">
                      <div 
                        className={`h-1.5 square ${
                          item.stok < 3 ? 'bg-red-500' : 'bg-orange-400'
                        }`}
                        style={{ width: `${(item.stok / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 p-5 square">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="text-primary" size={18} />
          <h3 className="font-semibold">Aksi Cepat</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-orange-50 hover:bg-orange-100 square transition-colors text-center">
            <ShoppingCart className="mx-auto text-primary mb-2" size={24} />
            <p className="text-sm font-medium">Kasir Baru</p>
          </button>
          <button className="p-4 bg-blue-50 hover:bg-blue-100 square transition-colors text-center">
            <Package className="mx-auto text-blue-600 mb-2" size={24} />
            <p className="text-sm font-medium">Tambah Barang</p>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 square transition-colors text-center">
            <Calendar className="mx-auto text-green-600 mb-2" size={24} />
            <p className="text-sm font-medium">Lihat Laporan</p>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 square transition-colors text-center">
            <Users className="mx-auto text-purple-600 mb-2" size={24} />
            <p className="text-sm font-medium">Kelola Stok</p>
          </button>
        </div>
      </div>
    </div>
  )
}