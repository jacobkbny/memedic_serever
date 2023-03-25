const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// export async function insertUser(username:String) {
//     const newUser = await prisma.user.create({
//       data: {
//         username: username,
//       },
//     });
  
//     console.log(newUser);
//   }
  
//   insertUser('pkb');
export async function insertDefinition() {
    const newDefinition = await prisma.definition.create({
      data: {
        word: 'good',
        def: 'good means good',
        pending: true,
        username: 'pkb',
      },
    });

    console.log("Finish newDefinition:",newDefinition);
  }
  

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