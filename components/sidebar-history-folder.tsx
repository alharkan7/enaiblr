'use client';

import Link from 'next/link';
import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
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
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Chat } from '@/lib/db/schema';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import { Input } from './ui/input';
import styles from './sidebar-history.module.css';
import { PlusIcon } from './icons';

export interface Folder {
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

export const handleChatFolderUpdate = async (folder: Folder, chat: Chat, isInFolder: boolean, folders: Folder[], setFolders: (folders: Folder[]) => void, mutate: () => void) => {
    // Optimistically update the UI
    const previousFolders = [...folders];
    const updatedFolders = folders.map(f => {
        if (f.id === folder.id) {
            return {
                ...f,
                chats: isInFolder
                    ? f.chats.filter(c => c.id !== chat.id)
                    : [...f.chats.filter(c => c.id !== chat.id), chat]
            };
        }
        return {
            ...f,
            chats: f.chats.filter(c => c.id !== chat.id)
        };
    });

    setFolders(updatedFolders);

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

        if (!response.ok) {
            throw new Error('Failed to update folder');
        }

        // Update was successful
        mutate(); // Single revalidation after success
        toast.success(isInFolder ? 'Chat removed from folder' : 'Chat added to folder');
    } catch (error) {
        // Revert the optimistic update on error
        setFolders(previousFolders);
        mutate();
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
    const router = useRouter();
    const { visibilityType, setVisibilityType } = useChatVisibility({
        chatId: chat.id,
        initialVisibility: chat.visibility,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(chat.title);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        <>
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
                                        )))
                                    }
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
                                        className="cursor-pointer"
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
                                        className="cursor-pointer"
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
                        const deletePromise = fetch(`/api/chat?id=${chat.id}`, {
                            method: 'DELETE',
                        });

                        toast.promise(deletePromise, {
                            loading: 'Deleting chat...',
                            success: async () => {
                                // Update parent state
                                onDelete(chat.id);
                                
                                // Update global history and folder data
                                await Promise.all([
                                    globalMutate('/api/history'),
                                    globalMutate('/api/folder')
                                ]);

                                // Update local folder state
                                const updatedFolders = folders.map(f => ({
                                    ...f,
                                    chats: f.chats.filter(c => c.id !== chat.id)
                                }));
                                setFolders(updatedFolders);

                                // Redirect if this was the active chat
                                if (isActive) {
                                    router.push('/');
                                }
                                
                                return 'Chat deleted successfully';
                            },
                            error: 'Failed to delete chat',
                        });
                    }}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
};

const FolderItem = ({
    folder,
    isExpanded,
    onToggle,
    folders,
    chats,
    setFolders,
    foldersMutate,
    setDeleteId,
    setShowDeleteDialog,
    onDeleteChat
}: {
    folder: Folder;
    isExpanded: boolean;
    onToggle: () => void;
    folders: Folder[];
    chats: Chat[];
    setFolders: (folders: Folder[]) => void;
    foldersMutate: () => Promise<any>;
    setDeleteId: (id: string | null) => void;
    setShowDeleteDialog: (show: boolean) => void;
    onDeleteChat: (chatId: string) => void;
}) => {
    const [isDropTarget, setIsDropTarget] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(folder.name);
    const [displayName, setDisplayName] = useState(folder.name);
    const [folderDeleteDialog, setFolderDeleteDialog] = useState(false);
    const { mutate: globalMutate } = useSWRConfig();

    useEffect(() => {
        setDisplayName(folder.name);
    }, [folder.name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedName.trim()) return;
        setIsEditing(false);

        try {
            // Update local display immediately
            setDisplayName(editedName);

            // Optimistic update with sorting
            const updatedFolders = folders
                .map(f => f.id === folder.id ? { ...f, name: editedName } : f)
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
                    name: editedName
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
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
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
                                        setEditedName(folder.name);
                                        setIsEditing(true);
                                    }}>
                                        <PencilEditIcon size={14} />
                                        <span>Rename</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setFolderDeleteDialog(true)}
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
                        {folder.chats
                            ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((chat) => (
                            <ChatItemInFolder
                                key={chat.id}
                                chat={chat}
                                isActive={false}
                                onDelete={onDeleteChat}
                                setOpenMobile={() => { }}
                                mutate={() => globalMutate('/api/history')}
                                folders={folders}
                                setFolders={setFolders}
                            />
                        ))}
                    </SidebarGroupContent>
                )}
            </SidebarGroup>

            <AlertDialog open={folderDeleteDialog} onOpenChange={setFolderDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                        Are you sure you want to delete this folder? The chats inside will not be deleted.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            const deletePromise = fetch(`/api/folder?id=${folder.id}`, {
                                method: 'DELETE',
                            });

                            toast.promise(deletePromise, {
                                loading: 'Deleting folder...',
                                success: () => {
                                    handleDelete();
                                    return 'Folder deleted successfully';
                                },
                                error: 'Failed to delete folder',
                            });
                        }}>
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

export function FolderSection({ 
    folders, 
    setFolders, 
    chats, 
    onDeleteChat, 
    activeChatId, 
    isAddingFolder, 
    setIsAddingFolder, 
    foldersMutate 
}: FolderSectionProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const router = useRouter();
    const { mutate: globalMutate } = useSWRConfig();
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

    const handleFolderToggle = useCallback((folderId: string) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    }, []);

    return (
        <>
            <div className="mt-3">
                <div className="flex items-center justify-between">
                    <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                        Folders
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mr-2 hover:bg-sidebar-accent-foreground/10"
                        onClick={() => setIsAddingFolder(true)}
                    >
                        <PlusIcon size={14} />
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
                        setDeleteId={setDeleteId}
                        setShowDeleteDialog={setShowDeleteDialog}
                        onDeleteChat={onDeleteChat}
                    />
                ))}
            </div>

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
                            if (!deleteId) return;
                            
                            const deletePromise = fetch(`/api/chat?id=${deleteId}`, {
                                method: 'DELETE',
                            });

                            toast.promise(deletePromise, {
                                loading: 'Deleting chat...',
                                success: () => {
                                    globalMutate('/api/history');
                                    foldersMutate();
                                    return 'Chat deleted successfully';
                                },
                                error: 'Failed to delete chat',
                            });

                            if (deleteId === activeChatId) {
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

FolderSection.displayName = 'FolderSection';