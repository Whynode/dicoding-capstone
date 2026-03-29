'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { formatRupiah } from '../utils/helpers'

export default function Produk({ produk, onTambah, onEdit, onHapus }) {
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('')

  // ambil kategori unik
  const kategoriList = [...new Set(produk.map((p) => p.kategori))].sort()

  const filtered = produk.filter((p) => {
    const cocokNama = p.nama.toLowerCase().includes(search.toLowerCase())
    const cocokKategori = filterKategori ? p.kategori === filterKategori : true
    return cocokNama && cocokKategori
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Kelola Barang</h2>
        <button
          onClick={onTambah}
          className="bg-primary text-white px-4 py-2 square flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} />
          Tambah Barang
        </button>
      </div>

      <div className="bg-white border border-gray-200 p-4 square">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-200 px-4 py-2 square focus:outline-none focus:border-primary"
          />
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="border border-gray-200 px-4 py-2 square focus:outline-none focus:border-primary bg-white"
          >
            <option value="">Semua Kategori</option>
            {kategoriList.map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 square overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Barang
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Kategori
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Harga
              </th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">
                Stok
              </th>
              <th className="text-right px-4 py-3 text-sm font-semibold text-gray-600">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.nama}</td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {item.kategori}
                </td>
                <td className="px-4 py-3 text-primary">
                  {formatRupiah(item.harga)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-semibold ${
                      item.stok < 5 ? 'text-red-500' : 'text-gray-700'
                    }`}
                  >
                    {item.stok}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus ${item.nama}?`)) {
                          onHapus(item.id)
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            Barang nggak ketemu
          </p>
        )}
      </div>
    </div>
  )
}