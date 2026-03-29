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

  // Ultra-minimalist bottom navigation
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50 pb-safe sm:pb-0 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
      <nav className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {menu.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.name
          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className="relative flex flex-col items-center justify-center w-12 h-12 outline-none tap-highlight-transparent"
            >
              <Icon 
                size={26} 
                className={`transition-all duration-300 ease-out ${
                  isActive 
                    ? 'text-primary stroke-[2.5px] -translate-y-1' 
                    : 'text-gray-400 dark:text-gray-500 stroke-2 hover:text-gray-600'
                }`} 
              />
              <div 
                className={`absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`} 
              />
            </button>
          )
        })}
      </nav>
    </div>
  )
}