CREATE TABLE IF NOT EXISTS "Folder" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "name" text NOT NULL,
  "userId" uuid NOT NULL,
  CONSTRAINT "Folder_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ChatToFolder" (
  "chatId" uuid NOT NULL,
  "folderId" uuid NOT NULL,
  CONSTRAINT "ChatToFolder_pkey" PRIMARY KEY ("chatId", "folderId"),
  CONSTRAINT "ChatToFolder_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE,
  CONSTRAINT "ChatToFolder_folderId_Folder_id_fk" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE
);
