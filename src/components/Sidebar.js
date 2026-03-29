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

  // Digunakan sebagai Bottom Navigation ala GoPay untuk mobile & desktop
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 sm:px-6 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-between items-center h-16 max-w-2xl mx-auto">
        {menu.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.name
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-orange-50' : 'bg-transparent'}`}>
                <Icon size={isActive ? 22 : 20} className={isActive ? 'stroke-[2.5px]' : ''} />
              </div>
              <span className={`text-[10px] sm:text-[11px] truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.name}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}