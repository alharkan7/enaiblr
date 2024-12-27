import { auth } from '@/app/(auth)/auth';
import { 
  createFolder,
  updateFolder,
  deleteFolder,
  getFoldersByUserId,
  updateChatFolder,
} from '@/lib/db/queries';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const folders = await getFoldersByUserId(session.user.id);
    return new Response(JSON.stringify(folders), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch folders' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { name } = await request.json();
    const folder = await createFolder({
      name,
      userId: session.user.id,
    });

    return new Response(JSON.stringify(folder), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to create folder:', error);
    return new Response(JSON.stringify({ error: 'Failed to create folder', details: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { id, name, action, chatId } = await request.json();
    
    if (action === 'rename') {
      const folder = await updateFolder(id, { name });
      return new Response(JSON.stringify(folder), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'addChat') {
      await updateChatFolder({ id: chatId, folderId: id });
      return new Response(null, { status: 204 });
    } else if (action === 'removeChat') {
      await updateChatFolder({ id: chatId, folderId: null });
      return new Response(null, { status: 204 });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update folder' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Folder ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await deleteFolder(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete folder' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
