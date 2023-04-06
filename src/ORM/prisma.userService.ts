import { ChangeUserNameResponse } from 'src/dtos/changeUsername_response_dto';
import { CreateUserRequest } from 'src/dtos/create_user_dto';
import {
  DeleteUserRequest,
  DeleteUserResponse,
} from 'src/dtos/delete_user_dto';
import { InsertUserResponse } from 'src/dtos/Insert_user_dto';
import { ChangeUsernameRequest } from 'src/dtos/modify_user_dto';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// 유저 생성
export async function insertUserData(
  createUserRequest: CreateUserRequest,
): Promise<InsertUserResponse> {
  const response = new InsertUserResponse();
  const existenceByUsername = await prisma.user.findUnique({
    where: {
      username: createUserRequest.username,
    },
  });
  if (existenceByUsername) {
    response.success = false;
    return response;
  }

  const existenceByEmail = await prisma.user.findUnique({
    where: {
      email: createUserRequest.email,
    },
  });
  if (existenceByEmail) {
    response.success = false;
    return response;
  }

  await prisma.user.create({
    data: {
      username: createUserRequest.username,
      email: createUserRequest.email,
    },
  });

  response.success = true;
  return response;
}

// 닉네임 변경
export async function changeUsername(
  changeUsernameRequest: ChangeUsernameRequest,
): Promise<ChangeUserNameResponse> {
  // Check if the new username already exists in the database
  const response = new ChangeUserNameResponse();
  const existingUser = await prisma.user.findUnique({
    where: {
      username: changeUsernameRequest.newUsername,
    },
  });

  if (existingUser) {
    // If the new username exists, return an error message
    response.result = false;
    return response;
  } else {
    // Update the user's username with the new username
    await prisma.user.update({
      where: {
        id: changeUsernameRequest.userid,
      },
      data: {
        username: changeUsernameRequest.newUsername,
      },
    });
  }
  response.result = true;
  return response;
}

// 유저 삭제
export async function deleteUser(
  deleteUserRequest: DeleteUserRequest,
): Promise<DeleteUserResponse> {
  const response = new DeleteUserResponse();
  // Begin a transaction
  await prisma.$transaction([
    // Delete all the user's bookmarks
    prisma.bookmark.deleteMany({
      where: {
        userId: deleteUserRequest.userid,
      },
    }),
    // Delete all the user's likes/dislikes
    prisma.like.deleteMany({
      where: {
        userId: deleteUserRequest.userid,
      },
    }),
    // Delete all the words registered by the user
    prisma.word.deleteMany({
      where: {
        registrarId: deleteUserRequest.userid,
      },
    }),
    // Delete the user
    prisma.user.delete({
      where: {
        id: deleteUserRequest.userid,
      },
    }),
  ]);

  response.result = true;
  return response;
}
