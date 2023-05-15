import { userInfo } from 'os';
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
      username: createUserRequest.userName,
    },
  });
  if (existenceByUsername) {
    response.result = false;
    response.message = "닉네임 중복"
    return response;
  }

  // const existenceByEmail = await prisma.user.findUnique({
  //   where: {
  //     email: createUserRequest.email,
  //   },
  // });

  // if (existenceByEmail) {
  //   response.result = false;
  //   response.message = "이메일 중복"
  //   return response;
  // }

  const result = await prisma.user.create({
    data: {
      username: createUserRequest.userName,
      email: createUserRequest.email,
      loginMethod: createUserRequest.loginMethod
    },
  });

  response.result = true;
  response.message = "가입 완료"
  response.userId = result.id;
  response.userName = result.username;
  response.createdAt = result.created_at
  return response;
}

// 로그인

// 닉네임 변경
export async function changeUsername(
  changeUsernameRequest: ChangeUsernameRequest,
): Promise<ChangeUserNameResponse> {
  // Check if the new username already exists in the database
  const response = new ChangeUserNameResponse();
  const existingUser = await prisma.user.findUnique({
    where: {
      username: changeUsernameRequest.newUserName,
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
        id: changeUsernameRequest.userId,
      },
      data: {
        username: changeUsernameRequest.newUserName,
      },
    });
  }
  response.result = true;
  return response;
}
export async function getUserInfoByEmail(email : string): Promise<InsertUserResponse>{
  const response = new InsertUserResponse();
  const userInfo = await prisma.user.findUnique({
    where:{
      email: email,
    }
  })
  if (userInfo == null) {
    response.result = false;
    response.message = "User not found"
    return response
  }

  response.result = true;
  response.userId = userInfo.id;
  response.userName = userInfo.username;
  response.createdAt = userInfo.created_at;

  return response
}


// 유저 삭제
export async function deleteUser(
  deleteUserRequest: DeleteUserRequest,
): Promise<DeleteUserResponse> {
  const response = new DeleteUserResponse();
  // Begin a transaction
  const userInfo = await prisma.user.findUnique({
    where:{
      id:deleteUserRequest.userId
    }
  })
  
  if(userInfo == null){
    response.result = false;
  } 

  await prisma.$transaction([
    // Delete all the user's bookmarks
    prisma.bookmark.deleteMany({
      where: {
        userId: deleteUserRequest.userId,
      },
    }),
    // Delete all the user's likes/dislikes
    prisma.like.deleteMany({
      where: {
        userId: deleteUserRequest.userId,
      },
    }),
    // Delete all the words registered by the user
    prisma.word.deleteMany({
      where: {
        registrarId: deleteUserRequest.userId,
      },
    }),
    // Delete the user
    prisma.user.delete({
      where: {
        id: deleteUserRequest.userId,
      },
    }),
  ]);

  response.result = true;
  return response;
}

export async function fetchAllUserInfo(){
  const allUsers = await prisma.user.findMany();

  const UserInfos : CreateUserRequest[] = []

  for (let i =0 ; i<allUsers.length; i++) {
    UserInfos[i] = new CreateUserRequest()
    UserInfos[i].id = allUsers[i].id
    UserInfos[i].userName = allUsers[i].username
    UserInfos[i].email = allUsers[i].email
    UserInfos[i].createdAt = allUsers[i].created_at
    UserInfos[i].loginMethod = allUsers[i].loginMethod
  }
  return UserInfos

}
