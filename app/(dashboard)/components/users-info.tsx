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

export function UsersTable({ initialUsers, totalPages }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (page: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/users-info?page=${page}&limit=25`);
      const data = await res.json();
      setUsers(data.users);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Registered</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
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
    </div>
  );
}
