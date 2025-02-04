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
const CATEGORIES = ['Blog', 'Data', 'Research'] as const;

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

      const authorValue = formData.get('author') || session?.user?.name || session?.user?.email?.split('@')[0] || 'Enaiblr';
      const content = formData.get('content')?.toString() || '';
      
      // Ensure content has proper markdown line breaks
      const formattedContent = content
        .split('\n')
        .map(line => line.trim())
        .join('\n\n');

      const data = {
        title: formData.get('title'),
        excerpt: formData.get('excerpt'),
        content: formattedContent,
        author: authorValue,
        category: formData.get('category'),
        cover: coverUrl,
        slug: formData.get('slug')?.toString() || undefined,
      };

      console.log('Submitting data:', data);

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
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/20">
      <AppsHeader
        title={slug ? 'Edit Publication' : 'New Publication'}
      />
      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-background rounded-xl shadow-sm border p-8">

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-muted-foreground">
                Title
              </label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={publication?.title}
                className="h-12"
                placeholder="Enter publication title"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Author */}
              <div className="space-y-2">
                <label htmlFor="author" className="text-sm font-medium text-muted-foreground">
                  Author
                </label>
                <Input
                  id="author"
                  name="author"
                  value={publication?.author || session?.user?.name || session?.user?.email?.split('@')[0] || 'Enaiblr'}
                  onChange={(e) => setPublication(prev => prev ? { ...prev, author: e.target.value } : null)}
                  className="h-12"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-muted-foreground">
                  Category
                </label>
                <Select name="category" defaultValue={publication?.category || 'blog'}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => {
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

              {/* Slug */}
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium text-muted-foreground">
                  Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="Enter custom slug"
                  className="h-12"
                  defaultValue={publication?.slug || ''}
                />
              </div>

            </div>

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-muted-foreground">
                Content
              </label>
              <Textarea
                id="content"
                name="content"
                required
                rows={12}
                defaultValue={publication?.content}
                placeholder="Write your publication content here..."
                className="resize-none"
              />
            </div>

            {/* Cover Image - Moved up for better visual hierarchy */}
            <div className="space-y-2">
              <label htmlFor="cover" className="text-sm font-medium text-muted-foreground">
                Cover Image
              </label>
              <div className="flex flex-col gap-4">
                {coverUrl && (
                  <img
                    src={coverUrl}
                    alt="Cover preview"
                    className="rounded-lg w-full h-[200px] object-cover bg-muted"
                  />
                )}
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium text-muted-foreground">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                defaultValue={publication?.excerpt || ''}
                placeholder="Brief summary of the publication"
                className="resize-none"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading || uploadingCover}
                className="w-full sm:w-auto h-12 px-8"
              >
                {loading ? 'Publishing...' : 'Update'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}