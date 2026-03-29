'use client'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Dashboard from '../components/Dashboard'
import Kasir from '../components/Kasir'
import Produk from '../components/Produk'
import Riwayat from '../components/Riwayat'
import ModalProduk from '../components/ModalProduk'
import ModalDetail from '../components/ModalDetail'
import { generateId } from '../utils/helpers'
import { supabase } from '../utils/supabase'

// page utama aplikasi
// ui layout digarap arya
// logic state by salma & ellen
// fetching data by joan

export default function Home() {
  const [activePage, setActivePage] = useState('Dashboard')
    const [isDarkMode, setIsDarkMode] = useState(false)
  const [produk, setProduk] = useState([])
	const [transaksi, setTransaksi] = useState([])
  const [keranjang, setKeranjang] = useState([])
    const [modalProdukOpen, setModalProdukOpen] = useState(false)
  const [produkEdit, setProdukEdit] = useState(null)
	const [transaksiDipilih, setTransaksiDipilih] = useState(null)
  const [modalDetailOpen, setModalDetailOpen] = useState(false)

// effect theme
  useEffect(() => {
    const storedTheme = localStorage.getItem('pelpay_theme')
	if (storedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

    const toggleDarkMode = () => {
      const newMode = !isDarkMode
      setIsDarkMode(newMode)
      if (newMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('pelpay_theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('pelpay_theme', 'light')
      }
    }

// fungsi get data dari joan backend
  useEffect(() => {
    const fetchData = async () => {
    // ambil produk
      const { data: produkData, error: errProduk } = await supabase
        .from('produk')
        .select('*')
        .order('created_at', { ascending: true })

      if (errProduk) {
	console.error('err ambil produk:', errProduk)
        setProduk([])
      } else {
        setProduk(produkData || [])
      }

    // ambil transaksi
      const { data: transaksiData, error: errTransaksi } = await supabase
        .from('transaksi')
        .select('*')
        .order('tanggal', { ascending: true })

      if (errTransaksi) {
        console.error('err transaksi:', errTransaksi)
        setTransaksi([])
      } else {
        setTransaksi(transaksiData || [])
      }
    }

    fetchData()
  }, [])

// logic simpan produk (ellen)
  const simpanProduk = async (data) => {
    if (data.id) {
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

  const hapusProduk = async (id) => {
    const { error } = await supabase.from('produk').delete().eq('id', id)
    if (!error) {
      setProduk((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const hapusTerpilihProduk = async (ids) => {
    const { error } = await supabase.from('produk').delete().in('id', ids)
    if (!error) {
	setProduk((prev) => prev.filter((p) => !ids.includes(p.id)))
    }
  }

// logic cart by salma
  const tambahKeKeranjang = (item) => {
  setKeranjang((prev) => {
      const existing = prev.find((k) => k.produkId === item.id)
      if (existing) {
        if (existing.jumlah >= item.stok) return prev
        return prev.map((k) =>
          k.produkId === item.id
            ? { ...k, jumlah: k.jumlah + 1, subtotal: (k.jumlah + 1) * k.harga }
            : k
        )
      } else {
        return [ ...prev, { produkId: item.id, nama: item.nama, harga: item.harga, jumlah: 1, subtotal: item.harga } ]
      }
    })
  }

  const kurangDariKeranjang = (produkId) => {
    setKeranjang((prev) =>
      prev.map((k) =>
          k.produkId === produkId
            ? { ...k, jumlah: k.jumlah - 1, subtotal: (k.jumlah - 1) * k.harga }
            : k
        )
        .filter((k) => k.jumlah > 0)
    )
  }

  const hapusDariKeranjang = (produkId) => {
    setKeranjang((prev) => prev.filter((k) => k.produkId !== produkId))
  }

// fungsi bayar kasir (backend joan + state salma)
  const simpanOrder = async () => {
    if (keranjang.length === 0) return

    const produkBaru = produk.map((p) => {
      const itemKeranjang = keranjang.find((k) => k.produkId === p.id)
      if (itemKeranjang) {
        return { ...p, stok: p.stok - itemKeranjang.jumlah }
      }
      return p
    })

    const productsToUpdate = produkBaru.filter((p) => keranjang.some((k) => k.produkId === p.id))
    if (productsToUpdate.length > 0) {
      await supabase.from('produk').upsert(productsToUpdate)
    }

    const total = keranjang.reduce((sum, item) => sum + item.subtotal, 0)
    const transaksiBaru = { id: generateId(), tanggal: new Date().toISOString(), items: keranjang, total: total }

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

  const resetKeranjang = () => setKeranjang([])
  const bukaEditProduk = (item) => { setProdukEdit(item); setModalProdukOpen(true) }
  const bukaTambahProduk = () => { setProdukEdit(null); setModalProdukOpen(true) }
  const lihatDetailTransaksi = (transaksi) => { setTransaksiDipilih(transaksi); setModalDetailOpen(true) }

  const hapusTransaksi = async (id) => {
    if (window.confirm('Yakin ingin hapus transaksi ini? Data akan hilang permanen.')) {
      const { error } = await supabase.from('transaksi').delete().eq('id', id)
      if (!error) { setTransaksi((prev) => prev.filter((t) => t.id !== id)) }
    }
  }

// render view menu (ui arya)
  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard produk={produk} transaksi={transaksi} />
      case 'Kasir':
        return <Kasir produk={produk} keranjang={keranjang} tambahKeKeranjang={tambahKeKeranjang} kurangDariKeranjang={kurangDariKeranjang} hapusDariKeranjang={hapusDariKeranjang} simpanOrder={simpanOrder} resetKeranjang={resetKeranjang} />
      case 'Produk':
        return <Produk produk={produk} onTambah={bukaTambahProduk} onEdit={bukaEditProduk} onHapus={hapusProduk} onHapusTerpilih={hapusTerpilihProduk} />
      case 'Riwayat':
        return <Riwayat transaksi={transaksi} produk={produk} onLihatDetail={lihatDetailTransaksi} onHapus={hapusTransaksi} />
      case 'Laporan':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Laporan</h2>
            <div className="bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 p-8 square text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Fitur Laporan</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Sedang dalam pengembangan</p>
            </div>
          </div>
        )
      case 'Pengaturan':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pengaturan</h2>
            <div className="bg-white dark:bg-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 dark:border-gray-700 p-8 square text-center">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Pengaturan Sistem</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Ubah tampilan aplikasi disini.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 square text-left">
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Pengaturan Tampilan</p>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isDarkMode} 
                        onChange={toggleDarkMode}
                        className="w-4 h-4 cursor-pointer"
                      />
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50 pb-24 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 border-b border-primary px-4 py-3 sticky top-0 z-40 flex flex-col items-center justify-center shadow-sm rounded-b-[20px] transition-colors duration-200">
        <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-gray-900 dark:text-gray-100 uppercase transition-colors duration-200">
          PEL<span className="text-primary">PAY</span>
        </h1>
        <p className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 font-bold tracking-[0.2em] uppercase mt-1 transition-colors duration-200">
          Kasir Warung Pintar
        </p>
      </header>

      <main className="p-4 sm:p-8 max-w-5xl mx-auto">
        {renderPage()}
      </main>

      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <ModalProduk isOpen={modalProdukOpen} onClose={() => setModalProdukOpen(false)} onSave={simpanProduk} produk={produkEdit} />
      <ModalDetail isOpen={modalDetailOpen} onClose={() => setModalDetailOpen(false)} transaksi={transaksiDipilih} produk={produk} />
    </div>
  )
}
