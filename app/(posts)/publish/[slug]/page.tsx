'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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

const CATEGORIES = ['Blog', 'Data', 'Research'] as const;
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') ?? [];

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

interface PageProps {
  params: { slug: string };
}

export default function EditPublicationPage({ params }: PageProps) {
  const { slug } = params;
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
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      router.push('/');
      return;
    }

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
  }, [slug, session, router]);

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

      const res = await fetch(`/api/publish/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update');

      const result = await res.json();
      
      toast.success('Publication updated');
      router.push(`/publications/${result.slug}`);
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Failed to update publication');
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
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={publication?.title}
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Excerpt
            </label>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={publication?.excerpt || ''}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <Textarea
              id="content"
              name="content"
              required
              rows={10}
              defaultValue={publication?.content}
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-2">
              Author
            </label>
            <Input
              id="author"
              name="author"
              required
              defaultValue={publication?.author}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select name="category" defaultValue={publication?.category || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="cover" className="block text-sm font-medium mb-2">
              Cover Image
            </label>
            <Input
              id="cover"
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploadingCover}
            />
            {coverUrl && (
              <img
                src={coverUrl}
                alt="Cover preview"
                className="mt-2 rounded-lg max-h-48 object-cover"
              />
            )}
          </div>

          <Button type="submit" disabled={loading || uploadingCover}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </form>
      </main>
    </div>
  );
}
