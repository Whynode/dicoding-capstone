'use client'
import { LayoutDashboard, ShoppingCart, Package, History, BarChart, Settings } from 'lucide-react'

export default function Sidebar({ activePage, setActivePage }) {
  const menu = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Kasir', icon: ShoppingCart },
    { name: 'Produk', icon: Package },
    { name: 'Riwayat', icon: History },
    { name: 'Laporan', icon: BarChart },
    { name: 'Pengaturan', icon: Settings },
  ]

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-tight">PELPAY</h1>
        <p className="text-sm text-gray-400 mt-1">Warung Madura</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.name
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 square transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">v1.0.0</p>
      </div>
    </div>
  )
}