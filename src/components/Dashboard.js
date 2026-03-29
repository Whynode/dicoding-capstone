'use client'
import { 
  ShoppingCart, Package, AlertTriangle, Clock, BarChart3
} from 'lucide-react'
import { formatRupiah, hitungPendapatanHariIni, hitungJumlahTransaksiHariIni } from '../utils/helpers'

export default function Dashboard({ produk, transaksi }) {
  const pendapatanHariIni = hitungPendapatanHariIni(transaksi)
  const transaksiHariIni = hitungJumlahTransaksiHariIni(transaksi)
  const totalOmset = transaksi.reduce((sum, t) => sum + t.total, 0)
  
  // Transaksi Terakhir (5)
  const transaksiTerakhir = [...transaksi]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0, 5)

  // Stok Rendah
  const stokRendah = produk.filter((p) => p.stok < 10).slice(0, 8)

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <div className="text-center pt-6 pb-8 -mx-4 -mt-4 bg-white dark:bg-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-4 rounded-b-[40px] mb-8">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3">
          Pendapatan Hari Ini
        </p>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
          {formatRupiah(pendapatanHariIni)}
        </h1>
        <div className="mt-4 inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Live Update</span>
        </div>
      </div>

      {/* Quick Metrics Scrollable */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <div className="min-w-[140px] snap-center bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
            <ShoppingCart size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold">{transaksiHariIni}</p>
            <p className="text-xs text-gray-500 font-medium">Orderan Baru</p>
          </div>
        </div>

        <div className="min-w-[140px] snap-center bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center mb-4">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">{formatRupiah(totalOmset).replace('Rp', '').trim()}</p>
            <p className="text-xs text-gray-500 font-medium">Total Omset</p>
          </div>
        </div>

        <div className="min-w-[140px] snap-center bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
            <Package size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold">{produk.length}</p>
            <p className="text-xs text-gray-500 font-medium">Total Produk</p>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* Transaksi List */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-lg tracking-tight">Transaksi Terakhir</h3>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            {transaksiTerakhir.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Belum ada transaksi</p>
            ) : (
              <div className="space-y-1">
                {transaksiTerakhir.map((t) => {
                  const waktu = new Date(t.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={t.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Order #{t.id.slice(0,4).toUpperCase()}</p>
                          <p className="text-xs text-gray-500">{t.items.length} item • {waktu}</p>
                        </div>
                      </div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">
                        {formatRupiah(t.total)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stok Warning */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-lg tracking-tight">Stok Kritis</h3>
            {stokRendah.length > 0 && (
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{stokRendah.length} Peringatan</span>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-2 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            {stokRendah.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Semua stok aman 🎉</p>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {stokRendah.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.nama}</p>
                        <p className="text-xs text-gray-500">{item.kategori}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-red-500">{item.stok} Sisa</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    
    </div>
  )
}