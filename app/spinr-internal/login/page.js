'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LogIn, Eye, EyeOff, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    if (!isSupabaseConfigured()) return
    const { data: { session } } = await supabase.auth.getSession()
    if (session) router.push('/spinr-internal')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please add credentials to .env.local')
      setLoading(false)
      return
    }
    
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      })
      
      if (authError) {
        setError(authError.message)
      } else if (data.session) {
        router.push('/spinr-internal')
      }
    } catch (err) { 
      setError('An error occurred during login') 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/logo.webp"
            alt="Spinr Rideshare Logo"
            width={150}
            height={50}
            className="h-10 w-auto"
          />
        </Link>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to manage content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  placeholder="admin@spinr.ca" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input 
                    type={showPw ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="pr-10"
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={loading || !isSupabaseConfigured()}
              >
                {loading ? 'Signing in...' : <><LogIn className="w-4 h-4 mr-2" /> Sign In</>}
              </Button>
            </form>

            {/* Setup Instructions */}
            {!isSupabaseConfigured() && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 text-sm font-medium">Supabase Not Configured</p>
                    <p className="text-amber-700 text-xs mt-1">
                      Add your Supabase credentials to <code className="bg-amber-100 px-1 rounded">.env.local</code> and restart the server.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* First Time Setup Instructions */}
            {isSupabaseConfigured() && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-800 text-sm font-medium">First Time Setup</p>
                    <ol className="text-blue-700 text-xs mt-2 space-y-1 list-decimal list-inside">
                      <li>Run the SQL schema in Supabase SQL Editor</li>
                      <li>Go to Supabase → Authentication → Users</li>
                      <li>Click "Add User"</li>
                      <li>Create admin account with your email</li>
                      <li>Update <code className="bg-blue-100 px-1 rounded">SUPER_ADMIN_EMAIL</code> in the code if needed</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="text-center text-muted-foreground text-sm mt-6">
          <Link href="/" className="hover:text-primary">← Back to Spinr</Link>
        </p>
      </div>
    </main>
  )
}
