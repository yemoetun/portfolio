import './globals.css'
import Navbar from '@/components/Navbar'
import { Yeseva_One } from 'next/font/google'

const yesevaOne = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={yesevaOne.className}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
