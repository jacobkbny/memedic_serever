const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// 유저의 의사표현
async function toggleLikeExpression(wordId:integer, userId:integer, expression:boolean) {
  // Find the existing like record for the given wordId and userId
  const existingLike = await prisma.like.findUnique({
    where: {
      wordId_userId: {
        wordId: wordId,
        userId: userId,
      },
    },
  });

  // If there is no existing like record, create a new one with the given expression
  if (!existingLike) {
    const newLike = await prisma.like.create({
      data: {
        like: expression,
        wordId: wordId,
        userId: userId,
      },
    });

    return { message: 'New like expression added', like: newLike };
  }

  // If the existing like record has the same expression value, delete the record (revoke the expression)
  if (existingLike.like === expression) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    return { message: 'Like expression revoked', likeId: existingLike.id };
  }

  // If the existing like record has a different expression value, update the record (user changed their mind)
  const updatedLike = await prisma.like.update({
    where: {
      id: existingLike.id,
    },
    data: {
      like: expression,
    },
  });

  return { message: 'Like expression updated', like: updatedLike };
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