import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata = {
  title: 'PELPAY - Kasir Warung Madura',
  description: 'Sistem kasir sederhana untuk Warung Madura',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${jakarta.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}