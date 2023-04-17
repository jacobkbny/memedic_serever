import {
  InsertWordRequest,
  InsertWordResponse,
} from 'src/dtos/insert_word_dto';
import {
  SearchWordRequest,
  SearchWordResponse,
} from 'src/dtos/search__word_dto';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// 단어 등록
export async function insertWord(
  inserwordRequest: InsertWordRequest,
): Promise<InsertWordResponse> {
  const response = new InsertWordResponse();
  // Find the user with the given username
  const registrar = await prisma.user.findUnique({
    where: {
      username: inserwordRequest.registrar,
    },
  });

  // If the user is not found, return an error message
  if (!registrar) {
    response.result = false;
    return response;
  }

  // Insert word data into the database with pending status set to true
  await prisma.word.create({
    data: {
      word: inserwordRequest.word,
      definition: inserwordRequest.definition,
      example: inserwordRequest.example,
      registrar: {
        connect: {
          id: registrar.id,
        },
      },
      pending: true,
    },
  });
  response.result = true;
  return response;
}

// 읽기  검색창에 단어를 검색하는 경우
export async function fetchWordDetails(searchWordRequest: SearchWordRequest) {
  // Fetch the word data from the database with pending set to false
  const wordDataArray = await prisma.word.findMany({
    where: {
      word: searchWordRequest.word,
      pending: false,
    },
    include: {
      registrar: true,
      likes: true,
    },
  });

  // If no matching word is found, return an error message
  if (wordDataArray.length === 0) {
    return { result: false };
  }

  // Iterate through the wordDataArray and process each wordData
  const wordDetailsArray = wordDataArray.map((wordData) => {
    // Count the number of likes (excluding dislikes)
    const numberOfLikes = wordData.likes.filter((like) => like.like).length;

    // Return the word, definition, username, registered_time, and the number of likes
    console.log('wordData:', wordData);
    return {
      word: wordData.word,
      definition: wordData.definition,
      username: wordData.registrar.username,
      userid: wordData.registrar.id,
      registered_time: wordData.registered_time,
      numberOfLikes: numberOfLikes,
      wordId: wordData.id,
    };
  });

  return wordDetailsArray;
}

// 검색된 단어중 하나를 클릭하여 상세 보기를 원하는 경우
export async function fetchWordDetailsById(
  searchWordRequest: SearchWordRequest,
): Promise<SearchWordResponse> {
  // Fetch the word data from the database based on the wordId
  const response = new SearchWordResponse();
  const wordData = await prisma.word.findUnique({
    where: {
      id: searchWordRequest.wordId,
    },
    include: {
      registrar: true,
      likes: true,
    },
  });

  // If no matching word is found, return an error message
  if (!wordData) {
    response.result = false;
    return response;
  }

  // Count the number of likes (excluding dislikes)
  const numberOfLikes = wordData.likes.filter((like) => like.like).length;

  // Return the word data, including word, definition, example, username, registered_time, and the number of likes
  response.result = true;
  (response.wordId = wordData.id), (response.word = wordData.word);
  response.definition = wordData.definition;
  response.example = wordData.example;
  response.username = wordData.registrar.username;
  response.registerd_time = wordData.registerd_time;
  response.numberOfLikes = numberOfLikes;
  return response;
}

// 단어 삭제
export async function deleteWord(
  searchWordRequest: SearchWordRequest,
): Promise<SearchWordResponse> {
  const response = new SearchWordResponse();
  // Fetch the word details to check if the user is the one who registered the word
  const wordData = await prisma.word.findUnique({
    where: {
      id: searchWordRequest.wordId,
    },
  });

  if (!wordData) {
    // If the word does not exist, return an error message
    response.result = false;
    return response;
  } else if (wordData.registrarId !== searchWordRequest.registrarId) {
    // If the user is not the one who registered the word, return an error message
    response.result = false;
    return response;
  } else {
    // Begin a transaction
    await prisma.$transaction([
      // Delete all likes/dislikes related to the word
      prisma.like.deleteMany({
        where: {
          wordId: searchWordRequest.wordId,
        },
      }),
      // Delete all bookmarks related to the word
      prisma.bookmark.deleteMany({
        where: {
          wordId: searchWordRequest.wordId,
        },
      }),
      // Delete the word with the given wordId
      prisma.word.delete({
        where: {
          id: searchWordRequest.wordId,
        },
      }),
    ]);
  }
  response.result = true;
  return response;
}

// 승인전 단어들 불러오기
export async function fetchAllPendingWords() {
  // Fetch all words with pending set to true

  const pendingWords = await prisma.word.findMany({
    where: {
      pending: true,
    },
  });
  return pendingWords;
}

// 단어 승인
export async function approveWord(
  searchWordRequest: SearchWordRequest,
): Promise<SearchWordResponse> {
  // Update the word's pending value to false
  const response = new SearchWordResponse();
   await prisma.word.update({
    where: {
      id: searchWordRequest.wordId,
    },
    data: {
      pending: false,
    },
  });

  response.result = true;
  return response;
}

export async function approveAllPendingWords() {
  const kstDate = getCurrentKSTDate();
  const updatedWords = await prisma.word.updateMany({
    where: {
      pending: true,
    },
    data: {
      pending: false,
      registered_time: kstDate,
    },
  });

  return updatedWords;
}

// 단어 승인 거절로 인한 삭제
export async function deleteUnapprovedWord(
  searchWordRequest: SearchWordRequest,
): Promise<SearchWordResponse> {
  const response = new SearchWordResponse();
  // First, find the word with the given wordId
  const word = await prisma.word.findUnique({
    where: {
      id: searchWordRequest.wordId,
    },
  });

  // Check if the word is pending approval
  if (word && word.pending) {
    // Delete the word if it is not approved
    await prisma.word.delete({
      where: {
        id: searchWordRequest.wordId,
      },
    });
    response.result = true;
    return response;
    // return { message: 'Unapproved word successfully deleted', wordId: wordId };
  } else {
    // If the word is already approved or not found, return an error message
    response.result = false;
    // return { message: 'Word not found or already approved', wordId: wordId };
    return response;
  }
}
export async function fetchPopularWordsFromLastWeek() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const words = await prisma.word.findMany({
      where: {
        AND: [{ registered_time: { gte: oneWeekAgo } }, { pending: false }],
      },
      include: {
        likes: true,
      },
      orderBy: {
        likes: {
          _count: 'desc',
        },
      },
    });
    if (words.length == 0) {
      return { message: 'Word not found'}
    }

    const wordsWithTotalLikes = words.map((word) => {
      const likes = word.likes.filter((like) => like.like_status).length;
      const dislikes = word.likes.filter((like) => !like.like_status).length;
      const totalLikes = likes - dislikes;

      return {
        ...word,
        totalLikes,
      };
    });
    return wordsWithTotalLikes;
  } catch (error) {
    console.error('Error fetching popular words from last week:', error);
    throw error;
  }
}

// 내가(유저) 등록한 단어 불러오기
export async function fetchWordsByUser(searchWordRequest: SearchWordRequest) {
  // Fetch all words registered by the user with the given userId
  const userWords = await prisma.word.findMany({
    where: {
      registrarId: searchWordRequest.registrarId,
    },
  });

  return userWords;
}

function getCurrentKSTDate() {
  const currentDate = new Date();
  const offset = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
  return new Date(currentDate.getTime() + offset);
}
