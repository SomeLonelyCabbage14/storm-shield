'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Power, DollarSign, Clock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

interface DashboardStats {
  totalGenerators: number
  activeRentals: number
  pendingRequests: number
  totalEarnings: number
  activeListings: number
}

interface RecentActivity {
  id: string
  type: 'request' | 'rental' | 'review'
  message: string
  timestamp: string
  status: 'pending' | 'approved' | 'completed'
}

export default function OwnerDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalGenerators: 0,
    activeRentals: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    activeListings: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch generators count
        const { count: generatorsCount } = await supabase
          .from('generators')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)

        // Fetch active rentals
        // TODO: Add rentals table and query

        setStats({
          totalGenerators: generatorsCount || 0,
          activeRentals: 0, // TODO
          pendingRequests: 0, // TODO
          totalEarnings: 0, // TODO
          activeListings: 0 // TODO
        })

        // TODO: Fetch recent activity
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Power className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Generators
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalGenerators}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Rentals
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.activeRentals}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Earnings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${stats.totalEarnings.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-3 bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {recentActivity.length === 0 ? (
              <li className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  No recent activity
                </div>
              </li>
            ) : (
              recentActivity.map((activity) => (
                <li key={activity.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    {activity.status === 'pending' && (
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    )}
                    {activity.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    )}
                    <p className="ml-2 text-sm text-gray-600">{activity.message}</p>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}