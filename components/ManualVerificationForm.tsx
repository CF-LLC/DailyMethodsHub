'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { verifyBitcoinPayment, verifyLightningPayment } from '@/app/actions/subscriptions'

export default function ManualVerificationForm() {
  const [paymentMethod, setPaymentMethod] = useState<'bitcoin' | 'lightning'>('lightning')
  const [txId, setTxId] = useState('')
  const [address, setAddress] = useState('')
  const [amountSats, setAmountSats] = useState('50000')
  const [invoice, setInvoice] = useState('')
  const [paymentHash, setPaymentHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleVerify = async () => {
    setLoading(true)
    setMessage('')

    try {
      let result
      if (paymentMethod === 'bitcoin') {
        result = await verifyBitcoinPayment(txId, address, parseInt(amountSats))
      } else {
        result = await verifyLightningPayment(invoice, paymentHash)
      }

      if (result.success) {
        setMessage('✅ User upgraded to premium successfully!')
        // Clear form
        setTxId('')
        setAddress('')
        setInvoice('')
        setPaymentHash('')
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Payment Verification</CardTitle>
        <p className="text-sm text-muted-foreground">
          Verify user payments and upgrade them to premium
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Method Selection */}
        <div>
          <label className="mb-2 block text-sm font-medium">Payment Method</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="lightning"
                checked={paymentMethod === 'lightning'}
                onChange={() => setPaymentMethod('lightning')}
                className="h-4 w-4"
              />
              <span>Lightning</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="bitcoin"
                checked={paymentMethod === 'bitcoin'}
                onChange={() => setPaymentMethod('bitcoin')}
                className="h-4 w-4"
              />
              <span>Bitcoin On-Chain</span>
            </label>
          </div>
        </div>

        {/* Lightning Fields */}
        {paymentMethod === 'lightning' && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Lightning Invoice
              </label>
              <input
                type="text"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="lnbc..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Payment Hash (optional)
              </label>
              <input
                type="text"
                value={paymentHash}
                onChange={(e) => setPaymentHash(e.target.value)}
                placeholder="Transaction hash"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </>
        )}

        {/* Bitcoin Fields */}
        {paymentMethod === 'bitcoin' && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Transaction ID
              </label>
              <input
                type="text"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
                placeholder="Bitcoin transaction ID"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Receiving Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="bc1q..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Amount (satoshis)
              </label>
              <input
                type="number"
                value={amountSats}
                onChange={(e) => setAmountSats(e.target.value)}
                placeholder="50000"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                0.0005 BTC = 50,000 sats
              </p>
            </div>
          </>
        )}

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={loading || (paymentMethod === 'bitcoin' && (!txId || !address))}
          className="w-full"
        >
          {loading ? 'Verifying...' : 'Verify Payment & Upgrade User'}
        </Button>

        {/* Message */}
        {message && (
          <div className={`rounded-lg p-4 text-sm ${
            message.startsWith('✅') 
              ? 'bg-green-50 text-green-900 border border-green-200' 
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="font-medium mb-2">Instructions:</p>
          <ol className="space-y-1 text-muted-foreground">
            <li>1. User sends payment to your Bitcoin/Lightning address</li>
            <li>2. User emails proof to satoshispath@gmail.com with their account email</li>
            <li>3. Verify payment in your wallet</li>
            <li>4. Enter transaction details above</li>
            <li>5. Click verify - user gets upgraded instantly!</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
