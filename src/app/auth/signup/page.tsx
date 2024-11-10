'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
//import { userAgent } from 'next/server';

interface SignupForm {
  email: string;
  password: string;
  fullName: string;
  userType: 'owner' | 'renter' | '';
}

const role = {
  RENTER: "renter",
  OWNER: "owner"
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupForm>({
    email: '',
    password: '',
    fullName: '',
    userType: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()


const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.origin}/auth/callback`,
        data: {
          full_name: formData.fullName,
          user_type: formData.userType
        }
      }
    })

    if (error) {
      console.error('Signup error:', error)
      setError(error.message)
      return
    }

    if (data?.user?.identities?.length === 0) {
      setError('This email is already registered. Please try logging in instead.')
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: formData.email,
          user_type: formData.userType,
          full_name: formData.fullName,
          is_setup_complete: false
        }, {
          onConflict: 'id'
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        setError('Error creating user profile')
        return
      }

      if (formData.userType === role.OWNER) {
        router.push("/dashboard/owner-setup")
      } else if (formData.userType === role.RENTER) {
        router.push("/dashboard/renter")
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    setError('An unexpected error occurred')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Storm Shield to {' '}
            <span className="font-medium text-blue-600">
              rent or list your generator
            </span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                I want to...
              </label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    id="owner"
                    name="userType"
                    type="radio"
                    required
                    checked={formData.userType === 'owner'}
                    onChange={() => setFormData({ ...formData, userType: 'owner' })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="owner" className="ml-3 block text-sm text-gray-700">
                    List my generator for rent
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="renter"
                    name="userType"
                    type="radio"
                    required
                    checked={formData.userType === 'renter'}
                    onChange={() => setFormData({ ...formData, userType: 'renter' })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="renter" className="ml-3 block text-sm text-gray-700">
                    Rent a generator
                  </label>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-sm text-center">
            <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}