'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from "sonner";
import { AppsHeader } from '@/components/apps-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Publication {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string;
  category: string | null;
  cover: string | null;
  slug: string;
}

export default function EditPublicationPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [coverUrl, setCoverUrl] = React.useState<string>();
  const [uploadingCover, setUploadingCover] = React.useState(false);
  const [publication, setPublication] = React.useState<Publication | null>(null);

  React.useEffect(() => {
    // We no longer need an admin check here since the middleware handles it.
    if (slug) {
      fetch(`/api/publish/${slug}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch publication');
          return res.json();
        })
        .then((data) => {
          setPublication(data);
          setCoverUrl(data.cover || undefined);
        })
        .catch((error) => {
          console.error('Error fetching publication:', error);
          toast.error('Failed to fetch publication');
        });
    }
  }, [slug]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingCover(true);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/cover', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');

      const { url } = await res.json();
      setCoverUrl(url);
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    if (!session?.user?.email) return;

    try {
      setLoading(true);

      const data = {
        title: formData.get('title'),
        excerpt: formData.get('excerpt'),
        content: formData.get('content'),
        author: formData.get('author'),
        category: formData.get('category'),
        cover: coverUrl,
      };

      const endpoint = slug 
        ? `/api/publish/${slug}`
        : '/api/publish';
      
      const method = slug ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to publish');

      const result = await res.json();
      
      toast.success(slug ? 'Publication updated' : 'Publication created');
      router.push(`/publications/${result.slug}`);
    } catch (error) {
      console.error('Error publishing:', error);
      toast.error('Failed to publish');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <AppsHeader />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Edit Publication</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields here */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select name="category" defaultValue={publication?.category || 'blog'}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {(['Blog', 'Data', 'Research'] as const).map((category) => {
                  const storedValue = category.toLowerCase();
                  const displayText = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
                  return (
                    <SelectItem key={storedValue} value={storedValue}>
                      {displayText}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          {/* Continue with other fields and submit button */}
          <Button type="submit" disabled={loading || uploadingCover}>
            {loading ? 'Publishing...' : 'Update'}
          </Button>
        </form>
      </main>
    </div>
  );
}