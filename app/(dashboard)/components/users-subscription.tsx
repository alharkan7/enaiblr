'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Subscription {
  email: string;
  plan: string;
  validUntil: Date | null;
}

interface SubscriptionTableProps {
  initialSubscriptions: Subscription[];
  totalPages: number;
}

export function SubscriptionTable({ initialSubscriptions, totalPages }: SubscriptionTableProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (page: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/users-subscription?page=${page}&limit=25`);
      const data = await res.json();
      setSubscriptions(data.subscriptions);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Expiration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription, index) => (
            <TableRow key={index}>
              <TableCell>{subscription.email}</TableCell>
              <TableCell className="capitalize">{subscription.plan}</TableCell>
              <TableCell>
                {subscription.validUntil 
                  ? formatDistance(new Date(subscription.validUntil), new Date(), {
                      addSuffix: true,
                    })
                  : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchPage(currentPage - 1)}
          disabled={loading || currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchPage(currentPage + 1)}
          disabled={loading || currentPage >= totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}