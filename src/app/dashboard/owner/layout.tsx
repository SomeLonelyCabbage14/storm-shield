'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BarChart3, Settings, Power, Calendar, DollarSign, BellRing } from 'lucide-react'

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth/login')
      } else {
        // Check if user is owner and setup is complete
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!profile || profile.user_type !== 'owner') {
          router.replace('/dashboard')
        } else if (!profile.is_setup_complete) {
          router.replace('/dashboard/owner-setup')
        }
      }
      setLoading(false)
    }

    checkSession()
  }, [router])

  const navigation = [
    { name: 'Overview', href: '/dashboard/owner', icon: BarChart3 },
    { name: 'My Generators', href: '/dashboard/owner/generators', icon: Power },
    { name: 'Availability', href: '/dashboard/owner/calendar', icon: Calendar },
    { name: 'Earnings', href: '/dashboard/owner/earnings', icon: DollarSign },
    { name: 'Settings', href: '/dashboard/owner/settings', icon: Settings },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">Storm Shield</span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 relative">
                <BellRing className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                )}
              </button>
              {/* Profile Dropdown could go here */}
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="col-span-12 lg:col-span-2">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </a>
                  )
                })}
              </nav>
            </div>

            {/* Main Content */}
            <main className="col-span-12 lg:col-span-10">
              <div className="bg-white shadow rounded-lg">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}