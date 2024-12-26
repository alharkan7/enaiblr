'use client';

import { isAfter, isToday, isYesterday, subMonths, subWeeks } from 'date-fns';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSWR, { useSWRConfig } from 'swr';

import {
  CheckCircleFillIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  PinIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon,
  FolderIcon,
  PencilEditIcon,
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
  DropdownMenuSeparator,
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

interface Folder {
  id: string;
  name: string;
  chats: Chat[];
  isExpanded?: boolean;
}

interface FolderSectionProps {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  chats: Chat[];
  setOpenMobile: (open: boolean) => void;
  onDeleteChat: (chatId: string) => void;
  activeChatId?: string;
  isAddingFolder: boolean;
  setIsAddingFolder: (isAddingFolder: boolean) => void;
}

const ChatItemInFolder = ({ chat, isActive, onDelete, setOpenMobile, mutate }: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
  mutate: () => void;
}) => {
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibility: chat.visibility,
  });

  return (
    <SidebarMenuItem className="ml-6 list-none">
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('chatId', chat.id);
        }}
        className="flex w-full items-center"
      >
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
            <span>{chat.title}</span>
          </Link>
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
              className="cursor-pointer"
              onClick={async () => {
                const response = await fetch(`/api/chat?id=${chat.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ pinned: !chat.pinned }),
                });
                if (response.ok) {
                  mutate();
                }
              }}
            >
              <PinIcon />
              <span>{chat.pinned ? 'Unpin' : 'Pin'}</span>
            </DropdownMenuItem>

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
  onDelete,
  folders,
  chats,
  setFolders 
}: {
  folder: Folder;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  folders: Folder[];
  chats: Chat[];
  setFolders: (folders: Folder[]) => void;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  if (isRenaming) {
    return (
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (newName.trim()) {
            setFolders(folders.map(f => 
              f.id === folder.id ? { ...f, name: newName.trim() } : f
            ));
            setIsRenaming(false);
          }
        }}
        className="px-2 py-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          type="text"
          value={newName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
          autoFocus
          onBlur={() => {
            setNewName(folder.name);
            setIsRenaming(false);
          }}
          className="h-6 text-sm"
        />
      </form>
    );
  }

  return (
    <div
      className="group/folder flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-md cursor-pointer"
      onClick={onToggle}
      onDragOver={(e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={(e: React.DragEvent) => {
        e.preventDefault();
        const chatId = e.dataTransfer.getData('chatId');
        if (chatId) {
          const chat = chats.find(c => c.id === chatId);
          if (chat) {
            const updatedFolders = folders.map(f => {
              if (f.id === folder.id) {
                return {
                  ...f,
                  chats: [...f.chats.filter(c => c.id !== chatId), chat]
                };
              }
              return {
                ...f,
                chats: f.chats.filter(c => c.id !== chatId)
              };
            });
            setFolders(updatedFolders);
          }
        }
      }}
    >
      <button className="flex items-center gap-2 flex-1">
        {isExpanded ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
        <FolderIcon size={14} />
        <span>{folder.name}</span>
        {folder.chats.length > 0 && (
          <span className="text-m text-muted-foreground">({folder.chats.length})</span>
        )}
      </button>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <button 
            className="opacity-0 group-hover/folder:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontalIcon size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsRenaming(true)}
          >
            <PencilEditIcon size={14} />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
            onSelect={onDelete}
          >
            <TrashIcon size={14} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const FolderSection = ({ folders, setFolders, chats, setOpenMobile, onDeleteChat, activeChatId, isAddingFolder, setIsAddingFolder }: FolderSectionProps) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [showDeleteFolderDialog, setShowDeleteFolderDialog] = useState(false);
  const { mutate } = useSWR('/api/chat');

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const chatId = e.dataTransfer.getData('chatId');
    if (chatId) {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        const updatedFolders = folders.map(f => {
          if (f.id === folderId) {
            return {
              ...f,
              chats: [...f.chats.filter(c => c.id !== chatId), chat]
            };
          }
          return {
            ...f,
            chats: f.chats.filter(c => c.id !== chatId)
          };
        });
        setFolders(updatedFolders);
      }
    }
  };

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(f => 
      f.id === folderId ? { ...f, isExpanded: f.isExpanded ? false : true } : f
    ));
  };

  return (
    <div className="mb-6">
      <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
        Folders
      </div>
      {!isAddingFolder && (
        <button
          onClick={() => setIsAddingFolder(true)}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-muted rounded-md"
        >
          <PlusIcon size={16} />
          <span>New Folder</span>
        </button>
      )}
      {isAddingFolder && (
        <form
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            if (newFolderName.trim()) {
              setFolders([...folders, { id: crypto.randomUUID(), name: newFolderName.trim(), chats: [], isExpanded: false }]);
              setNewFolderName('');
              setIsAddingFolder(false);
            }
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
      )}
      <div className="space-y-1 overflow-y-auto max-h-[50vh] hover:scrollbar hover:scrollbar-thumb-gray-300 hover:scrollbar-track-gray-100 
        dark:hover:scrollbar-thumb-gray-500 hover:scrollbar-thumb-rounded-full">
        {folders.map((folder) => (
          <div key={folder.id}>
            <FolderItem 
              folder={folder} 
              isExpanded={folder.isExpanded ?? false}
              onToggle={() => toggleFolder(folder.id)} 
              onDelete={() => {
                setFolderToDelete(folder);
                setShowDeleteFolderDialog(true);
              }}
              folders={folders}
              chats={chats}
              setFolders={setFolders}
            />
            {folder.isExpanded && folder.chats.map(chat => (
              <ChatItemInFolder
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onDelete={onDeleteChat}
                setOpenMobile={setOpenMobile}
                mutate={mutate}
              />
            ))}
          </div>
        ))}
      </div>
      <AlertDialog open={showDeleteFolderDialog} onOpenChange={setShowDeleteFolderDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder? The chats inside will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (folderToDelete) {
                  setFolders(folders.filter(f => f.id !== folderToDelete.id));
                  setFolderToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface GroupedChats {
  pinned: Chat[];
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
}

const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
  mutate,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
  mutate: () => void;
}) => {
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibility: chat.visibility,
  });

  return (
    <SidebarMenuItem>
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('chatId', chat.id);
        }}
        className="flex w-full"
      >
        <SidebarMenuButton asChild isActive={isActive}>
          <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
            <span>{chat.title}</span>
          </Link>
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
              className="cursor-pointer"
              onClick={async () => {
                const response = await fetch(`/api/chat?id=${chat.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ pinned: !chat.pinned }),
                });
                if (response.ok) {
                  mutate();
                }
              }}
            >
              <PinIcon />
              <span>{chat.pinned ? 'Unpin' : 'Pin'}</span>
            </DropdownMenuItem>

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
  return true;
});

export function SidebarHistory({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
  const { mutate: globalMutate } = useSWRConfig();
  const {
    data: history,
    isLoading,
    mutate: historyMutate,
  } = useSWR<Array<Chat>>(user ? '/api/history' : null, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    historyMutate();
  }, [pathname, historyMutate]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
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
  };

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

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Today
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

    // Get all chat IDs that are in folders (except pinned chats)
    const chatIdsInFolders = new Set(
      folders.flatMap(folder => folder.chats)
        .filter(chat => !chat.pinned)
        .map(chat => chat.id)
    );

    // Filter out chats that are in folders (except pinned chats)
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
          <FolderSection 
            folders={folders} 
            setFolders={setFolders} 
            chats={history ?? []} 
            setOpenMobile={setOpenMobile} 
            onDeleteChat={(chatId) => {
              setDeleteId(chatId);
              setShowDeleteDialog(true);
            }} 
            activeChatId={typeof id === 'string' ? id : undefined} 
            isAddingFolder={isAddingFolder}
            setIsAddingFolder={setIsAddingFolder}
          />
          <SidebarMenu>
            {history &&
              (() => {
                const groupedChats = groupChatsByDate(history);

                return (
                  <>
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
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.today.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
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
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
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
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.lastWeek.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
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
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.lastMonth.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
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
                          />
                        ))}
                      </>
                    )}

                    {groupedChats.older.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-sidebar-foreground/50 mt-6">
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
            <AlertDialogTitle id="delete-dialog-title">Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription aria-labelledby="delete-dialog-title">
            This action cannot be undone. This will permanently delete your chat and remove it from our servers.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
