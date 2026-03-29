'use client'
import { TrendingUp, ShoppingCart, Package, AlertTriangle, Clock, Star, BarChart3, Users, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { formatRupiah, hitungPendapatanHariIni, hitungJumlahTransaksiHariIni } from '../utils/helpers'

// Bikin UI dashboard: Ellen & Arya
// Hitung-hitungan math nya by Salma

export default function Dashboard({ produk, transaksi }) {
  const pendapatanHariIni = hitungPendapatanHariIni(transaksi)
  const transaksiHariIni = hitungJumlahTransaksiHariIni(transaksi)
  const totalProduk = produk.length

// cek prdk trjual
  const transaksiHari = transaksi.filter((t) => {
    const today = new Date()
    const date = new Date(t.tanggal)
    return (
      date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
    )
  })

  let produkTerjualHariIni = 0
	transaksiHari.forEach((t) => {
    t.items.forEach((item) => { produkTerjualHariIni += item.jumlah })
  })

// batesin 10 yg mau abis
  const stokRendah = produk.filter((p) => p.stok < 10).slice(0, 8)
  const transaksiTerakhir = [...transaksi].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 5)

// ngitung barang laku (salma)
  const barangCount = {}
    transaksi.forEach(t => {
      t.items.forEach(item => {
        barangCount[item.nama] = (barangCount[item.nama] || 0) + item.jumlah
      })
    })
  const barangTerlaris = Object.entries(barangCount).sort(([,a], [,b]) => b - a).slice(0, 5)

  const totalOmset = transaksi.reduce((sum, t) => sum + t.total, 0)
  const rataRata = transaksi.length > 0 ? totalOmset / transaksi.length : 0

  const cards = [
    { title: 'Pemasukan Hari Ini', value: formatRupiah(pendapatanHariIni), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', change: '+12%', up: true },
    { title: 'Order Hari Ini', value: transaksiHariIni, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', change: '+5%', up: true },
    { title: 'Jml Barang', value: totalProduk, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', change: `${stokRendah.length} mau abis`, up: false },
    { title: 'Barang Laku', value: produkTerjualHariIni, icon: Star, color: 'text-orange-600', bg: 'bg-orange-50', change: '+8%', up: true },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 p-4 square hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`${card.bg} p-2 square`}><Icon className={card.color} size={20} /></div>
                <div className={`flex items-center text-xs ${card.up ? 'text-green-600' : 'text-red-500'}`}>
                  {card.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  <span className="ml-1">{card.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
              <p className="text-xl font-bold mt-1">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 p-4 square">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-500" size={18} />
            <h3 className="font-semibold">Beli Terakhir</h3>
          </div>
          
          {transaksiTerakhir.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Kosong blok</p>
          ) : (
            <div className="space-y-3">
              {transaksiTerakhir.map((t) => {
                const waktu = new Date(t.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                return (
                  <div key={t.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{waktu}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.items.length} item</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">{formatRupiah(t.total)}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 p-4 square">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-orange-500" size={18} />
            <h3 className="font-semibold">Barang Terlaris</h3>
          </div>
          {barangTerlaris.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Lom ada</p>
          ) : (
            <div className="space-y-3">
              {barangTerlaris.map(([nama, jumlah]) => (
                <div key={nama}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium truncate">{nama}</span>
                    <span className="text-gray-500 dark:text-gray-400">{jumlah} laku</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}