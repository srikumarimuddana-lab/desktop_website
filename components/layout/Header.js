'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { CircleUserRound, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoginDialog } from '@/components/auth/LoginDialog'

function displayName(user) {
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ')
  return name || 'My account'
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const { user, status, logout } = useAuth()
  const nav = [
    { name: 'Drive', href: '/drive' },
    { name: 'Ride', href: '/ride' },
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
  ]

  const isDriverApplicant = Boolean(user?.driver_onboarding_status)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Spinr Rideshare Logo"
              width={160}
              height={53}
              className="h-14 w-auto"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <Link key={item.name} href={item.href} className="text-gray-600 hover:text-primary font-medium">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/drive/signup">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Become a Driver
              </Button>
            </Link>
            <Link href="/ride">
              <Button className="bg-primary hover:bg-primary/90 text-white">Get a Ride</Button>
            </Link>
            {status === 'authed' && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-gray-600">
                    <CircleUserRound className="w-5 h-5" />
                    <span className="max-w-32 truncate">{displayName(user)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{displayName(user)}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isDriverApplicant && (
                    <DropdownMenuItem asChild>
                      <Link href="/drive/status">My driver application</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => logout()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" className="text-gray-600" onClick={() => setLoginOpen(true)}>
                Log in
              </Button>
            )}
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden py-4 border-t">
            {nav.map((item) => (
              <Link key={item.name} href={item.href} className="block py-2 text-gray-600 hover:text-primary" onClick={() => setOpen(false)}>
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t mt-4">
              <Link href="/drive/signup" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full border-primary text-primary">Become a Driver</Button>
              </Link>
              <Link href="/ride" onClick={() => setOpen(false)}>
                <Button className="w-full bg-primary text-white">Get a Ride</Button>
              </Link>
              {status === 'authed' && user ? (
                <>
                  {isDriverApplicant && (
                    <Link href="/drive/status" onClick={() => setOpen(false)}>
                      <Button variant="ghost" className="w-full text-gray-600">My driver application</Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600"
                    onClick={() => {
                      setOpen(false)
                      logout()
                    }}
                  >
                    Log out ({displayName(user)})
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full text-gray-600"
                  onClick={() => {
                    setOpen(false)
                    setLoginOpen(true)
                  }}
                >
                  Log in
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  )
}
