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
import { ChevronLeft, ChevronRight, ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import { EditSubscriptionDialog } from './edit-subscription-dialog';

interface Subscription {
  email: string;
  plan: string;
  validUntil: Date | null;
  createdAt: Date;
}

interface SubscriptionTableProps {
  initialSubscriptions: Subscription[];
  totalPages: number;
}

type SortField = 'email' | 'createdAt' | 'plan' | 'validUntil';
type SortDirection = 'asc' | 'desc';

export function SubscriptionTable({ initialSubscriptions, totalPages }: SubscriptionTableProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>('email');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  const fetchPage = async (page: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/users-subscription?page=${page}&limit=25&sort=${sortField}&order=${sortDirection}`);
      const data = await res.json();
      setSubscriptions(data.subscriptions);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    fetchPage(currentPage);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ArrowUpNarrowWide className="ml-1 h-4 w-4" /> : <ArrowDownNarrowWide className="ml-1 h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('email')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <span>Email</span>
                <SortIcon field="email" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <span>Created At</span>
                <SortIcon field="createdAt" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('plan')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <span>Plan</span>
                <SortIcon field="plan" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('validUntil')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <span>Expiration</span>
                <SortIcon field="validUntil" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription, index) => (
            <TableRow 
              key={index}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedSubscription(subscription)}
            >
              <TableCell>{subscription.email}</TableCell>
              <TableCell>
                {formatDistance(new Date(subscription.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </TableCell>
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
      {selectedSubscription && (
        <EditSubscriptionDialog
          subscription={selectedSubscription}
          open={true}
          onOpenChange={(open) => !open && setSelectedSubscription(null)}
          onSubscriptionUpdated={() => fetchPage(currentPage)}
        />
      )}
    </div>
  );
}