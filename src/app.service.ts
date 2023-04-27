import { Injectable } from '@nestjs/common';

import {
  insertUserData,
  changeUsername,
  deleteUser,
  getUserInfoByEmail,
} from './ORM/prisma.userService';
import { CreateUserRequest } from './dtos/create_user_dto';
import { DeleteUserRequest, DeleteUserResponse } from './dtos/delete_user_dto';
import { InsertUserResponse } from './dtos/Insert_user_dto';
import { ChangeUsernameRequest } from './dtos/modify_user_dto';
import { ChangeUserNameResponse } from './dtos/changeUsername_response_dto';
import { InsertWordRequest, InsertWordResponse } from './dtos/insert_word_dto';
import {
  approveAllPendingWords,
  approveWord,
  deleteUnapprovedWord,
  deleteWord,
  fetchAllPendingWords,
  fetchPopularWordsFromLastWeek,
  fetchWordDetails,
  fetchWordDetailsById,
  fetchWordsByUser,
  insertWord,
} from './ORM/prisma.wordService';
import { SearchWordRequest, SearchWordResponse } from './dtos/search__word_dto';
import {
  UserExpressionRequest,
  UserExpressionResponse,
} from './dtos/like__user_dto';
import {
  fetchLikedWordsByUser,
  toggleLikeExpression,
} from './ORM/prisma.LikeService';
import {
  bookmarkWord,
  deleteBookmark,
  fetchBookmarkedWordsByUser,
} from './ORM/prisma.bookmarkService';
import { BookmarkRequest } from './dtos/bookmark_word_dto';
@Injectable()
export class AppService {
  /*
  async login(user: Auth) {
    const payload = { username: user.username, sub: user.userid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
   */
  // jwt 토큰 생성
  // 유저 등록
  async insertUser(createUserRequest: CreateUserRequest) {
    const response: InsertUserResponse = await insertUserData(
      createUserRequest,
    );
    return response;
  }
  // 닉네임 변경
  async modifyUsername(changeUsernameRequest: ChangeUsernameRequest) {
    const response: ChangeUserNameResponse = await changeUsername(
      changeUsernameRequest,
    );
    return response;
  }
  async getUserInfo(email: string) {
    const response: InsertUserResponse = await getUserInfoByEmail(email);
    return response;
  }
  // 유저 삭제
  async deleteUser(deleteUserRequest: DeleteUserRequest) {
    const response: DeleteUserResponse = await deleteUser(deleteUserRequest);
    return response;
  }
  // 단어 등록
  async registerWord(InsertWordRequest: InsertWordRequest) {
    const response: InsertWordResponse = await insertWord(InsertWordRequest);
    return response;
  }
  async ApproveWords() {
    const response = await approveAllPendingWords();
    return response;
  }
  // 검색창에 단어를 검색하는 경우
  async getWord(
    searchWordRequest: SearchWordRequest,
  )  {
    const response = await fetchWordDetails(
      searchWordRequest,
    );
    return response;
  }
  // 검색된 단어중 하나를 클릭하여 상세 보기를 원하는 경우
  async getWordDetail(searchWordRequest: SearchWordRequest) {
    const response: SearchWordResponse = await fetchWordDetailsById(
      searchWordRequest,
    );
    return response;
  }
  // 홈 피드 단어 불러오기
  async getHomeFeeds() {
    const response = await fetchPopularWordsFromLastWeek();
    return response;
  }
  // 승인 전 단어 불러오기
  async getPendingWords() {
    const response = await fetchAllPendingWords();
    return response;
  }
  async approval(searchWordRequest: SearchWordRequest) {
    const response: SearchWordResponse = await approveWord(searchWordRequest);
    return response;
  }
  // 단어 삭제
  async deleteWord(searchWordRequest: SearchWordRequest) {
    const response = deleteWord(searchWordRequest);
    return response;
  }
  // 승인 거절로 인한 단어 삭제
  async deleteByDenial(searchWordRequest: SearchWordRequest) {
    const response = deleteUnapprovedWord(searchWordRequest);
    return response;
  }
  async getWordByUser(searchWordRequest: SearchWordRequest) {
    const response = await fetchWordsByUser(searchWordRequest);
    return response;
  }

  // 유저의 의사 표현
  async userExpression(userExpression: UserExpressionRequest) {
    const response: UserExpressionResponse = await toggleLikeExpression(
      userExpression,
    );
    return response;
  }
  //내가(유저가) 좋아요한 단어 불러오기
  async getWordbyUserExpression(userExpression: UserExpressionRequest) {
    const response = await fetchLikedWordsByUser(userExpression);
    return response;
  }
  // add BookMark
  async addBookMark(bookmark: BookmarkRequest) {
    const response = await bookmarkWord(bookmark);
    return response;
  }
  // delete Bookmark
  async removeBookMark(bookmark: BookmarkRequest) {
    const response = await deleteBookmark(bookmark);
    return response;
  }
  // fetch all the bookmarked word by users
  async getAllBookmarkedWordsByUser(bookmark: BookmarkRequest) {
    const response = await fetchBookmarkedWordsByUser(bookmark);
    return response;
  }
}
