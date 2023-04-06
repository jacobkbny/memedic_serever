// import { create } from 'domain';
// import { CreateUserRequest } from './dtos/create_user_dto';
// import { DeleteWordDTO } from './dtos/delete_user_dto';
// import { InsertUserResponse } from './dtos/Insert_user_dto';
// import { WordResult } from './dtos/read_word_dto';

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// export async function insertUserData(
//   createUserRequest: CreateUserRequest,
// ): Promise<InsertUserResponse> {
//   const existingUser = await prisma.user.findUnique({
//     where: {
//       username: createUserRequest.username,
//     },
//   });

//   if (existingUser) {
//     return {
//       success: false,
//       message: 'Username is already taken',
//     };
//   }

//   await prisma.user.create({
//     data: {
//       username: createUserRequest.username,
//       email: createUserRequest.email,
//     },
//   });

//   return {
//     success: true,
//   };
// }
// export async function insertWord(word, definition, example, username) {
//   // Find the user with the given username
//   const registrar = await prisma.user.findUnique({
//     where: {
//       username: username,
//     },
//   });

//   // If the user is not found, return an error message
//   if (!registrar) {
//     throw new Error('User not found');
//   }

//   // Insert word data into the database with pending status set to true
//   const newWord = await prisma.word.create({
//     data: {
//       word: word,
//       definition: definition,
//       example: example,
//       registrar: {
//         connect: {
//           id: registrar.id,
//         },
//       },
//       pending: true,
//     },
//   });

//   return newWord;
// }

// export async function insertDefinition(
//   wordRequest: WordResult,
// ): Promise<boolean> {
//   const existingWord = await prisma.word.findUnique({
//     where: {
//       word: wordRequest.word,
//     },
//   });

//   if (existingWord) {
//     return false;
//   }

//   const newDefinition = await prisma.word.create({
//     data: {
//       word: wordRequest.word,
//       definition: wordRequest.def,
//       pending: true,
//       username: wordRequest.user.username,
//     },
//   });
//   await prisma.example.create({
//     data: { text: wordRequest.examples, def_id: newDefinition.id },
//   });

//   console.log('Finish newDefinition:', newDefinition);
//   return true;
// }
//  // when user wishes to search for specific word
// async function fetchWordDetails(word) {
//   // Fetch the word data from the database with pending set to false
//   const wordData = await prisma.word.findMany({
//     where: {
//       word: word,
//       pending: false,
//     },
//     include: {
//       registrar: true,
//       likes: true,
//     },
//   });

//   // If no matching word is found, return an error message
//   if (!wordData) {
//     throw new Error('Word not found or pending approval');
//   }

//   // Count the number of likes (excluding dislikes)
//   const numberOfLikes = wordData.likes.filter((like) => like.like).length;

//   // Return the word, definition, username, registered_time, and the number of likes
//   return {
//     word: wordData.word,
//     definition: wordData.definition,
//     username: wordData.registrar.username,
//     registered_time: wordData.registered_time,
//     numberOfLikes: numberOfLikes,
//   };
// }

// export async function getWordData(word: string) {
//   const definitionData = await prisma.word.findMany({
//     where: {
//       pending: false,
//     },
//     include: {
//       example: true,
//       likes: true,
//       user: true,
//     },
//   });
//   // console.log("definitionData:",definitionData)
//   if (definitionData.length == 0) {
//     console.log(`Word ${word} not found.`);
//     return null;
//   }

//   let likes = definitionData.likes;
//   if (likes != undefined) {
//     likes = definitionData.likes.reduce((total, like) => {
//       if (like.like) {
//         total += 1;
//       } else {
//         total -= 1;
//       }
//       return total;
//     }, 0);
//   } else {
//     likes = 0;
//   }
//   console.log('definitionData:', definitionData);
//   const wordResult = {
//     word: definitionData.word,
//     def: definitionData.def,
//     createdtime: definitionData.registered,
//     updatedtime: definitionData.updatedAt,
//     examples: definitionData.examples,
//     likes: likes,
//     pending: definitionData.pending,
//     user: {
//       username: definitionData.user.username,
//       email: definitionData.user.email,
//       registertime: definitionData.user.createdAt,
//       updatedtime: definitionData.user.updatedAt,
//     },
//   };
//   return wordResult;
// }

// // getWordData('good')
// // .then(wordData => {
// //   console.log(wordData)
// // })
// // .catch(e => {
// //   console.error(e)
// //   process.exit(1)
// // })
// export async function updateWordData(updateData: WordResult) {
//   const definition = await prisma.word.findUnique({
//     where: {
//       word: updateData.word,
//     },
//     include: {
//       user: true,
//     },
//   });

//   if (!definition) {
//     throw new Error(`Word ${updateData.word} not found`);
//   }

//   if (definition.user.username !== updateData.user.username) {
//     throw new Error(
//       `User ${updateData.user.username} is not authorized to update the word ${updateData.word}`,
//     );
//   }

//   const updatedDefinition = await prisma.word.update({
//     where: {
//       word: updateData.word,
//     },
//     data: {
//       definition: updateData.def,
//     },
//   });

//   return updatedDefinition;
// }

// export async function deleteWordData(
//   deleteWordDTO: DeleteWordDTO,
// ): Promise<boolean> {
//   // Find the word in the database
//   const existingWord = await prisma.word.findUnique({
//     where: { word: deleteWordDTO.word },
//     include: {
//       user: true,
//       examples: true,
//       likes: true,
//     },
//   });

//   // If the word doesn't exist, return false
//   if (!existingWord) {
//     return false;
//   }
//   if (existingWord.user.username !== deleteWordDTO.username) {
//     return false;
//   }
//   // Delete all related definitions, examples, and likes

//   await prisma.example.deleteMany({
//     where: { def_id: existingWord.id },
//   });

//   await prisma.like.deleteMany({
//     where: { def_id: existingWord.id },
//   });

//   await prisma.definition.deleteMany({
//     where: { id: existingWord.id },
//   });

//   // Return true to indicate success
//   return true;
// }

// export async function getPendingData() {
//   const pendingData = await prisma.word.findMany({
//     where: {
//       pending: true,
//     },
//     include: {
//       registrar: true,
//     },
//   });
//   // console.log("pendingData:",pendingData)
//   const result = pendingData.map((data) => {
//     const definitionResult = {
//       word: data.word,
//       definition: data.def,
//       createdtime: data.registered,
//       updatedtime: data.updatedAt,
//       example: data.example,
//       pending: data.pending,
//       user: {
//         username: data.registrar.username,
//         email: data.registrar.email,
//       },
//     };

//     return definitionResult;
//   });

//   return result;
// }

// getPendingData()
//   .then((pendingData) => {
//     console.log(pendingData);
//   })
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   });

// // async function getWordData(word) {
// //   const definitions = await prisma.definition.findMany({
// //     where: { word: word },
// //     include: {
// //       user: true,
// //       examples: true,
// //       likes: {
// //         where: { liked: true },
// //         include: { user: true },
// //       },
// //     },
// //   });

// //   const netLikes = definitions.map((definition) => {
// //     const likes = definition.likes.length;
// //     const dislikes = definition.likes.filter((like) => !like.liked).length;
// //     return {
// //       ...definition,
// //       likes: likes - dislikes,
// //     };
// //   });

// //   console.log(netLikes);
// // }

// // getWordData('good');

// async function addExampleToWord(
//   word: string,
//   example: string,
//   username: string,
// ): Promise<boolean> {
//   // Get the definition for the word and include the user who created it
//   const definition = await prisma.definition.findUnique({
//     where: { wordId_word: { wordId: word, word: word } },
//     include: { user: true },
//   });

//   // If the word doesn't exist, return false
//   if (!definition) {
//     return false;
//   }

//   // Check if the requesting user is the same as the user who created the word
//   if (definition.user.username !== username) {
//     return false;
//   }

//   // Add the example to the definition's examples array
//   await prisma.example.create({
//     data: { example: example, definitionId: definition.id },
//   });

//   return true;
// }
