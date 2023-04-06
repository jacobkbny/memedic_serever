import { BookmarkRequest, BookmarkResponse } from 'src/dtos/bookmark_word_dto';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// 북마크 생성
export async function bookmarkWord(
  bookmark: BookmarkRequest,
): Promise<BookmarkResponse> {
  // Check if the bookmark already exists in the database
  const response = new BookmarkResponse();
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_wordId: {
        userId: bookmark.userId,
        wordId: bookmark.wordId,
      },
    },
  });

  if (existingBookmark) {
    // If the bookmark already exists, return an error message
    response.result = false;
    return response;
  } else {
    // Create a new bookmark record with the given userId and wordId
    await prisma.bookmark.create({
      data: {
        userId: bookmark.userId,
        wordId: bookmark.wordId,
      },
    });
  }
  response.result = true;
  return response;
}

// 북마크 제거
export async function deleteBookmark(
  bookmark: BookmarkRequest,
): Promise<BookmarkResponse> {
  // Check if the bookmark exists in the database
  const response = new BookmarkResponse();
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_wordId: {
        userId: bookmark.userId,
        wordId: bookmark.wordId,
      },
    },
  });

  if (!existingBookmark) {
    // If the bookmark does not exist, return an error message
    response.result = false;
    return response;
  } else {
    // Delete the bookmark record with the given userId and wordId
    await prisma.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });
  }
  response.result = true;
  return response;
}

// 내가(유저가) 북마크 표시한 단어 불러오기
export async function fetchBookmarkedWordsByUser(bookmark: BookmarkRequest) {
  // Fetch all bookmarks created by the user with the given userId
  const userBookmarks = await prisma.bookmark.findMany({
    where: {
      userId: bookmark.userId,
    },
    include: {
      word: true,
    },
  });

  // Extract the bookmarked words from the userBookmarks array
  const bookmarkedWords = userBookmarks.map((bookmark) => bookmark.word);

  return bookmarkedWords;
}
