const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
 