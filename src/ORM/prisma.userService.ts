const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// 유저 생성
export async function insertUserData(
    createUserRequest: CreateUserRequest,
  ): Promise<InsertUserResponse> {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: createUserRequest.username,
      },
    });
  
    if (existingUser) {
      return {
        success: false,
        message: 'Username is already taken',
      };
    }
  
    await prisma.user.create({
      data: {
        username: createUserRequest.username,
        email: createUserRequest.email,
      },
    });
  
    return {
      success: true,
    };
  }

// 닉네임 변경
export async function changeUsername(userId:integer, newUsername:string) {
    // Check if the new username already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        username: newUsername,
      },
    });
  
    if (existingUser) {
      // If the new username exists, return an error message
      throw new Error('The new username is already taken');
    } else {
      // Update the user's username with the new username
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: newUsername,
        },
      });
    }
  
    return { message: 'Username successfully updated' };
  }

// 유저 삭제
export async function deleteUser(userId:Integer) {
    // Begin a transaction
    const deleteUserTransaction = await prisma.$transaction([
      // Delete all the user's bookmarks
      prisma.bookmark.deleteMany({
        where: {
          userId: userId,
        },
      }),
      // Delete all the user's likes/dislikes
      prisma.like.deleteMany({
        where: {
          userId: userId,
        },
      }),
      // Delete all the words registered by the user
      prisma.word.deleteMany({
        where: {
          registrarId: userId,
        },
      }),
      // Delete the user
      prisma.user.delete({
        where: {
          id: userId,
        },
      }),
    ]);
  
    return { message: 'User and all related data successfully deleted' };
  }
