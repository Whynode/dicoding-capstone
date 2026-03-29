'use client'
import { useState } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { formatRupiah, hitungKeuntungan } from '../utils/helpers'

// page riwayat by Salma
// ui table dibantu arya

export default function Riwayat({ transaksi, produk, onLihatDetail, onHapus }) {
  const [filterTanggal, setFilterTanggal] = useState('')

  if (!transaksi || !Array.isArray(transaksi)) { transaksi = [] }
  if (!produk || !Array.isArray(produk)) { produk = [] }
  
  const filtered = filterTanggal
    ? transaksi.filter((t) => {
        const tanggal = new Date(t.tanggal).toISOString().split('T')[0]
        return tanggal === filterTanggal
      })
    : transaksi

  const sorted = [...filtered].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    const totalKeuntungan = hitungKeuntungan(sorted, produk)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Riwayat Penjualan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Laba: <span className="font-semibold text-green-600">{formatRupiah(totalKeuntungan)}</span></p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Lihat Tgl:</label>
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 px-3 py-2 square focus:outline-none focus:border-primary"
          />
          {filterTanggal && (
            <button onClick={() => setFilterTanggal('')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700">Semua</button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 square overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">ID</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Tanggal</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Laba</th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((transaksi) => {
              let keuntungan = 0
              if (transaksi.items && Array.isArray(transaksi.items)) {
                transaksi.items.forEach((item) => {
                  const produkItem = produk.find((p) => p.id === item.produkId)
                  if (produkItem && typeof produkItem.modal !== 'undefined') {
                    keuntungan += (item.harga - produkItem.modal) * item.jumlah
                  }
                })
              }

              const tanggal = new Date(transaksi.tanggal)
			const tanggalFormatted = tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

              return (
                <tr key={transaksi.id} className="hover:bg-gray-50 dark:bg-gray-900/50">
                  <td className="px-4 py-3 font-mono text-sm">{String(transaksi.id || '').slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm">{tanggalFormatted}</td>
                  <td className="px-4 py-3 font-semibold">{formatRupiah(transaksi.total)}</td>
                  <td className="px-4 py-3 text-green-600 font-semibold">{formatRupiah(keuntungan)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onLihatDetail(transaksi)} className="text-blue-600 hover:text-blue-800 p-1"><Eye size={16} /></button>
                      <button onClick={() => onHapus(transaksi.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <p className="text-center py-8 text-gray-500">Belum ada transaksi bro</p>
        )}
      </div>
    </div>
  )
}