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
import { EditUserDialog } from './edit-user-dialog';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  createdAt: Date | null;
}

interface UsersTableProps {
  initialUsers: User[];
  totalPages: number;
}

type SortField = 'email' | 'name' | 'phone' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function UsersTable({ initialUsers, totalPages }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>('email');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchPage = async (page: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/users-info?page=${page}&limit=25&sort=${sortField}&order=${sortDirection}`);
      const data = await res.json();
      setUsers(data.users);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <span>Name</span>
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('phone')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <span>Phone</span>
                <SortIcon field="phone" />
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <span>Registered</span>
                <SortIcon field="createdAt" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelectedUser(user)}
            >
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name || '-'}</TableCell>
              <TableCell>{user.phone || '-'}</TableCell>
              <TableCell>
                {user.createdAt 
                  ? formatDistance(new Date(user.createdAt), new Date(), {
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
      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={true}
          onOpenChange={(open) => !open && setSelectedUser(null)}
          onUserUpdated={() => fetchPage(currentPage)}
        />
      )}
    </div>
  );
}
