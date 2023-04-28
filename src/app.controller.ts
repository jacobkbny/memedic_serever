import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { BookmarkRequest } from './dtos/bookmark_word_dto';
import { ChangeUserNameResponse } from './dtos/changeUsername_response_dto';
import { CreateUserRequest } from './dtos/create_user_dto';
import { DeleteUserRequest, DeleteUserResponse } from './dtos/delete_user_dto';
import { InsertUserResponse } from './dtos/Insert_user_dto';
import { InsertWordRequest, InsertWordResponse } from './dtos/insert_word_dto';
import { UserExpressionRequest } from './dtos/like__user_dto';
import { ChangeUsernameRequest } from './dtos/modify_user_dto';
import { RequestHeader } from './dtos/request_header_dto';
import { SearchWordRequest, SearchWordResponse } from './dtos/search__word_dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/ApproveAllForTest')
  ApproveAllForTest() {
    return this.appService.ApproveWords();
  }

  // 유저 생성 (JWT)
  @Post('/createUser')
  async createUser(
    @Res() res: Response,
    @Body() createUserRequest: CreateUserRequest,
  ) {
    const insertUserResponse: InsertUserResponse =
      await this.appService.insertUser(createUserRequest);
    if (
      insertUserResponse.message === '닉네임 중복' ||
      insertUserResponse.message === '이메일 중복'
    ) {
      res.status(409).json(insertUserResponse);
    } else {
      res.status(201).json(insertUserResponse);
    }
  }

  // 닉네임 변경
  @Put('/changeUsername')
  async changeUsername(
    @Res() res: Response,
    @Body() changeUsernameRequest: ChangeUsernameRequest,
  ) {
    const changeUserNameResponse: ChangeUserNameResponse =
      await this.appService.modifyUsername(changeUsernameRequest);
    if (changeUserNameResponse.result === false) {
      res.status(409).json(changeUserNameResponse);
    } else {
      res.status(200).json(changeUserNameResponse);
    }
  }

  // 유저 정보 불러오기
  @Get('/getUserInfo')
  async getUserInfo(@Res() res: Response, @Query('email') email: string) {
    const insertUserResponse: InsertUserResponse =
      await this.appService.getUserInfo(email);
    if (insertUserResponse.result === false) {
      res.status(404).json(insertUserResponse);
    } else {
      res.status(200).json(insertUserResponse);
    }
  }
  // 유저 삭제
  @Delete('/deleteUser')
  async deleteUser(@Res() res: Response, @Query('userId') userid: string) {
    const deleteUserReqeust: DeleteUserRequest = new DeleteUserRequest();
    deleteUserReqeust.userId = parseInt(userid);
    const deleteUserResponse: DeleteUserResponse =
      await this.appService.deleteUser(deleteUserReqeust);
    if (deleteUserResponse.result === false) {
      res.status(404).json(deleteUserResponse);
    } else {
      res.status(202).json(deleteUserResponse);
    }
  }
  // 단어 등록

  @Post('/registerWord')
  async registerWord(
    @Res() res: Response,
    @Body() insertWordRequest: InsertWordRequest,
  ) {
    const insertWordResponse: InsertWordResponse =
      await this.appService.registerWord(insertWordRequest);
    if (insertWordResponse.result === false) {
      res.status(404).json(insertWordResponse);
    } else {
      res.status(201).json(insertWordResponse);
    }
  }

  // 승인전 단어들 불러오기
  @Get('/getAllPending')
  async getPendingWord(@Res() res: Response) {
    const result = await this.appService.getPendingWords();
    if (result.result === false) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  }
  // 검색창에 단어를 검색하는 경우
  @Get('/searchWord')
  async searchWord(@Res() res: Response, @Query('word') word: string) {
    const searchWordRequest: SearchWordRequest = new SearchWordRequest();
    searchWordRequest.word = word;
    const result = await this.appService.getWord(searchWordRequest);
    if (result.result == false) {
      res.status(404).json(result);
    } else {
      res.status(200).json(result);
    }
  }
  // 검색된 단어중 하나를 클릭하여 상세 보기를 원하는 경우
  @Get('/getword')
  async getword(@Res() res: Response, @Query('wordId') wordid: string) {
    const searchwordRequest: SearchWordRequest = new SearchWordRequest();
    searchwordRequest.wordId = parseInt(wordid);
    const searchWordResponse: SearchWordResponse =
      await this.appService.getWordDetail(searchwordRequest);
    if (searchWordResponse.result === false) {
      res.status(404).json(searchWordResponse);
    } else {
      res.status(200).json(searchWordResponse);
    }
  }
  // 홈 피드 단어 불러오기
  @Get('/getHomeFeed')
  async getHomeFeed() {
    return this.appService.getHomeFeeds();
  }
  // 단어 승인
  @Put('/approval')
  async approval(
    @Res() res: Response,
    @Body() searchwordRequest: SearchWordRequest,
  ) {
    const searchWordResponse: SearchWordResponse =
      await this.appService.getWordDetail(searchwordRequest);
    if (searchWordResponse.result === false) {
      res.status(404).json(searchWordResponse);
    } else {
      res.status(200).json(searchWordResponse);
    }
    return this.appService.approval(searchwordRequest);
  }
  // 단어 승인 거절로 인한 삭제
  @Delete('/removeByDenial')
  async removeByDenial(@Res() res: Response, @Query('wordId') wordid: string) {
    const searchwordRequest: SearchWordRequest = new SearchWordRequest();
    searchwordRequest.wordId = parseInt(wordid);
    const searchWordResponse: SearchWordResponse =
      await this.appService.deleteByDenial(searchwordRequest);
    if (searchWordResponse.result === false) {
      res.status(404).json(searchWordResponse);
    } else {
      res.status(200).json(searchWordResponse);
    }
  }
  // 내가(유저) 등록한 단어 불러오기

  @Get('/getWordByUser')
  async getwordByUser(
    @Res() res: Response,
    @Query('userId') registrarId: string,
  ) {
    const searchwordRequest: SearchWordRequest = new SearchWordRequest();
    searchwordRequest.registrarId = parseInt(registrarId);
    const searchWordResponse = await this.appService.getWordByUser(
      searchwordRequest,
    );
    if (searchWordResponse.result === false) {
      res.status(404).json(searchWordResponse);
    } else {
      res.status(200).json(searchWordResponse);
    }
  }

  // 단어 삭제
  @Delete('/deleteWord')
  async deleteWord(
    @Res() res: Response,
    @Query('wordId') wordid: string,
    @Query('registrarId') registrarId: string,
  ) {
    const searchWordRequest: SearchWordRequest = new SearchWordRequest();
    searchWordRequest.wordId = parseInt(wordid);
    searchWordRequest.registrarId = parseInt(registrarId);
    const searchWordResponse: SearchWordResponse =
      await this.appService.deleteWord(searchWordRequest);
    if (
      searchWordResponse.result === false &&
      searchWordResponse.message === '단어를 찾을 수 없음'
    ) {
      res.status(404).json(searchWordResponse);
    } else if (
      searchWordResponse.result === false &&
      searchWordResponse.message === '작성자 아님'
    ) {
      res.status(400).json(searchWordResponse);
    } else {
      res.status(202).json(searchWordResponse);
    }
  }
  // 유저의 의사표현
  @Post('/expression')
  async expression(
    @Res() res: Response,
    @Body() userExpressionRequest: UserExpressionRequest,
  ) {
    if (hasNonNullValues(userExpressionRequest)) {
      res.status(400);
      return;
    } 
    const userExpressionResponse = await this.appService.userExpression(userExpressionRequest)
    res.status(202).json(userExpressionResponse);
  }
  //내가(유저가) 좋아요한 단어 불러오기
  @Get('/fetchExpression')
  async fetchexpression(@Res() res: Response, @Query('userId') userid: string) {
    const userExpressionReqeust: UserExpressionRequest =
      new UserExpressionRequest();
    userExpressionReqeust.userId = parseInt(userid);
    const result = await this.appService.getWordbyUserExpression(
      userExpressionReqeust,
    );
    if (result.wordIds.length == 0) {
      const response = { result: false, message: '좋아요 표시한 단어 없음' };
      res.status(404).json(response);
    } else {
      res.status(200).json(result);
    }
  }
  // create bookmark
  @Post('/bookMarkWord')
  async bookmarkWord(
    @Res() res: Response,
    @Body() bookmarkReqeust: BookmarkRequest,
  ) {
    const bookMarkResponse = await this.appService.addBookMark(bookmarkReqeust);
    if (bookMarkResponse.result == false) {
      res.status(409).json(bookMarkResponse);
    } else {
      res.status(201).json(bookMarkResponse);
    }
  }
  // delete bookmark
  @Delete('/removeBookMark')
  async removeBookmark(
    @Res() res: Response,
    @Query('userId') userid: string,
    @Query('wordId') wordid: string,
  ) {
    const bookmarkReqeust: BookmarkRequest = new BookmarkRequest();
    bookmarkReqeust.userId = parseInt(userid);
    bookmarkReqeust.wordId = parseInt(wordid);
    const bookMarkResponse = await this.appService.removeBookMark(
      bookmarkReqeust,
    );
    if (bookMarkResponse.result == false) {
      res.status(404).json(bookmarkReqeust);
    } else {
      res.status(202).json(bookMarkResponse);
    }
  }
  @Get('/getBookMarkOfUser')
  async getBookmarkOfUser(
    @Res() res: Response,
    @Query('userId') userid: string,
  ) {
    const bookmarkReqeust: BookmarkRequest = new BookmarkRequest();
    bookmarkReqeust.userId = parseInt(userid);
    const result = await this.appService.getAllBookmarkedWordsByUser(
      bookmarkReqeust,
    );
    if (result.length == 0) {
      const response = { result: false, message: '북마크 표시한 단어 없음' };
      res.status(404).json(response);
    } else {
      res.status(200).json(result);
    }
  }
}

function CheckHeader(header: RequestHeader) {
  if (header.ApiKey !== process.env.Api_Key) {
    return false;
  }
  if (header.secretKey !== process.env.Secret_Key) {
    return false;
  }
  return true;
}
function hasNonNullValues(obj: any): boolean {
  return Object.values(obj).some((value) => value === null);
}
