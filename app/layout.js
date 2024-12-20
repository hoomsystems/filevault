import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster richColors closeButton />
      </body>
    </html>
  )
} 