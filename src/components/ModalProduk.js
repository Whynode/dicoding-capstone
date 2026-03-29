'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const kategoriOptions = [
  'Beras & Tepung',
  'Minyak Goreng',
  'Gula',
  'Tepung Terigu',
  'Telur',
  'Susu',
  'Mie Instan',
  'Kopi & Teh',
  'Sereal',
  'Bumbu Dapur',
  'Saus & Sambal',
  'Kalengan',
  'Camilan',
  'Kacang-kacangan',
  'Sayuran Beku',
  'Daging & Ikan',
  'Sayuran Segar',
  'Minuman',
  'Selai & Mentega',
  'Mie Spesial',
  'Margarin',
  'Kebersihan',
  'Kesehatan',
  'Alat Tulis',
]

export default function ModalProduk({ isOpen, onClose, onSave, produk }) {
  const [form, setForm] = useState({
    nama: '',
    harga: '',
    stok: '',
    modal: '',
    kategori: '',
  })

  useEffect(() => {
    if (produk) {
      setForm({
        nama: produk.nama || '',
        harga: produk.harga ? produk.harga.toString() : '',
        stok: produk.stok ? produk.stok.toString() : '',
        modal: produk.modal ? produk.modal.toString() : '',
        kategori: produk.kategori || '',
      })
    } else {
      setForm({ nama: '', harga: '', stok: '', modal: '', kategori: '' })
    }
  }, [produk])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nama || !form.harga || !form.stok || !form.modal || !form.kategori) return

    onSave({
      id: produk?.id,
      nama: form.nama,
      harga: parseInt(form.harga),
      stok: parseInt(form.stok),
      modal: parseInt(form.modal),
      kategori: form.kategori,
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md square p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {produk ? 'Edit Barang' : 'Tambah Barang'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Barang
            </label>
            <input
              type="text"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              className="w-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 px-4 py-2 square focus:outline-none focus:border-primary"
              placeholder="Misal: Nasi Goreng"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
              className="w-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 px-4 py-2 square focus:outline-none focus:border-primary bg-white"
            >
              <option value="">Pilih Kategori</option>
              {kategoriOptions.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga Jual
              </label>
              <input
                type="number"
                value={form.harga}
                onChange={(e) => setForm({ ...form, harga: e.target.value })}
                className="w-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 px-4 py-2 square focus:outline-none focus:border-primary"
                placeholder="Rp"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harga Modal
              </label>
              <input
                type="number"
                value={form.modal}
                onChange={(e) => setForm({ ...form, modal: e.target.value })}
                className="w-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 px-4 py-2 square focus:outline-none focus:border-primary"
                placeholder="Rp"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stok
            </label>
            <input
              type="number"
              value={form.stok}
              onChange={(e) => setForm({ ...form, stok: e.target.value })}
              className="w-full shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 px-4 py-2 square focus:outline-none focus:border-primary"
              placeholder="Jumlah stok"
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 square hover:bg-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 square hover:bg-primary-dark"
            >
              {produk ? 'Simpan Perubahan' : 'Tambah Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}