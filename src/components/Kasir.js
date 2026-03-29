'use client'
import { Plus, Minus, Trash2, ShoppingCart, Info } from 'lucide-react'
import { formatRupiah } from '../utils/helpers'

// Page kasir dibuat by Salma
// Design di bantu Arya

export default function Kasir({ produk, keranjang, tambahKeKeranjang, kurangDariKeranjang, hapusDariKeranjang, simpanOrder, resetKeranjang }) {
  const totalBarang = keranjang.reduce((sum, item) => sum + item.jumlah, 0)
    const totalHarga = keranjang.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Grid Produk */}
      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-2xl font-bold mb-4">Pilih Barang</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto pb-4 pr-2">
          {produk.map((item) => (
            <button
				key={item.id}
              onClick={() => tambahKeKeranjang(item)}
              disabled={item.stok === 0}
              className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 sm:p-5 square text-left hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors ${
                item.stok === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.nama}</h3>
              <p className="text-primary font-medium mt-1">{formatRupiah(item.harga)}</p>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span>Stok: {item.stok}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 sm:p-5 square flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart size={20} />
            Keranjang
          </h2>
          <span className="bg-primary text-white text-xs px-2 py-1 square">
			{totalBarang} item
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-[200px]">
          {keranjang.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <ShoppingCart size={48} className="mb-2 opacity-20" />
              <p>Belom ado yg dibeli</p>
            </div>
          ) : (
            keranjang.map((item) => (
              <div key={item.produkId} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex-1 pr-2">
			<h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">{item.nama}</h4>
                  <p className="text-primary font-semibold text-sm">
                    {formatRupiah(item.subtotal)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-100 dark:border-gray-700 square">
                    <button onClick={() => kurangDariKeranjang(item.produkId)} className="bg-gray-100 dark:bg-gray-800 p-1 square hover:bg-gray-200 dark:hover:bg-gray-700"><Minus size={16} /></button>
					<span className="w-8 text-center text-sm font-medium">{item.jumlah}</span>
                    <button onClick={() => tambahKeKeranjang(item)} className="bg-gray-100 dark:bg-gray-800 p-1 square hover:bg-gray-200 dark:hover:bg-gray-700"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => hapusDariKeranjang(item.produkId)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1 square border border-transparent hover:border-red-200"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatRupiah(totalHarga)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={resetKeranjang} disabled={keranjang.length === 0} className="w-1/3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 square hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50">Reset</button>
            <button onClick={simpanOrder} disabled={keranjang.length === 0} className="w-2/3 bg-primary text-white py-2 square hover:bg-primary-dark disabled:opacity-50">Bayar</button>
          </div>
        </div>
      </div>
    </div>
  )
}