'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle email verification
  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      verifyEmail(token)
    }
  }, [searchParams])

  // Handle resend verification email
  const handleResendVerification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        setError('No email found. Please try signing up again.')
        return
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      alert('Verification email resent! Please check your inbox.')
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to resend verification email')
    }
  }

  // Verify email token
  const verifyEmail = async (token: string) => {
    try {
      setIsVerifying(true)
      setError(null)

      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'signup'
      })

      if (error) throw error

      // Redirect to login on success
      router.push('/auth/login?verified=true')
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to verify email')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {isVerifying ? (
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Verifying your email...
          </h2>
        ) : (
          <>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Check your email
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We&apos;ve sent you a verification link. Please check your email and click the link to verify your account.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Make sure to check your spam folder if you don&apos;t see the email.
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="mt-8">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Back to login
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">
                Didn&apos;t receive the email?
              </p>
              <div className="space-x-4">
                <Link
                  href="/auth/signup"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Try a different email
                </Link>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleResendVerification}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Resend verification
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}