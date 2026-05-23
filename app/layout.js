import './globals.css'
import LenisProvider from '@/components/ui/LenisProvider'

export const metadata = {
  title: 'Frames of Memory',
  description: 'A cinematic scroll gallery experience',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LenisProvider />
        {children}
      </body>
    </html>
  )
}