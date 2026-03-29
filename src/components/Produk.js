'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, CheckSquare, Square, Trash } from 'lucide-react'
import { formatRupiah } from '../utils/helpers'

export default function Produk({ produk, onTambah, onEdit, onHapus, onHapusTerpilih }) {
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('')
  const [selectedItems, setSelectedItems] = useState([])

  // ambil kategori unik
  const kategoriList = [...new Set(produk.map((p) => p.kategori))].sort()

  const filtered = produk.filter((p) => {
    const cocokNama = p.nama.toLowerCase().includes(search.toLowerCase())
    const cocokKategori = filterKategori ? p.kategori === filterKategori : true
    return cocokNama && cocokKategori
  })

  // toggle select per item
  const toggleSelect = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  // toggle select all
  const toggleSelectAll = () => {
    if (selectedItems.length === filtered.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filtered.map(p => p.id))
    }
  }

  // hapus terpilih
  const handleHapusTerpilih = () => {
    if (selectedItems.length === 0) return
    if (window.confirm(`Yakin hapus ${selectedItems.length} barang terpilih?`)) {
      onHapusTerpilih(selectedItems)
      setSelectedItems([])
    }
  }

  // hapus semua
  const handleHapusSemua = () => {
    if (filtered.length === 0) return
    if (window.confirm(`Yakin hapus SEMUA ${filtered.length} barang?`)) {
      onHapusTerpilih(filtered.map(p => p.id))
      setSelectedItems([])
    }
  }

  const allSelected = selectedItems.length === filtered.length && filtered.length > 0
  const someSelected = selectedItems.length > 0 && selectedItems.length < filtered.length

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

      {/* Action Bar - muncul saat ada yang dipilih */}
      {selectedItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-4 square flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="text-orange-600" size={20} />
            <span className="font-medium text-orange-800">
              {selectedItems.length} barang dipilih
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleHapusTerpilih}
              className="bg-red-500 text-white px-4 py-2 square flex items-center gap-2 hover:bg-red-600"
            >
              <Trash size={16} />
              Hapus Terpilih
            </button>
            <button
              onClick={() => setSelectedItems([])}
              className="bg-gray-200 text-gray-700 px-4 py-2 square hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 square overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600 w-12">
                <button
                  onClick={toggleSelectAll}
                  className="text-gray-500 hover:text-primary"
                  title={allSelected ? "Batalkan semua" : "Pilih semua"}
                >
                  {allSelected ? (
                    <CheckSquare size={18} className="text-primary" />
                  ) : someSelected ? (
                    <div className="relative">
                      <Square size={18} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-sm" />
                      </div>
                    </div>
                  ) : (
                    <Square size={18} />
                  )}
                </button>
              </th>
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
            {filtered.map((item) => {
              const isSelected = selectedItems.includes(item.id)
              return (
                <tr 
                  key={item.id} 
                  className={`hover:bg-gray-50 ${isSelected ? 'bg-orange-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleSelect(item.id)}
                      className="text-gray-500 hover:text-primary"
                    >
                      {isSelected ? (
                        <CheckSquare size={18} className="text-primary" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </td>
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
                        title="Edit"
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
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            Barang nggak ketemu
          </p>
        )}
      </div>

      {/* Footer dengan info dan hapus semua */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-500">
          <div>
            Menampilkan {filtered.length} dari {produk.length} barang
            {selectedItems.length > 0 && (
              <span className="ml-2 text-orange-600">
                ({selectedItems.length} dipilih)
              </span>
            )}
          </div>
          <button
            onClick={handleHapusSemua}
            className="text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 size={14} />
            Hapus Semua ({filtered.length})
          </button>
        </div>
      )}
    </div>
  )
}