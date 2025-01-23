'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, ChevronLeft, Pencil, Check, Share2 } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'

export default function AffiliatePage() {
  const dummyAffiliateData = {
    totalAmount: 1000000.50,
    affiliateCode: "ENAIBLR123",
    referrals: [
      { email: "user1@example.com", date: "2025-01-20", amount: 50.00, status: "Completed" },
      { email: "user2@example.com", date: "2025-01-21", amount: 75.50, status: "Pending" },
      { email: "user3@example.com", date: "2025-01-22", amount: 125.00, status: "Completed" },
      { email: "user1@example.com", date: "2025-01-20", amount: 50.00, status: "Completed" },
      { email: "user2@example.com", date: "2025-01-21", amount: 75.50, status: "Pending" },
      { email: "user3@example.com", date: "2025-01-22", amount: 125.00, status: "Completed" },
      { email: "user1@example.com", date: "2025-01-20", amount: 50.00, status: "Completed" },
      { email: "user2@example.com", date: "2025-01-21", amount: 75.50, status: "Pending" },
      { email: "user3@example.com", date: "2025-01-22", amount: 125.00, status: "Completed" },
      { email: "user1@example.com", date: "2025-01-20", amount: 50.00, status: "Completed" },
      { email: "user2@example.com", date: "2025-01-21", amount: 75.50, status: "Pending" },
      { email: "user3@example.com", date: "2025-01-22", amount: 125.00, status: "Completed" },
      { email: "user1@example.com", date: "2025-01-20", amount: 50.00, status: "Completed" },
      { email: "user2@example.com", date: "2025-01-21", amount: 75.50, status: "Pending" },
      { email: "user3@example.com", date: "2025-01-22", amount: 125.00, status: "Completed" },

    ]
  }

  const [affiliateCode, setAffiliateCode] = useState(dummyAffiliateData.affiliateCode)
  const [isEditing, setIsEditing] = useState(false)
  const [tempCode, setTempCode] = useState(affiliateCode)

  const router = useRouter()

  const getReferralUrl = () => `enaiblr.org?ref=${affiliateCode}`

  const getShareText = () => {
    return `Enaiblr: Dozens of AI apps with unlimited file upload and features!\n\nTry here: ${getReferralUrl()}`
  }

  const handleSave = () => {
    setAffiliateCode(tempCode)
    setIsEditing(false)
    toast.success("Affiliate code updated!")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getReferralUrl())
      toast.success("Affiliate code copied to clipboard!")
    } catch (err) {
      toast.error("Failed to copy affiliate code")
    }
  }

  const shareReferral = async () => {
    const shareData = {
      title: 'Enaiblr',
      text: getShareText(),
      url: undefined
    }

    try {
      if (navigator.share && navigator.canShare({ ...shareData, url: getReferralUrl() })) {
        await navigator.share(shareData)
        toast.success("Opened share menu!")
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(getShareText())
        toast.success("Share text copied to clipboard!")
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User cancelled sharing
        return
      }
      toast.error("Failed to share")
    }
  }

  const censorEmail = (email: string) => {
    const [localPart, domain] = email.split('@')
    if (localPart.length <= 3) return email
    return `${localPart.slice(0, -3)}***@${domain}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleWithdraw = () => {
    const message = encodeURIComponent(`Halo Enaiblr Admin,

Saya ingin menarik earnings dari affiliate saya. Berikut datanya:

Email: 
Bank/e-Wallet Tujuan: 
Nomor/Rekening: 
Jumlah: ${formatCurrency(dummyAffiliateData.totalAmount)}

Terima kasih,
Mohon segera diproses ya`)

    window.open(`https://wa.me/+6281280077690?text=${message}`, '_blank')
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <Card className="mb-8 mx-4">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              className="flex items-center p-1"
              onClick={() => router.push('/account/profile')}
            >
              <ChevronLeft className="" />
              Back
            </Button>
          </div>
          <div className="text-center">
            <CardTitle>Total Earnings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-4xl font-bold mb-6">{formatCurrency(dummyAffiliateData.totalAmount)}</p>
          
          <div className="relative">
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground mb-2">
                  Your Affiliate Code
                </span>
              </div>
            </div>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-2">
              <div className={`flex items-center gap-1 ${!isEditing ? 'bg-secondary rounded-lg pl-2 py-1' : ''}`}>
                {isEditing ? (
                  <>
                    <span className="text-sm text-muted-foreground">enaiblr.org?ref=</span>
                    <Input 
                      value={tempCode}
                      onChange={(e) => setTempCode(e.target.value)}
                      className="max-w-[120px]"
                      autoFocus
                    />
                    <Button onClick={handleSave} variant="outline" size="icon" className="h-8 w-8 shrink-0">
                      <Check className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-primary/80 font-medium">enaiblr.org?ref={affiliateCode}</span>
                    <Button onClick={() => setIsEditing(true)} variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline" size="icon" className="h-10 w-10">
                <Copy className="h-4 w-4" />
              </Button>
              <Button onClick={shareReferral} variant="outline" size="icon" className="h-10 w-10">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-4">
        <CardHeader className="text-center">
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyAffiliateData.referrals.map((referral, index) => (
                <TableRow key={index}>
                  <TableCell className="sm:pl-8">{censorEmail(referral.email)}</TableCell>
                  <TableCell className="text-center">{format(new Date(referral.date), 'd MMM yyyy')}</TableCell>
                  <TableCell className="text-right sm:pr-8">{formatCurrency(referral.amount)}</TableCell>
                  <TableCell className="text-center">{referral.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button size="lg" className="rounded-full" onClick={handleWithdraw}>
          Withdraw Earnings
        </Button>
      </div>
    </div>
  )
}
