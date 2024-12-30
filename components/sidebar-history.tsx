'use client';

import { isAfter, isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { memo, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';
import { Button } from "@/components/ui/button";

import {
  CheckCircleFillIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  PinIcon,
  ShareIcon,
  TrashIcon,
  FolderIcon,
  PencilEditIcon,
  FolderPlusIcon,
  FolderOpenIcon,
} from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import type { Chat } from '@/lib/db/schema';
import { fetcher } from '@/lib/utils';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import { Input } from './ui/input';
import styles from './sidebar-history.module.css';

interface Folder {
  id: string;
  name: string;
  chats: Chat[];
  isExpanded?: boolean;
}

interface FolderSectionProps {
  folders: Folder[];
  setFolders: (folders: Folder[] | ((prev: Folder[]) => Folder[])) => void;
  chats: Chat[];
  setOpenMobile: (open: boolean) => void;
  onDeleteChat: (chatId: string) => void;
  activeChatId?: string;
  isAddingFolder: boolean;
  setIsAddingFolder: (isAddingFolder: boolean) => void;
  foldersMutate: () => Promise<any>;
}

interface GroupedChats {
  pinned: Chat[];
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
}

const handleChatFolderUpdate = async (folder: Folder, chat: Chat, isInFolder: boolean, folders: Folder[], setFolders: (folders: Folder[]) => void, mutate: () => void) => {
  try {
    const response = await fetch('/api/folder', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: folder.id,
        chatId: chat.id,
        action: isInFolder ? 'removeChat' : 'addChat'
      }),
    });

    if (response.ok) {
      const updatedFolders = folders.map(f => {
        if (f.id === folder.id) {
          return {
            ...f,
            chats: isInFolder
              ? f.chats.filter(c => c.id !== chat.id) // Remove if already in folder
              : [...f.chats.filter(c => c.id !== chat.id), chat] // Add if not in folder
          };
        }
        return {
          ...f,
          chats: f.chats.filter(c => c.id !== chat.id)
        };
      });
      setFolders(updatedFolders);
      mutate(); // Refresh folders data
      toast.success(isInFolder ? 'Chat removed from folder' : 'Chat added to folder');
    } else {
      throw new Error('Failed to update folder');
    }
  } catch (error) {
    console.error('Failed to update chat in folder:', error);
    toast.error('Failed to update folder');
  }
};

const ChatItemInFolder = ({ chat, isActive, onDelete, setOpenMobile, mutate: chatMutate, folders, setFolders }: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
  mutate: () => void;
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
}) => {
  const { mutate: globalMutate } = useSWRConfig();
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibility: chat.visibility,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = async () => {
    if (!newTitle.trim()) {
      setIsEditing(false);
      setNewTitle(chat.title);
      return;
    }

    const response = await fetch(`/api/chat?id=${chat.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    });
    if (response.ok) {
      setIsEditing(false);
      chat.title = newTitle; // Update local state immediately
      chatMutate(); // Refresh from server
    } else {
      toast.error('Failed to rename chat');
      setNewTitle(chat.title);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.add(styles.chatDragging);
    e.dataTransfer.setData('chatId', chat.id);
    e.dataTransfer.effectAllowed = 'move';

    // Create ghost element
    const ghost = document.createElement('div');
    ghost.className = styles.chatDragGhost;
    ghost.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>${chat.title}</span>
    `;

    document.body.appendChild(ghost);

    // Set empty image as drag image to hide default ghost
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);

    // Position the ghost element near the cursor
    const updateGhostPosition = (e: MouseEvent) => {
      ghost.style.left = `${e.pageX + 15}px`;
      ghost.style.top = `${e.pageY + 15}px`;
    };

    document.addEventListener('dragover', updateGhostPosition as any);

    // Remove the ghost element and event listener after drag ends
    const cleanup = () => {
      ghost.remove();
      element.classList.remove(styles.chatDragging);
      document.removeEventListener('dragover', updateGhostPosition as any);
      window.removeEventListener('dragend', cleanup);
      window.removeEventListener('drop', cleanup);
    };

    window.addEventListener('dragend', cleanup);
    window.addEventListener('drop', cleanup);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to parent elements
  };

  return (
    <SidebarMenuItem className="ml-6 list-none">
      <div
        draggable={!isTouchDevice}
        onDragStart={handleDragStart}
        className="flex w-full items-center"
      >
        <SidebarMenuButton asChild isActive={isActive}>
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
              <Input
                ref={inputRef}
                value={newTitle}
                onClick={handleInputClick}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename();
                  } else if (e.key === 'Escape') {
                    setIsEditing(false);
                    setNewTitle(chat.title);
                  }
                }}
                onBlur={handleRename}
                className="h-6 py-0 px-1"
              />
            </div>
          ) : (
            <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
              <span>{chat.title}</span>
            </Link>
          )}
        </SidebarMenuButton>

        <DropdownMenu modal={true}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
              showOnHover={!isActive}
            >
              <MoreHorizontalIcon />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end">
            <span id="chat-options-title" className="sr-only">Chat options</span>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <PencilEditIcon />
              <span>Rename</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                chatMutate();
                globalMutate('/api/history', (currentData: any) => {
                  if (!currentData) return currentData;

                  const chats = Array.isArray(currentData) ? currentData : currentData.chats || [];
                  const updatedChats = chats.map((c: Chat) =>
                    c.id === chat.id ? { ...c, pinned: !c.pinned } : c
                  );

                  return Array.isArray(currentData) ? updatedChats : { ...currentData, chats: updatedChats };
                }, false);

                // Perform server update asynchronously
                fetch(`/api/chat?id=${chat.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ pinned: !chat.pinned }),
                }).catch(() => {
                  // Revert the optimistic update if the server request fails
                  chatMutate();
                  globalMutate('/api/history', (currentData: any) => {
                    if (!currentData) return currentData;

                    const chats = Array.isArray(currentData) ? currentData : currentData.chats || [];
                    const revertedChats = chats.map((c: Chat) =>
                      c.id === chat.id ? { ...c, pinned: chat.pinned } : c
                    );

                    return Array.isArray(currentData) ? revertedChats : { ...currentData, chats: revertedChats };
                  }, false);
                });
              }}
            >
              <PinIcon />
              <span>{chat.pinned ? 'Unpin' : 'Pin'}</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <FolderIcon size={14} />
                <span>Folder</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent key={folders.length} className="min-w-[150px] max-w-[100px]">
                  {folders.length === 0 ? (
                    <DropdownMenuItem className="text-muted-foreground whitespace-normal" disabled>
                      No folders created yet
                    </DropdownMenuItem>
                  ) : (
                    folders.map((folder) => (
                      <DropdownMenuItem
                        key={folder.id}
                        className="cursor-pointer flex-row justify-between gap-2"
                        onClick={() => {
                          const isInFolder = folder.chats.some(c => c.id === chat.id);
                          handleChatFolderUpdate(folder, chat, isInFolder, folders, setFolders, () => {
                            globalMutate('/api/folder');
                            chatMutate();
                          });
                        }}
                      >
                        <div className="flex flex-row gap-2 items-center min-w-0 flex-1">
                          <FolderIcon size={14} />
                          <span className="truncate">{folder.name}</span>
                        </div>
                        {folder.chats.some(c => c.id === chat.id) && (
                          <CheckCircleFillIcon size={14} />
                        )}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub aria-labelledby="chat-options-title">
              <DropdownMenuSubTrigger className="cursor-pointer">
                <ShareIcon />
                <span>Share</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={() => {
                      setVisibilityType('private');
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <LockIcon size={12} />
                      <span>Private</span>
                    </div>
                    {visibilityType === 'private' ? (
                      <CheckCircleFillIcon />
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={() => {
                      setVisibilityType('public');
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <GlobeIcon />
                      <span>Public</span>
                    </div>
                    {visibilityType === 'public' ? <CheckCircleFillIcon /> : null}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
              onSelect={() => onDelete(chat.id)}
            >
              <TrashIcon />
              <span>Delete</span>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarMenuItem>
  );
};

const FolderItem = ({
  folder,
  isExpanded,
  onToggle,
  folders,
  chats,
  setFolders,
  foldersMutate
}: {
  folder: Folder;
  isExpanded: boolean;
  onToggle: () => void;
  folders: Folder[];
  chats: Chat[];
  setFolders: (folders: Folder[]) => void;
  foldersMutate: () => Promise<any>;
}) => {
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [displayName, setDisplayName] = useState(folder.name);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { mutate: globalMutate } = useSWRConfig();

  useEffect(() => {
    setDisplayName(folder.name);
  }, [folder.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsEditing(false);

    try {
      // Update local display immediately
      setDisplayName(newName);

      // Optimistic update with sorting
      const updatedFolders = folders
        .map(f => f.id === folder.id ? { ...f, name: newName } : f)
        .sort((a, b) => a.name.localeCompare(b.name));
      setFolders(updatedFolders);

      // Update server
      const response = await fetch(`/api/folder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: folder.id,
          action: 'rename',
          name: newName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename folder');
      }

      toast.success('Folder renamed successfully');
      foldersMutate(); // Force revalidation after successful update
    } catch (error) {
      console.error('Failed to rename folder:', error);
      toast.error('Failed to rename folder');
      // Revert local display name and optimistic update
      setDisplayName(folder.name);
      foldersMutate();
    }
  };

  const handleDelete = async () => {
    try {
      const updatedFolders = folders.filter(f => f.id !== folder.id);
      setFolders(updatedFolders);
      setShowDeleteDialog(false);

      const response = await fetch(`/api/folder?id=${folder.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      toast.success('Folder deleted successfully');
    } catch (error) {
      console.error('Failed to delete folder:', error);
      toast.error('Failed to delete folder');
      foldersMutate();
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
    const chatId = e.dataTransfer.getData('chatId');
    if (!chatId) return;

    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const isInFolder = folder.chats?.some(c => c.id === chatId) ?? false;
    if (isInFolder) return;

    try {
      const updatedFolders = folders.map(f => {
        if (f.id === folder.id) {
          return {
            ...f,
            chats: [...(f.chats || []).filter(c => c.id !== chatId), chat]
          };
        }
        return {
          ...f,
          chats: (f.chats || []).filter(c => c.id !== chatId)
        };
      });
      setFolders(updatedFolders);

      const response = await fetch(`/api/chat?id=${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderId: folder.id
        }),
      });

      if (response.ok) {
        globalMutate('/api/history');
        toast.success('Chat added to folder');
      } else {
        throw new Error('Failed to update folder');
      }
    } catch (error) {
      console.error('Failed to update chat in folder:', error);
      toast.error('Failed to update folder');
      globalMutate('/api/history');
    }
  };

  return (
    <div
      className={`relative ${styles.folderDropTarget} ${isDropTarget ? styles.canDrop : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDropTarget(true);
      }}
      onDragLeave={() => setIsDropTarget(false)}
      onDrop={handleDrop}
    >
      <SidebarGroup>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className="px-2"
            >
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                onBlur={handleSubmit}
              />
            </form>
          ) : (
            <div className="group relative w-full flex items-center group/folder">
              <SidebarMenuButton onClick={onToggle} className="flex-1">
                <div className="flex items-center gap-2">
                  {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
                  <span className="flex items-center gap-1">
                    {displayName}
                    <span className="text-[10px] text-sidebar-foreground/50">({folder.chats.length})</span>
                  </span>
                </div>
              </SidebarMenuButton>

              <DropdownMenu modal={true}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    className="absolute right-2 hidden group-hover/folder:block group-hover/folder:opacity-100 data-[state=open]:opacity-100 data-[state=open]:block data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    showOnHover={true}
                  >
                    <MoreHorizontalIcon size={14} />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    setNewName(folder.name);
                    setIsEditing(true);
                  }}>
                    <PencilEditIcon size={14} />
                    <span>Rename</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
                  >
                    <TrashIcon size={14} />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {isExpanded && (
          <SidebarGroupContent>
            {folder.chats?.map((chat) => (
              <ChatItemInFolder
                key={chat.id}
                chat={chat}
                isActive={false}
                onDelete={() => { }}
                setOpenMobile={() => { }}
                mutate={() => globalMutate('/api/history')}
                folders={folders}
                setFolders={setFolders}
              />
            ))}
          </SidebarGroupContent>
        )}
      </SidebarGroup>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this folder? The chats inside will not be deleted.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const NewFolderInput = ({ 
  folders,
  setFolders,
  setIsAddingFolder 
}: {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  setIsAddingFolder: (isAdding: boolean) => void;
}) => {
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = async (name: string) => {
    try {
      const response = await fetch('/api/folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to create folder');

      const newFolder = await response.json();
      setFolders([...folders, { ...newFolder, chats: [] }]);
      setIsAddingFolder(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
      toast.error('Failed to create folder');
    }
  };

  return (
    <form
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        if (newFolderName.trim()) {
          handleCreateFolder(newFolderName.trim());
        }
        setNewFolderName('');
      }}
      className="px-2 mb-2"
    >
      <Input
        type="text"
        placeholder="Folder name"
        value={newFolderName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)}
        autoFocus
        onBlur={() => {
          setNewFolderName('');
          setIsAddingFolder(false);
        }}
      />
    </form>
  );
};

export const FolderSection = memo(({ 
  folders, 
  setFolders, 
  chats, 
  setOpenMobile, 
  onDeleteChat, 
  activeChatId, 
  isAddingFolder, 
  setIsAddingFolder,
  foldersMutate 
}: FolderSectionProps & { foldersMutate: () => Promise<any> }) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const handleFolderToggle = useCallback((folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  }, []);

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Folders
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 mr-2"
          onClick={() => setIsAddingFolder(true)}
        >
          <FolderPlusIcon />
        </Button>
      </div>

      {isAddingFolder && (
        <NewFolderInput
          folders={folders}
          setFolders={setFolders}
          setIsAddingFolder={setIsAddingFolder}
        />
      )}

      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          isExpanded={expandedFolders[folder.id] || false}
          onToggle={() => handleFolderToggle(folder.id)}
          folders={folders}
          chats={chats}
          setFolders={setFolders}
          foldersMutate={foldersMutate}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  if (prevProps.isAddingFolder !== nextProps.isAddingFolder) return false;
  if (prevProps.activeChatId !== nextProps.activeChatId) return false;
  if (prevProps.folders.length !== nextProps.folders.length) return false;
  if (prevProps.chats.length !== nextProps.chats.length) return false;
  
  const prevFolderIds = prevProps.folders.map(f => f.id).join(',');
  const nextFolderIds = nextProps.folders.map(f => f.id).join(',');
  return prevFolderIds === nextFolderIds;
});

FolderSection.displayName = 'FolderSection';

const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
  mutate: chatMutate,
  folders,
  setFolders,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
  mutate: () => void;
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
}) => {
  const { mutate: globalMutate } = useSWRConfig();
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibility: chat.visibility,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = async () => {
    if (!newTitle.trim()) {
      setIsEditing(false);
      setNewTitle(chat.title);
      return;
    }

    const response = await fetch(`/api/chat?id=${chat.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    });
    if (response.ok) {
      setIsEditing(false);
      chat.title = newTitle; // Update local state immediately
      chatMutate(); // Refresh from server
    } else {
      toast.error('Failed to rename chat');
      setNewTitle(chat.title);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.add(styles.chatDragging);
    e.dataTransfer.setData('chatId', chat.id);
    e.dataTransfer.effectAllowed = 'move';

    // Create ghost element
    const ghost = document.createElement('div');
    ghost.className = styles.chatDragGhost;
    ghost.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>${chat.title}</span>
    `;

    document.body.appendChild(ghost);

    // Set empty image as drag image to hide default ghost
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);

    // Position the ghost element near the cursor
    const updateGhostPosition = (e: MouseEvent) => {
      ghost.style.left = `${e.pageX + 15}px`;
      ghost.style.top = `${e.pageY + 15}px`;
    };

    document.addEventListener('dragover', updateGhostPosition as any);

    // Remove the ghost element and event listener after drag ends
    const cleanup = () => {
      ghost.remove();
      element.classList.remove(styles.chatDragging);
      document.removeEventListener('dragover', updateGhostPosition as any);
      window.removeEventListener('dragend', cleanup);
      window.removeEventListener('drop', cleanup);
    };

    window.addEventListener('dragend', cleanup);
    window.addEventListener('drop', cleanup);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up to parent elements
  };

  return (
    <SidebarMenuItem>
      <div
        draggable={!isTouchDevice}
        onDragStart={handleDragStart}
        className="flex w-full"
      >
        <SidebarMenuButton asChild isActive={isActive}>
          {isEditing ? (
            <div className="flex items-center gap-2 w-full" onClick={(e) => e.preventDefault()}>
              <Input
                ref={inputRef}
                value={newTitle}
                onClick={handleInputClick}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename();
                  } else if (e.key === 'Escape') {
                    setIsEditing(false);
                    setNewTitle(chat.title);
                  }
                }}
                onBlur={handleRename}
                className="h-6 py-0 px-1"
              />
            </div>
          ) : (
            <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
              <span>{chat.title}</span>
            </Link>
          )}
        </SidebarMenuButton>

        <DropdownMenu modal={true}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
              showOnHover={!isActive}
            >
              <MoreHorizontalIcon />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end">
            <span id="chat-options-title" className="sr-only">Chat options</span>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <PencilEditIcon />
              <span>Rename</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                chatMutate();
                globalMutate('/api/history', (currentData: any) => {
                  if (!currentData) return currentData;

                  const chats = Array.isArray(currentData) ? currentData : currentData.chats || [];
                  const updatedChats = chats.map((c: Chat) =>
                    c.id === chat.id ? { ...c, pinned: !c.pinned } : c
                  );

                  return Array.isArray(currentData) ? updatedChats : { ...currentData, chats: updatedChats };
                }, false);

                // Perform server update asynchronously
                fetch(`/api/chat?id=${chat.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ pinned: !chat.pinned }),
                }).catch(() => {
                  // Revert the optimistic update if the server request fails
                  chatMutate();
                  globalMutate('/api/history', (currentData: any) => {
                    if (!currentData) return currentData;

                    const chats = Array.isArray(currentData) ? currentData : currentData.chats || [];
                    const revertedChats = chats.map((c: Chat) =>
                      c.id === chat.id ? { ...c, pinned: chat.pinned } : c
                    );

                    return Array.isArray(currentData) ? revertedChats : { ...currentData, chats: revertedChats };
                  }, false);
                });
              }}
            >
              <PinIcon />
              <span>{chat.pinned ? 'Unpin' : 'Pin'}</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <FolderIcon size={14} />
                <span>Folder</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent key={folders.length} className="min-w-[150px] max-w-[100px]">
                  {!folders || folders.length === 0 ? (
                    <DropdownMenuItem className="text-muted-foreground whitespace-normal" disabled>
                      No folders created yet
                    </DropdownMenuItem>
                  ) : (
                    folders.map((folder) => {
                      const isInFolder = folder.chats?.some(c => c.id === chat.id) ?? false;
                      return (
                        <DropdownMenuItem
                          key={folder.id}
                          className="cursor-pointer flex-row justify-between gap-2"
                          onClick={() => {
                            handleChatFolderUpdate(folder, chat, isInFolder, folders, setFolders, () => {
                              chatMutate();
                              globalMutate('/api/folder');
                              globalMutate('/api/history');
                            });
                          }}
                        >
                          <div className="flex flex-row gap-2 items-center min-w-0 flex-1">
                            <FolderIcon size={14} />
                            <span className="truncate">{folder.name}</span>
                          </div>
                          {folder.chats.some(c => c.id === chat.id) && (
                            <CheckCircleFillIcon size={14} />
                          )}
                        </DropdownMenuItem>
                      );
                    })
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub aria-labelledby="chat-options-title">
              <DropdownMenuSubTrigger className="cursor-pointer">
                <ShareIcon />
                <span>Share</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={() => {
                      setVisibilityType('private');
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <LockIcon size={12} />
                      <span>Private</span>
                    </div>
                    {visibilityType === 'private' ? (
                      <CheckCircleFillIcon />
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={() => {
                      setVisibilityType('public');
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <GlobeIcon />
                      <span>Public</span>
                    </div>
                    {visibilityType === 'public' ? <CheckCircleFillIcon /> : null}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
              onSelect={() => onDelete(chat.id)}
            >
              <TrashIcon />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarMenuItem>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  if (prevProps.folders !== nextProps.folders) return false;
  return true;
});

export function SidebarHistory({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
  const { mutate: globalMutate } = useSWRConfig();
  const {
    data: history,
    isLoading: isLoadingHistory,
    mutate: historyMutate,
  } = useSWR<Array<Chat>>(user ? '/api/history' : null, fetcher, {
    fallbackData: [],
  });

  const {
    data: dbFolders = [],
    isLoading: isLoadingFolders,
    mutate: foldersMutate,
  } = useSWR<Array<Folder>>(
    user ? '/api/folder' : null,
    fetcher,
    {
      fallbackData: [],
      revalidateOnFocus: false,
      revalidateIfStale: false
    }
  );

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const router = useRouter();

  // Memoize folders with expanded state and sort alphabetically
  const folders = useMemo(() => {
    return dbFolders
      .map(folder => ({
        ...folder,
        chats: Array.isArray(folder.chats) ? folder.chats : [],
        isExpanded: false
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dbFolders]);

  const setFolders = useCallback((newFolders: Folder[] | ((prev: Folder[]) => Folder[])) => {
    if (typeof newFolders === 'function') {
      const updatedFolders = newFolders(folders);
      // Sort before updating
      const sortedFolders = [...updatedFolders].sort((a, b) => a.name.localeCompare(b.name));
      foldersMutate(sortedFolders, { revalidate: false });
    } else {
      // Sort before updating
      const sortedFolders = [...newFolders].sort((a, b) => a.name.localeCompare(b.name));
      foldersMutate(sortedFolders, { revalidate: false });
    }
  }, [folders, foldersMutate]);

  // Only mutate on pathname change
  useEffect(() => {
    historyMutate();
    foldersMutate();
  }, [pathname, historyMutate, foldersMutate]);

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Login to save and revisit previous chats!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isLoadingHistory || isLoadingFolders) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Chat History
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (history?.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex flex-row justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  const groupChatsByDate = (chats: Chat[]): GroupedChats => {
    const now = new Date();
    const oneWeekAgo = subWeeks(now, 1);
    const oneMonthAgo = subMonths(now, 1);

    // Get all chat IDs that are in folders
    const chatIdsInFolders = new Set(
      folders.flatMap(folder => folder.chats?.map(chat => chat.id) ?? [])
    );

    // Filter out chats that are in folders, except pinned chats
    const chatsToGroup = chats.filter(chat => !chatIdsInFolders.has(chat.id) || chat.pinned);

    return chatsToGroup.reduce(
      (groups: GroupedChats, chat: Chat) => {
        if (chat.pinned) {
          groups.pinned.push(chat);
        } else {
          const chatDate = new Date(chat.createdAt);
          if (isToday(chatDate)) {
            groups.today.push(chat);
          } else if (isYesterday(chatDate)) {
            groups.yesterday.push(chat);
          } else if (isAfter(chatDate, oneWeekAgo)) {
            groups.lastWeek.push(chat);
          } else if (isAfter(chatDate, oneMonthAgo)) {
            groups.lastMonth.push(chat);
          } else {
            groups.older.push(chat);
          }
        }
        return groups;
      },
      { pinned: [], today: [], yesterday: [], lastWeek: [], lastMonth: [], older: [] }
    );
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          {history &&
            (() => {
              const groupedChats = groupChatsByDate(history);

              return (
                <SidebarMenu>
                  {groupedChats.pinned.length > 0 && (
                    <>
                      <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                        Pinned
                      </div>
                      {groupedChats.pinned.map((chat: Chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={chat.id === id}
                          onDelete={(chatId) => {
                            setDeleteId(chatId);
                            setShowDeleteDialog(true);
                          }}
                          setOpenMobile={setOpenMobile}
                          mutate={() => {
                            globalMutate('/api/history');
                          }}
                          folders={folders}
                          setFolders={setFolders}
                        />
                      ))}
                    </>
                  )}
                </SidebarMenu>
              );
            })()}

          <FolderSection
            folders={folders}
            setFolders={setFolders}
            chats={history || []}
            setOpenMobile={setOpenMobile}
            onDeleteChat={(chatId) => {
              setDeleteId(chatId);
              setShowDeleteDialog(true);
            }}
            activeChatId={typeof id === 'string' ? id : undefined}
            isAddingFolder={isAddingFolder}
            setIsAddingFolder={setIsAddingFolder}
            foldersMutate={foldersMutate}
          />
          <SidebarMenu>
            {history &&
              (() => {
                const groupedChats = groupChatsByDate(history);

                return (
                  <>
                    {groupedChats.today.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-3">
                          Today
                        </div>
                        {groupedChats.today.map((chat: Chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                            mutate={() => {
                              globalMutate('/api/history');
                            }}
                            folders={folders}
                            setFolders={setFolders}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-3">
                          Yesterday
                        </div>
                        {groupedChats.yesterday.map((chat: Chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                            mutate={() => {
                              globalMutate('/api/history');
                            }}
                            folders={folders}
                            setFolders={setFolders}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.lastWeek.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-3">
                          Last 7 days
                        </div>
                        {groupedChats.lastWeek.map((chat: Chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                            mutate={() => {
                              globalMutate('/api/history');
                            }}
                            folders={folders}
                            setFolders={setFolders}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.lastMonth.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-3">
                          Last 30 days
                        </div>
                        {groupedChats.lastMonth.map((chat: Chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                            mutate={() => {
                              globalMutate('/api/history');
                            }}
                            folders={folders}
                            setFolders={setFolders}
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.older.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-3">
                          Older
                        </div>
                        {groupedChats.older.map((chat: Chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId);
                              setShowDeleteDialog(true);
                            }}
                            setOpenMobile={setOpenMobile}
                            mutate={() => {
                              globalMutate('/api/history');
                            }}
                            folders={folders}
                            setFolders={setFolders}
                          />
                        ))}
                      </>
                    )}
                  </>
                );
              })()}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your chat and remove it from our servers.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
                method: 'DELETE',
              });

              toast.promise(deletePromise, {
                loading: 'Deleting chat...',
                success: () => {
                  globalMutate('/api/history');
                  return 'Chat deleted successfully';
                },
                error: 'Failed to delete chat',
              });

              setShowDeleteDialog(false);

              if (deleteId === id) {
                router.push('/');
              }
            }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
