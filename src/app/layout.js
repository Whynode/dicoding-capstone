import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'PELPAY - Kasir Warung Madura',
  description: 'Sistem kasir sederhana untuk Warung Madura',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans bg-gray-50 dark:bg-gray-900/50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 dark:text-gray-100 transition-colors duration-200`}>
        {children}
      </body>
    </html>
  )
}