'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { User, Mail, Shield, CreditCard, Trash2, Save, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/providers/ToastProvider'
import { getUserSubscription } from '@/app/actions/subscriptions'
import Link from 'next/link'

export function SettingsContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setEmail(user.email || '')
      
      // Check admin status
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      
      setIsAdmin(profile?.is_admin || false)
      
      // Get subscription
      const subResult = await getUserSubscription()
      if (subResult.success) {
        setSubscription(subResult.data)
      }
    }
  }

  const handleUpdateEmail = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ email })
      
      if (error) throw error
      
      showToast('success', 'Check your new email for confirmation link')
    } catch (error: any) {
      showToast('error', error.message || 'Failed to update email')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      
      showToast('success', 'Password reset email sent!')
    } catch (error: any) {
      showToast('error', error.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  const getPlanBadge = () => {
    if (isAdmin) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
          <Shield className="h-3 w-3" />
          Admin
        </span>
      )
    }
    
    if (subscription?.plan_type === 'premium') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          <DollarSign className="h-3 w-3" />
          Premium
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-300">
        Free
      </span>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Overview */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Overview
              </CardTitle>
              <CardDescription className="mt-2">
                Your current plan and account status
              </CardDescription>
            </div>
            {getPlanBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="mt-1 text-lg font-semibold truncate">{email}</p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <p className="mt-1 text-lg font-semibold capitalize">
                  {isAdmin ? 'Admin' : subscription?.plan_type || 'Free'}
                </p>
              </div>
            </div>
            
            {subscription?.plan_type === 'free' && !isAdmin && (
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Upgrade to Premium - 0.0005 BTC</h4>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      Unlock unlimited public methods, referral code sharing, and priority support. One-time payment, lifetime access.
                    </p>
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100">How to upgrade:</p>
                      <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-decimal">
                        <li>Click "View Pricing" below to see payment options</li>
                        <li>Send Bitcoin or Lightning payment to our address</li>
                        <li>Email proof to <strong>satoshispath@gmail.com</strong> with your account email</li>
                        <li>Get upgraded within 24 hours!</li>
                      </ol>
                    </div>
                    <Link href="/pricing">
                      <Button className="mt-3" size="sm">
                        <DollarSign className="mr-2 h-4 w-4" />
                        View Pricing & Payment Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {subscription?.payment_method && subscription.payment_method !== 'none' && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Payment Method:</span>
                  <span className="capitalize">{subscription.payment_method}</span>
                </div>
                {subscription.payment_verified_at && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Verified on {new Date(subscription.payment_verified_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Settings
          </CardTitle>
          <CardDescription>
            Update your email address or change your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <div className="flex gap-3">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1"
                />
                <Button 
                  onClick={handleUpdateEmail}
                  disabled={loading}
                  variant="outline"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Update
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                You'll receive a confirmation email at your new address
              </p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Change Password</h4>
              <p className="text-sm text-muted-foreground mb-3">
                We'll send a password reset link to your email
              </p>
              <Button 
                onClick={handleUpdatePassword}
                disabled={loading}
                variant="outline"
              >
                Send Reset Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates about your methods and earnings
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>

          <div className="flex items-start justify-between gap-4 border-t pt-4">
            <div className="flex-1">
              <p className="font-medium">New Method Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when new earning methods are available
              </p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions - proceed with extreme caution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <h4 className="font-semibold text-destructive">Delete Account</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                className="mt-3"
                onClick={() => showToast('error', 'Account deletion is currently disabled. Contact support.')}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete My Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        <p>Need help? Contact us at satoshispath@gmail.com</p>
      </div>
    </div>
  )
}
