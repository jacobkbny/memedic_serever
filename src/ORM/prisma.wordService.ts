const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
 // 단어 등록
export async function insertWord(word, definition, example, username) {
    // Find the user with the given username
    const registrar = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  
    // If the user is not found, return an error message
    if (!registrar) {
      throw new Error('User not found');
    }
  
    // Insert word data into the database with pending status set to true
    const newWord = await prisma.word.create({
      data: {
        word: word,
        definition: definition,
        example: example,
        registrar: {
          connect: {
            id: registrar.id,
          },
        },
        pending: true,
      },
    });
  
    return newWord;
  }

 // 읽기  검색창에 단어를 검색하는 경우 
export async function fetchWordDetails(word:string) {
    // Fetch the word data from the database with pending set to false
    const wordDataArray = await prisma.word.findMany({
      where: {
        word: word,
        pending: false,
      },
      include: {
        registrar: true,
        likes: true,
      },
    });
  
    // If no matching word is found, return an error message
    if (wordDataArray.length === 0) {
      throw new Error('Word not found or pending approval');
    }
  
    // Iterate through the wordDataArray and process each wordData
    const wordDetailsArray = wordDataArray.map((wordData) => {
      // Count the number of likes (excluding dislikes)
      const numberOfLikes = wordData.likes.filter((like) => like.like).length;
  
      // Return the word, definition, example, username, registered_time, and the number of likes
      return {
        word: wordData.word,
        definition: wordData.definition,
        example: wordData.example,
        username: wordData.registrar.username,
        registered_time: wordData.registered_time,
        numberOfLikes: numberOfLikes,
      };
    });
  
    return wordDetailsArray;
  }

// 검색된 단어중 하나를 클릭하여 상세 보기를 원하는 경우
export async function fetchWordDetailsById(wordId:integer) {
    // Fetch the word data from the database based on the wordId
    const wordData = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
      include: {
        registrar: true,
        likes: true,
      },
    });
  
    // If no matching word is found, return an error message
    if (!wordData) {
      throw new Error('Word not found');
    }
  
    // Count the number of likes (excluding dislikes)
    const numberOfLikes = wordData.likes.filter((like) => like.like).length;
  
    // Return the word data, including word, definition, example, username, registered_time, and the number of likes
    return {
      id: wordData.id,
      word: wordData.word,
      definition: wordData.definition,
      example: wordData.example,
      pending: wordData.pending,
      username: wordData.registrar.username,
      registered_time: wordData.registered_time,
      numberOfLikes: numberOfLikes,
    };
  }

// 단어 삭제
export async function deleteWord(userId:integer, wordId:integer) {
    // Fetch the word details to check if the user is the one who registered the word
    const wordData = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
    });
  
    if (!wordData) {
      // If the word does not exist, return an error message
      throw new Error('Word not found');
    } else if (wordData.registrarId !== userId) {
      // If the user is not the one who registered the word, return an error message
      throw new Error('You do not have permission to delete this word');
    } else {
      // Begin a transaction
      const deleteWordTransaction = await prisma.$transaction([
        // Delete all likes/dislikes related to the word
        prisma.like.deleteMany({
          where: {
            wordId: wordId,
          },
        }),
        // Delete all bookmarks related to the word
        prisma.bookmark.deleteMany({
          where: {
            wordId: wordId,
          },
        }),
        // Delete the word with the given wordId
        prisma.word.delete({
          where: {
            id: wordId,
          },
        }),
      ]);
    }
  
    return { message: 'Word and all related data successfully deleted' };
  }

// 승인전 단어 불러오기
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
export async function approveWord(wordId:integer) {
  // Update the word's pending value to false
  const updatedWord = await prisma.word.update({
    where: {
      id: wordId,
    },
    data: {
      pending: false,
    },
  });

  return { message: 'Word successfully approved', word: updatedWord };
  }

// 단어 승인 거절로 인한 삭제
export async function deleteUnapprovedWord(wordId:integer) {
  // First, find the word with the given wordId
  const word = await prisma.word.findUnique({
    where: {
      id: wordId,
    },
  });

  // Check if the word is pending approval
  if (word && word.pending) {
    // Delete the word if it is not approved
    await prisma.word.delete({
      where: {
        id: wordId,
      },
    });

    return { message: 'Unapproved word successfully deleted', wordId: wordId };
  } else {
    // If the word is already approved or not found, return an error message
    return { message: 'Word not found or already approved', wordId: wordId };
  }
  }
// 7일간 단어를 뽑아온 후 좋아요 순으로 내림차순
export async function fetchPopularWordsFromLastWeek() {
  // Calculate the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch all words registered within the last 7 days
  const wordsFromLastWeek = await prisma.word.findMany({
    where: {
      registered_time: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      likes: true,
    },
  });

  // Calculate the total likes count for each word and sort them in descending order
  const popularWords = wordsFromLastWeek.map((word) => ({
    ...word,
    totalLikes: word.likes.filter((like) => like.like).length,
  })).sort((a, b) => b.totalLikes - a.totalLikes);

  return popularWords;
  }

// 내가(유저) 등록한 단어 불러오기
export async function fetchWordsByUser(userId:integer) {
  // Fetch all words registered by the user with the given userId
  const userWords = await prisma.word.findMany({
    where: {
      registrarId: userId,
    },
  });

  return userWords;
  }
