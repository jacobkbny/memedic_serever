const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// 북마크 생성
export async function bookmarkWord(userId:integer, wordId:integer) {
    // Check if the bookmark already exists in the database
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_wordId: {
          userId: userId,
          wordId: wordId,
        },
      },
    });
  
    if (existingBookmark) {
      // If the bookmark already exists, return an error message
      throw new Error('The word is already bookmarked by this user');
    } else {
      // Create a new bookmark record with the given userId and wordId
      await prisma.bookmark.create({
        data: {
          userId: userId,
          wordId: wordId,
        },
      });
    }
  
    return { message: 'Word successfully bookmarked' };
  }

  // 북마크 제거
export async function removeBookmark(userId:integer, wordId:integer) {
    // Check if the bookmark exists in the database
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_wordId: {
          userId: userId,
          wordId: wordId,
        },
      },
    });
  
    if (!existingBookmark) {
      // If the bookmark does not exist, return an error message
      throw new Error('Bookmark not found');
    } else {
      // Delete the bookmark record with the given userId and wordId
      await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });
    }
  
    return { message: 'Bookmark successfully removed' };
  }