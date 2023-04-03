const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// 유저의 의사표현
export async function registerLikeDislike(userId:integer, wordId:integer, expression:boolean) {
    // Check if the like/dislike already exists in the database
    const existingLikeDislike = await prisma.like.findUnique({
      where: {
        userId_wordId: {
          userId: userId,
          wordId: wordId,
        },
      },
    });
  
    if (existingLikeDislike) {
      // Update the existing like/dislike record with the new expression
      await prisma.like.update({
        where: {
          id: existingLikeDislike.id,
        },
        data: {
          like: expression,
        },
      });
    } else {
      // Create a new like/dislike record with the given userId, wordId, and expression
      await prisma.like.create({
        data: {
          like: expression,
          userId: userId,
          wordId: wordId,
        },
      });
    }
  
    return { message: `User ${expression ? 'liked' : 'disliked'} the word successfully` };
  }
  
 // 의사표현 취소 
export async function revokeLikeDislike(userId:integer, wordId:integer, expression:boolean) {
    // Check if the like/dislike record exists in the database
    const existingLikeDislike = await prisma.like.findUnique({
      where: {
        userId_wordId: {
          userId: userId,
          wordId: wordId,
        },
      },
    });
  
    if (!existingLikeDislike) {
      // If the like/dislike record does not exist, return an error message
      throw new Error('Like/dislike record not found');
    } else if (existingLikeDislike.like !== expression) {
      // If the expression value does not match the database value, return an error message
      throw new Error('The provided expression does not match the existing like/dislike record');
    } else {
      // Delete the like/dislike record with the given userId and wordId
      await prisma.like.delete({
        where: {
          id: existingLikeDislike.id,
        },
      });
    }
  
    return { message: 'Like/dislike action successfully revoked' };
  }

// 내가(유저가) 좋아요 표시한 단어들 불러오기
export async function fetchLikedWordsByUser(userId:integer) {
  // Fetch all likes created by the user with the given userId and where the like expression is true
  const userLikes = await prisma.like.findMany({
    where: {
      userId: userId,
      like: true,
    },
    include: {
      word: true,
    },
  });

  // Extract the liked words from the userLikes array
  const likedWords = userLikes.map((like) => like.word);

  return likedWords;
}