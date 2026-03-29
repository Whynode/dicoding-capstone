'use client'
import { useState } from 'react'
import { Plus, Minus, Trash2, ShoppingCart, Search } from 'lucide-react'
import { formatRupiah } from '../utils/helpers'

export default function Kasir({
  produk,
  keranjang,
  tambahKeKeranjang,
  kurangDariKeranjang,
  hapusDariKeranjang,
  simpanOrder,
  resetKeranjang,
}) {
  const [search, setSearch] = useState('')
  const total = keranjang.reduce((sum, item) => sum + item.subtotal, 0)

  // filter produk berdasarkan search
  const filteredProduk = produk.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:p-4 h-full">
      {/* Daftar Produk */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Kasir</h2>
        
        {/* Search bar */}
        <div className="bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 p-4 square mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Cari barang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 pl-10 pr-4 py-2 square focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProduk.map((item) => (
            <button
              key={item.id}
              onClick={() => tambahKeKeranjang(item)}
              disabled={item.stok === 0}
              className={`bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 p-4 square text-left hover:bg-orange-50 transition-colors ${
                item.stok === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.nama}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.kategori}</p>
                  <p className="text-primary font-bold">{formatRupiah(item.harga)}</p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Stok: {item.stok}</span>
              </div>
            </button>
          ))}
          {filteredProduk.length === 0 && (
            <p className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              Barang tidak ditemukan
            </p>
          )}
        </div>
      </div>

      {/* Keranjang */}
      <div className="w-full lg:w-96 bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 p-4 sm:p-4 square flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart size={20} />
          <h3 className="font-semibold">Belanjaan</h3>
        </div>

        {keranjang.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Keranjang masih kosong</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3">
            {keranjang.map((item) => (
              <div
                key={item.produkId}
                className="border-b border-gray-100 dark:border-gray-700 pb-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{item.nama}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatRupiah(item.harga)} × {item.jumlah}
                    </p>
                  </div>
                  <button
                    onClick={() => hapusDariKeranjang(item.produkId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => kurangDariKeranjang(item.produkId)}
                      className="bg-gray-100 dark:bg-gray-800 p-1 square"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.jumlah}</span>
                    <button
                      onClick={() => tambahKeKeranjang(
                        produk.find((p) => p.id === item.produkId)
                      )}
                      className="bg-gray-100 dark:bg-gray-800 p-1 square"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-semibold">{formatRupiah(item.subtotal)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary">
              {formatRupiah(total)}
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={simpanOrder}
              disabled={keranjang.length === 0}
              className="w-full bg-primary text-white py-3 square font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bayar Sekarang
            </button>
            <button
              onClick={resetKeranjang}
              disabled={keranjang.length === 0}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 square hover:bg-gray-200 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}