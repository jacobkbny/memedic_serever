const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
 // 삽입
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


