'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, ChevronLeft, Pencil, Check, Share2, X } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface AffiliateTransaction {
  email: string;
  date: string;
  amount: number;
  status: string;
}

export default function AffiliatePage() {
  const [affiliateCode, setAffiliateCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [tempCode, setTempCode] = useState("");
  const [transactions, setTransactions] = useState<AffiliateTransaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const { data: session } = useSession();

  const router = useRouter()

  useEffect(() => {
    const fetchAffiliateCode = async () => {
      try {
        const response = await fetch('/api/user/affiliate');
        const data = await response.json();
        if (response.ok) {
          setAffiliateCode(data.code);
          setTempCode(data.code);
          // After getting the affiliate code, fetch transactions
          fetchTransactions(data.code);
        } else {
          toast.error(data.error || 'Failed to fetch affiliate code');
        }
      } catch (error) {
        console.error('Error fetching affiliate code:', error);
        toast.error('Failed to fetch affiliate code');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTransactions = async (code: string) => {
      try {
        const response = await fetch(`/api/user/affiliate/transactions?code=${code}`);
        const data = await response.json();
        if (response.ok) {
          setTransactions(data.transactions);
        } else {
          toast.error(data.error || 'Failed to fetch transactions');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to fetch transactions');
      } finally {
        setIsTransactionsLoading(false);
      }
    };

    if (session?.user) {
      fetchAffiliateCode();
    }
  }, [session]);

  const handleSave = async () => {
    if (!tempCode || tempCode.length !== 7) {
      toast.error('Affiliate code must be 7 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/affiliate', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: tempCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setAffiliateCode(data.code);
        setIsEditing(false);
        toast.success('Affiliate code updated successfully');
      } else {
        toast.error(data.error || 'Failed to update affiliate code');
      }
    } catch (error) {
      console.error('Error updating affiliate code:', error);
      toast.error('Failed to update affiliate code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEditing = () => {
    setTempCode(affiliateCode);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempCode(affiliateCode);
    setIsEditing(false);
  };

  const getReferralUrl = () => `enaiblr.org?ref=${affiliateCode}`

  const getShareText = () => {
    return `Ayo Coba Enaiblr AI Platform

Unlimited ChatGPT, Claude, Gemini, dll. bundling mulai dari Rp25.000 per bulan!

Bukan sharing account. Bisa login via akun Google sendiri.

Plus bonus puluhan fitur dan aplikasi AI, tanpa batas file upload dan fitur organisir chat.

Coba di sini: ${getReferralUrl()}`
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const getTotalEarnings = () => {
    return transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  }

  const handleWithdraw = () => {
    if (getTotalEarnings() < 3) {
      toast.error("Minimum withdrawal is $3.00 or 1 Success Transaction");
      return;
    }

    const subject = encodeURIComponent("Affiliate Earnings Withdrawal Request");
    const body = encodeURIComponent(`Hello Enaiblr Admin,

I would like to withdraw earnings from my affiliate account. Here's the details:

Email: ${session?.user?.email}
Bank/Wallet Account Name: 
Account Number: 
Amount: ${formatCurrency(getTotalEarnings())}

Thank you,`);

    window.open(`mailto:mail@enaiblr.org?subject=${subject}&body=${body}`, '_blank');
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
            <Button
              variant="link"
              className="flex items-center"
              onClick={() => router.push('/affiliate')}
            >
              Learn More
            </Button>
          </div>
          <div className="text-center">
            <CardTitle>Total Earnings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-4xl font-bold mb-6">
            {isTransactionsLoading ? (
              <span className="text-muted-foreground">-</span>
            ) : (
              formatCurrency(getTotalEarnings())
            )}
          </p>
          
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
                      onChange={(e) => setTempCode(e.target.value.toUpperCase())}
                      className="max-w-[120px]"
                      maxLength={7}
                      placeholder="ABCD123"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button onClick={handleSave} variant="outline" size="icon" className="h-8 w-8 shrink-0" disabled={isLoading}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={handleCancel} variant="ghost" size="icon" className="h-8 w-8 shrink-0" disabled={isLoading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-primary/80 font-medium">
                      {isLoading ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        `enaiblr.org?ref=${affiliateCode}`
                      )}
                    </span>
                    <Button 
                      onClick={handleStartEditing} 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 shrink-0"
                      disabled={isLoading}
                    >
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
                <TableHead className="text-center w-16">#</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isTransactionsLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions?.map((transaction, index) => (
                  <TableRow key={transaction.email + transaction.date}>
                    <TableCell className="text-center">{transactions ? index + 1 : null}</TableCell>
                    <TableCell className="sm:pl-8">{censorEmail(transaction.email)}</TableCell>
                    <TableCell className="text-center">{format(new Date(transaction.date), 'd MMM yyyy')}</TableCell>
                    <TableCell className="text-right sm:pr-8">{formatCurrency(transaction.amount)}</TableCell>
                    <TableCell className="text-center">{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-center">
        <Button size="lg" className="rounded-full" onClick={handleWithdraw} disabled={getTotalEarnings() < 25000}>
          Withdraw Earnings
        </Button>
      </div>
    </div>
  )
}
