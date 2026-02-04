'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, HelpCircle, LogOut, Home, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// SUPER ADMIN EMAIL - Change this to your email
const SUPER_ADMIN_EMAIL = 'admin@spinr.ca'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    checkAuthorization()
  }, [pathname])

  const checkAuthorization = async () => {
    // Skip auth check for login page
    if (pathname === '/spinr-internal/login') {
      setLoading(false)
      setAuthorized(true)
      return
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      router.push('/spinr-internal/login')
      return
    }

    try {
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        router.push('/spinr-internal/login')
        return
      }

      const email = session.user?.email

      // RBAC Check - Only allow super admin
      if (email !== SUPER_ADMIN_EMAIL) {
        console.log('Unauthorized access attempt:', email)
        await supabase.auth.signOut()
        router.push('/')
        return
      }

      setUserEmail(email)
      setAuthorized(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/spinr-internal/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    router.push('/')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  // For login page, just render children without sidebar
  if (pathname === '/spinr-internal/login') {
    return <>{children}</>
  }

  // If not authorized, don't render anything (redirect will happen)
  if (!authorized) {
    return null
  }

  const navItems = [
    { href: '/spinr-internal', label: 'Dashboard', icon: Home },
    { href: '/spinr-internal/policies', label: 'Policies', icon: FileText },
    { href: '/spinr-internal/faqs', label: 'FAQs', icon: HelpCircle },
    { href: '/spinr-internal/seo', label: 'SEO', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="Spinr Rideshare Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <span className="text-xs text-muted-foreground mt-1 block">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-3 px-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Shield className="w-3 h-3" />
              <span>Super Admin</span>
            </div>
            <p className="text-sm font-medium text-foreground truncate">{userEmail}</p>
          </div>
          <Button
            variant="outline"
            className="w-full border-red-200 text-primary hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
