import type { Metadata } from 'next' 
import { Inter } from 'next/font/google' 
import './globals.css' 

const inter = Inter({ subsets: ['latin'] }) 

export const metadata: Metadata = { 
  title: '怪兽行星 Monster Planet', 
  description: '你的创意怪兽养成伙伴 - AI驱动的情感陪伴应用', 
  keywords: ['怪兽', 'AI', '情绪', '创意', '陪伴'], 
} 

export default function RootLayout({ 
  children, 
}: { 
  children: React.ReactNode 
}) { 
  return ( 
    <html lang="zh-CN" suppressHydrationWarning> 
      <body className={inter.className}> 
        {children} 
      </body> 
    </html> 
  ) 
} 
