'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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

const CATEGORIES = ['Blog', 'Data', 'Research'] as const;

function PublishPage() {
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
      console.error('Failed to upload cover:', error);
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user?.id) {
      console.log('No session or user ID');
      return;
    }
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      excerpt: formData.get('excerpt'),
      author: session.user.name || 'Anonymous',
      category: formData.get('category'),
      content: formData.get('content'),
      userId: session.user.id,
      cover: coverUrl
    };
    console.log('Submitting data:', data);
    
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      console.log('Response:', { ok: res.ok, status: res.status, result });

      if (!res.ok) throw new Error('Failed to publish');
      
      router.push('/publications');
    } catch (error) {
      console.error('Failed to publish:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AppsHeader title="Create Publication" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <Input
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="author" className="block text-sm font-medium mb-2">
              Author
            </label>
            <Input
              type="text"
              id="author"
              name="author"
              value={session?.user?.name || 'Anonymous'}
              disabled
            />
          </div>

          <div className="flex-1">
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select name="category" defaultValue={CATEGORIES[0]}>
              <SelectTrigger id="category">
                <SelectValue />
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
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={10}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="cover" className="block text-sm font-medium mb-2">
            Cover Image
          </label>
          <div className="space-y-2">
            <Input
              type="file"
              id="cover"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploadingCover}
            />
            {uploadingCover && (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            )}
            {coverUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={coverUrl} 
                  alt="Cover preview" 
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish'}
        </Button>
      </form>
    </div>
  );
}

export default PublishPage;