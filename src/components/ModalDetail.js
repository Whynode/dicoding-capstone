'use client'
import { X } from 'lucide-react'
import { formatRupiah } from '../utils/helpers'

export default function ModalDetail({ isOpen, onClose, transaksi, produk }) {
  if (!isOpen || !transaksi) return null

  const tanggal = new Date(transaksi.tanggal)
  const tanggalFormatted = tanggal.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // hitung keuntungan
  let totalKeuntungan = 0
  transaksi.items.forEach((item) => {
    const produkItem = produk.find((p) => p.id === item.produkId)
    if (produkItem) {
      totalKeuntungan += (item.harga - produkItem.modal) * item.jumlah
    }
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg square p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Detail Penjualan</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500">ID Transaksi</p>
            <p className="font-mono text-sm">{transaksi.id}</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <p className="text-sm text-gray-500">Tanggal</p>
            <p>{tanggalFormatted}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-3">Barang Dibeli</p>
            <div className="space-y-2">
              {transaksi.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.nama}</p>
                    <p className="text-sm text-gray-500">
                      {formatRupiah(item.harga)} × {item.jumlah}
                    </p>
                    {(() => {
                      const produkItem = produk.find((p) => p.id === item.produkId)
                      return produkItem?.kategori ? (
                        <p className="text-xs text-gray-400 mt-1">
                          {produkItem.kategori}
                        </p>
                      ) : null
                    })()}
                  </div>
                  <p className="font-semibold">
                    {formatRupiah(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 square mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Bayar</span>
              <span className="text-xl font-bold text-primary">
                {formatRupiah(transaksi.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Laba</span>
              <span className="font-semibold text-green-600">
                {formatRupiah(totalKeuntungan)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 square hover:bg-gray-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}