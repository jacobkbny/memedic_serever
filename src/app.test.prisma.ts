import { CreateUserRequest } from "./dtos/create_user_dto";
import { InsertUserResponse } from "./dtos/Insert_user_dto";

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
export async function insertUserData(createUserRequest: CreateUserRequest): Promise<InsertUserResponse> {
  const existingUser = await prisma.user.findUnique({
    where: {
      username: createUserRequest.username,
    },
  })

  if (existingUser) {
    console.log("existing user has called")
    return {
      success: false,
      message: 'Username is already taken',
    }
  }
   await prisma.user.create({
    data: {
      username: createUserRequest.username,
      email: createUserRequest.email,
    },
  })

  return {
    success: true,
  }
  }
  // insertUser('pkb');

export async function insertDefinition() {
    const newDefinition = await prisma.definition.create({
      data: {
        word: 'good',
        def: 'good means good',
        pending: true,
        username: 'pkb',
        examples: {
          create: [{ text: 'you look so good' }]
        },
      }
    });

    console.log("Finish newDefinition:",newDefinition);
  }

 export  async function getWordData(word) {
    const definitionData = await prisma.definition.findUnique({
      where: {
        word: word,
      },
      include: {
        examples: true,
        likes: true,
        user: true,
      },
    })
    // console.log("definitionData:",definitionData)
    if (!definitionData) {
      console.log(`Word ${word} not found.`)
      return null
    }
  
    const likes = definitionData.likes.reduce((total, like) => {
      if (like.like) {
        total += 1
      } else {
        total -= 1
      }
      return total
    }, 0)
    
    const wordResult = {
      word: definitionData.word,
      definition: definitionData.def,
      createdtime: definitionData.registered,
      updatedtime: definitionData.updatedAt,
      examples: definitionData.examples.map(example => example.text),
      likes: likes,
      pending: definitionData.pending,
      user: {
        username: definitionData.user.username,
        email: definitionData.user.email,
        registertime: definitionData.user.createdAt,
        updatedtime: definitionData.user.updatedAt,
      },
    }
    return wordResult
  }

  // getWordData('good')
  // .then(wordData => {
  //   console.log(wordData)
  // })
  // .catch(e => {
  //   console.error(e)
  //   process.exit(1)
  // })
  
  async function getPendingData() {
    const pendingData = await prisma.definition.findMany({
      where: {
        pending: true,
      },
      include: {
        examples: true,
        user: true,
      },
    })
    // console.log("pendingData:",pendingData)
    const result = pendingData.map(data => {
      const definitionResult = {
        word: data.word,
        definition: data.def,
        createdtime: data.registered,
        updatedtime: data.updatedAt,
        examples: data.examples.map(example => example.text),
        pending: data.pending,
        user: {
          username: data.user.username,
          email: data.user.email,
          registertime: data.user.createdAt,
          updatedtime: data.user.updatedAt,
        },
      }
  
      return definitionResult
    })
  
    return result
  }
  
  getPendingData()
    .then(pendingData => {
      console.log(pendingData)
    })
    .catch(e => {
      console.error(e)
      process.exit(1)
    })

// async function getWordData(word) {
//   const definitions = await prisma.definition.findMany({
//     where: { word: word },
//     include: {
//       user: true,
//       examples: true,
//       likes: {
//         where: { liked: true },
//         include: { user: true },
//       },
//     },
//   });

//   const netLikes = definitions.map((definition) => {
//     const likes = definition.likes.length;
//     const dislikes = definition.likes.filter((like) => !like.liked).length;
//     return {
//       ...definition,
//       likes: likes - dislikes,
//     };
//   });

//   console.log(netLikes);
// }

// getWordData('good');