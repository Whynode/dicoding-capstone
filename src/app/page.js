'use client'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dashboard'
import Kasir from '../components/Kasir'
import Produk from '../components/Produk'
import Riwayat from '../components/Riwayat'
import ModalProduk from '../components/ModalProduk'
import ModalDetail from '../components/ModalDetail'
import { seedProduk } from '../data/produk'
import { generateId } from '../utils/helpers'
import { supabase } from '../utils/supabase'

export default function Home() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [produk, setProduk] = useState([])
  const [transaksi, setTransaksi] = useState([])
  const [keranjang, setKeranjang] = useState([])
  const [modalProdukOpen, setModalProdukOpen] = useState(false)
  const [produkEdit, setProdukEdit] = useState(null)
  const [transaksiDipilih, setTransaksiDipilih] = useState(null)
  const [modalDetailOpen, setModalDetailOpen] = useState(false)

  // load data dari Supabase saat awal render
  useEffect(() => {
    const fetchData = async () => {
      // Ambil data produk
      const { data: produkData, error: errProduk } = await supabase
        .from('produk')
        .select('*')
        .order('created_at', { ascending: true })

      if (errProduk) {
        console.error('Gagal mengambil produk:', errProduk)
        setProduk([])
      } else {
        setProduk(produkData || [])
      }

      // Ambil data transaksi
      const { data: transaksiData, error: errTransaksi } = await supabase
        .from('transaksi')
        .select('*')
        .order('tanggal', { ascending: true })

      if (errTransaksi) {
        console.error('Gagal mengambil transaksi:', errTransaksi)
        setTransaksi([])
      } else {
        setTransaksi(transaksiData || [])
      }
    }

    fetchData()
  }, [])

  // tambah produk baru atau update
  const simpanProduk = async (data) => {
    if (data.id) {
      // update produk yang ada ke supabase
      const { data: updated, error } = await supabase
        .from('produk')
        .update(data)
        .eq('id', data.id)
        .select()
        .single()

      if (!error && updated) {
        setProduk((prev) => prev.map((p) => (p.id === data.id ? updated : p)))
      }
    } else {
      // tambah produk baru ke supabase
      const newProduk = {
        ...data,
        id: generateId(),
      }
      
      const { data: inserted, error } = await supabase
        .from('produk')
        .insert([newProduk])
        .select()
        .single()

      if (!error && inserted) {
        setProduk((prev) => [...prev, inserted])
      }
    }
  }

  // hapus produk
  const hapusProduk = async (id) => {
    const { error } = await supabase.from('produk').delete().eq('id', id)
    if (!error) {
      setProduk((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // hapus beberapa produk sekaligus
  const hapusTerpilihProduk = async (ids) => {
    const { error } = await supabase.from('produk').delete().in('id', ids)
    if (!error) {
      setProduk((prev) => prev.filter((p) => !ids.includes(p.id)))
    }
  }

  // tambah ke keranjang
  const tambahKeKeranjang = (item) => {
    setKeranjang((prev) => {
      const existing = prev.find((k) => k.produkId === item.id)
      if (existing) {
        // cek stok
        if (existing.jumlah >= item.stok) return prev
        return prev.map((k) =>
          k.produkId === item.id
            ? {
                ...k,
                jumlah: k.jumlah + 1,
                subtotal: (k.jumlah + 1) * k.harga,
              }
            : k
        )
      } else {
        return [
          ...prev,
          {
            produkId: item.id,
            nama: item.nama,
            harga: item.harga,
            jumlah: 1,
            subtotal: item.harga,
          },
        ]
      }
    })
  }

  // kurangi dari keranjang
  const kurangDariKeranjang = (produkId) => {
    setKeranjang((prev) =>
      prev
        .map((k) =>
          k.produkId === produkId
            ? {
                ...k,
                jumlah: k.jumlah - 1,
                subtotal: (k.jumlah - 1) * k.harga,
              }
            : k
        )
        .filter((k) => k.jumlah > 0)
    )
  }

  // hapus dari keranjang
  const hapusDariKeranjang = (produkId) => {
    setKeranjang((prev) => prev.filter((k) => k.produkId !== produkId))
  }

  // simpan order / bayar
  const simpanOrder = async () => {
    if (keranjang.length === 0) return

    // kurangi stok frontend
    const produkBaru = produk.map((p) => {
      const itemKeranjang = keranjang.find((k) => k.produkId === p.id)
      if (itemKeranjang) {
        return { ...p, stok: p.stok - itemKeranjang.jumlah }
      }
      return p
    })

    // Update bulk produk ke supabase
    const productsToUpdate = produkBaru.filter((p) =>
      keranjang.some((k) => k.produkId === p.id)
    )
    if (productsToUpdate.length > 0) {
      await supabase.from('produk').upsert(productsToUpdate)
    }

    // buat transaksi baru
    const total = keranjang.reduce((sum, item) => sum + item.subtotal, 0)
    const transaksiBaru = {
      id: generateId(),
      tanggal: new Date().toISOString(),
      items: keranjang,
      total: total,
    }

    // Insert transaksi
    const { data: insertedTransaksi, error } = await supabase
      .from('transaksi')
      .insert([transaksiBaru])
      .select()
      .single()

    if (!error && insertedTransaksi) {
      setTransaksi((prev) => [...prev, insertedTransaksi])
      setProduk(produkBaru)
      setKeranjang([])
      alert('Transaksi berhasil!')
    } else {
      alert('Terjadi error ketika menyimpan pesanan!')
    }
  }

  // reset keranjang
  const resetKeranjang = () => {
    setKeranjang([])
  }

  // buka modal edit produk
  const bukaEditProduk = (item) => {
    setProdukEdit(item)
    setModalProdukOpen(true)
  }

  // buka modal tambah produk
  const bukaTambahProduk = () => {
    setProdukEdit(null)
    setModalProdukOpen(true)
  }

  // lihat detail transaksi
  const lihatDetailTransaksi = (transaksi) => {
    setTransaksiDipilih(transaksi)
    setModalDetailOpen(true)
  }

  // hapus transaksi
  const hapusTransaksi = async (id) => {
    if (window.confirm('Yakin ingin hapus transaksi ini? Data akan hilang permanen.')) {
      const { error } = await supabase.from('transaksi').delete().eq('id', id)
      if (!error) {
        setTransaksi((prev) => prev.filter((t) => t.id !== id))
      }
    }
  }

  // render halaman sesuai activePage
  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard produk={produk} transaksi={transaksi} />
      case 'Kasir':
        return (
          <Kasir
            produk={produk}
            keranjang={keranjang}
            tambahKeKeranjang={tambahKeKeranjang}
            kurangDariKeranjang={kurangDariKeranjang}
            hapusDariKeranjang={hapusDariKeranjang}
            simpanOrder={simpanOrder}
            resetKeranjang={resetKeranjang}
          />
        )
      case 'Produk':
        return (
          <Produk
            produk={produk}
            onTambah={bukaTambahProduk}
            onEdit={bukaEditProduk}
            onHapus={hapusProduk}
            onHapusTerpilih={hapusTerpilihProduk}
          />
        )
      case 'Riwayat':
        return (
          <Riwayat
            transaksi={transaksi}
            produk={produk}
            onLihatDetail={lihatDetailTransaksi}
            onHapus={hapusTransaksi}
          />
        )
      case 'Laporan':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Laporan</h2>
            <div className="bg-white border border-gray-200 p-8 square text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Fitur Laporan</h3>
              <p className="text-gray-500 mb-4">Sedang dalam pengembangan</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-gray-50 square">
                  <p className="font-medium text-gray-700">Laporan Harian</p>
                  <p className="text-sm text-gray-500">Ringkasan penjualan per hari</p>
                </div>
                <div className="p-4 bg-gray-50 square">
                  <p className="font-medium text-gray-700">Laporan Bulanan</p>
                  <p className="text-sm text-gray-500">Tren penjualan bulanan</p>
                </div>
                <div className="p-4 bg-gray-50 square">
                  <p className="font-medium text-gray-700">Laporan Stok</p>
                  <p className="text-sm text-gray-500">Pergerakan inventory</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'Pengaturan':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pengaturan</h2>
            <div className="bg-white border border-gray-200 p-8 square text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Pengaturan Sistem</h3>
              <p className="text-gray-500 mb-4">Sedang dalam pengembangan</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 square text-left">
                  <p className="font-medium text-gray-700 mb-2">Profil Warung</p>
                  <div className="space-y-2">
                    <input type="text" placeholder="Nama Warung" className="w-full border px-3 py-2 square text-sm" defaultValue="Warung Madura" />
                    <input type="text" placeholder="Alamat" className="w-full border px-3 py-2 square text-sm" defaultValue="Jakarta" />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 square text-left">
                  <p className="font-medium text-gray-700 mb-2">Pengaturan Lain</p>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>Tampilkan stok di kasir</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>Notifikasi stok rendah</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span>Mode gelap</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <Dashboard produk={produk} transaksi={transaksi} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header simpel untuk branding */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40 flex items-center justify-center shadow-sm square">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">PELPAY</h1>
      </header>

      <main className="p-4 sm:p-8 max-w-5xl mx-auto">
        {renderPage()}
      </main>

      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <ModalProduk
        isOpen={modalProdukOpen}
        onClose={() => setModalProdukOpen(false)}
        onSave={simpanProduk}
        produk={produkEdit}
      />

      <ModalDetail
        isOpen={modalDetailOpen}
        onClose={() => setModalDetailOpen(false)}
        transaksi={transaksiDipilih}
        produk={produk}
      />
    </div>
  )
}
