import {
  UserExpressionRequest,
  UserExpressionResponse,
} from 'src/dtos/like__user_dto';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// 유저의 의사표현
export async function toggleLikeExpression(
  userExpressionRequest: UserExpressionRequest,
): Promise<UserExpressionResponse> {
  // Find the existing like record for the given wordId and userId
  const response = new UserExpressionResponse();
  const existingLike = await prisma.like.findUnique({
    where: {
      userId_wordId: {
        wordId: userExpressionRequest.wordId,
        userId: userExpressionRequest.userId,
      },
    },
  });

  // If there is no existing like record, create a new one with the given expression

  if (existingLike === null) {
    const newLike = await prisma.like.create({
      data: {
        like_status: userExpressionRequest.expression,
        wordId: userExpressionRequest.wordId,
        userId: userExpressionRequest.userId,
      },
    });

    response.expression = newLike.like_status;
    response.wordId = newLike.wordId;
    response.userId = newLike.userId;
    response.result = true;
    return response;
  }
  // If the existing like record has the same expression value, delete the record (revoke the expression)
  else if (existingLike.like_status === userExpressionRequest.expression) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    response.expression = undefined;
    response.result = true;
    return response;
  }

  // If the existing like record has a different expression value, update the record (user changed their mind)
  const updatedLike = await prisma.like.update({
    where: {
      id: existingLike.id,
    },
    data: {
      like_status: userExpressionRequest.expression,
    },
  });
  response.expression = userExpressionRequest.expression;
  response.result = true;
  return response;
}

// 내가(유저가) 좋아요 표시한 단어들 불러오기
export async function fetchLikedWordsByUser(
  userExpressionRequest: UserExpressionRequest,
) {
  // Fetch all likes created by the user with the given userId and where the like expression is true
  const userLikes = await prisma.like.findMany({
    where: {
      userId: userExpressionRequest.userId,
      like_status: true,
    },
    include: {
      word: true,
    },
  });

  // Extract the liked words from the userLikes array
  const likedWords = userLikes.map((like) => like.wordId);

  return likedWords;
}
