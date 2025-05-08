'use server';
import { desc, eq, arrayContains, or } from 'drizzle-orm';

import {
  NewDocumentParams,
  insertDocumentSchema,
  documents as documentsTable,
  DocumentParams,
} from '@/lib/db/schema/documents';
import { db } from '../db';
import { generateEmbeddings } from '../rag/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';

export const createDocument = async (input: NewDocumentParams, text: string) => {
  const { content, fileName, fileType, userId, userEmail, sharedWith } = insertDocumentSchema.parse(input);

  const [document] = await db
    .insert(documentsTable)
    .values({ content, fileName, fileType, userId, userEmail, sharedWith })
    .returning();

  const embeddings = await generateEmbeddings(text);

  if (embeddings.length > 0) {
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        fileName,
        documentId: document.id,
        ...embedding,
      })),
    );
  }

  return true;
};

export async function getDocumentsForUser(
  userId: string,
  userEmail: string,
): Promise<Omit<DocumentParams, 'content'>[]> {
  try {
    const userDocuments = await db
      .select({
        id: documentsTable.id,
        fileName: documentsTable.fileName,
        fileType: documentsTable.fileType,
        createdAt: documentsTable.createdAt,
        updatedAt: documentsTable.updatedAt,
        sharedWith: documentsTable.sharedWith,
        userId: documentsTable.userId,
        userEmail: documentsTable.userEmail,
      })
      .from(documentsTable)
      .where(or(eq(documentsTable.userId, userId), arrayContains(documentsTable.sharedWith, [userEmail])))
      .orderBy(desc(documentsTable.createdAt)); // Show newest first

    return userDocuments;
  } catch (error) {
    console.error('Error fetching documents for user:', error);
    return []; // Return empty array on error or handle appropriately
  }
}

export async function getDocumentContent(documentId: string): Promise<Buffer | null> {
  try {
    const document = await db
      .select({ content: documentsTable.content })
      .from(documentsTable)
      .where(eq(documentsTable.id, documentId));
    return document[0]?.content ?? null;
  } catch (error) {
    console.error('Error fetching document content:', error);
    return null;
  }
}

export async function shareDocument(documentId: string, sharedWith: string[]) {
  // get current shared with and merge
  const currentSharedWith = await db
    .select({ sharedWith: documentsTable.sharedWith })
    .from(documentsTable)
    .where(eq(documentsTable.id, documentId));
  const mergedSharedWith = [...currentSharedWith[0]?.sharedWith, ...sharedWith];
  await db.update(documentsTable).set({ sharedWith: mergedSharedWith }).where(eq(documentsTable.id, documentId));
}

export async function deleteDocument(documentId: string) {
  await db.delete(documentsTable).where(eq(documentsTable.id, documentId));
}
