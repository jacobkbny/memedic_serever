import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { BookmarkRequest } from './dtos/bookmark_word_dto';
import { CreateUserRequest } from './dtos/create_user_dto';
import { DeleteUserRequest } from './dtos/delete_user_dto';
import { InsertWordRequest } from './dtos/insert_word_dto';
import { UserExpressionRequest } from './dtos/like__user_dto';
import { ChangeUsernameRequest } from './dtos/modify_user_dto';
import { RequestHeader } from './dtos/request_header_dto';
import { SearchWordRequest } from './dtos/search__word_dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/ApproveAllForTest')
  ApproveAllForTest() {
    return this.appService.ApproveWords();
  }

  // 유저 생성 (JWT)
  @Post('/createUser')
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.appService.insertUser(createUserRequest);
  }

  // 닉네임 변경
  @Put('/changeUsername')
  changeUsername(@Body() changeUsernameRequest: ChangeUsernameRequest) {
    return this.appService.modifyUsername(changeUsernameRequest);
  }

  // 유저 정보 불러오기
  @Get('/getUserInfo')
  getUserInfo(@Query('email') email: string) {
    return this.appService.getUserInfo(email);
  }
  // 유저 삭제
  @Delete('/deleteUser')
  deleteUser(@Query('userid') userid: string) {
    const deleteUserReqeust: DeleteUserRequest = new DeleteUserRequest();
    deleteUserReqeust.userid = parseInt(userid);
    return this.appService.deleteUser(deleteUserReqeust);
  }
  // 단어 등록

  @Post('/registerword')
  registerWord(@Body() insertWordRequest: InsertWordRequest) {
    return this.appService.registerWord(insertWordRequest);
  }

  // 승인전 단어들 불러오기

  @Get('/getallpending')
  getPendingWord() {
    return this.appService.getPendingWords();
  }
  // 검색창에 단어를 검색하는 경우
  @Get('/searchword')
  searchWord(@Query('word') word: string) {
    const searchWordRequest: SearchWordRequest = new SearchWordRequest();
    searchWordRequest.word = word;
    return this.appService.getWord(searchWordRequest);
  }
  // 검색된 단어중 하나를 클릭하여 상세 보기를 원하는 경우
  @Get('/getword')
  getword(@Query('wordid') wordid: string) {
    const searchwordRequest: SearchWordRequest = new SearchWordRequest();
    searchwordRequest.wordId = parseInt(wordid);
    return this.appService.getWordDetail(searchwordRequest);
  }
  // 홈 피드 단어 불러오기
  @Get('/getHomeFeed')
  getHomeFeed() {
    return this.appService.getHomeFeeds();
  }
  // 단어 승인
  @Put('/approval')
  approval(@Query('wordid') wordid: string) {
    const searchwordRequest: SearchWordRequest = new SearchWordRequest();
    searchwordRequest.wordId = parseInt(wordid);
    return this.appService.approval(searchwordRequest);
  }
  // 단어 승인 거절로 인한 삭제
  @Delete('/removebydenial')
  removeByDenial(@Query('wordid') wordid: string) {
    const searchwordRequest: SearchWordRequest = new SearchWordRequest();
    searchwordRequest.wordId = parseInt(wordid);
    return this.appService.deleteByDenial(searchwordRequest);
  }
  // 내가(유저) 등록한 단어 불러오기

  @Get('/getwordbyuser')
  getwordByUser(@Query('registrarId') registrarId: string) {
    const searchwordRequest: SearchWordRequest = new SearchWordRequest();
    searchwordRequest.registrarId = parseInt(registrarId);
    return this.appService.getWordByUser(searchwordRequest);
  }

  // 단어 삭제
  @Delete('/deleteword')
  deleteWord(@Query('wordid') wordid: string) {
    const searchWordRequest: SearchWordRequest = new SearchWordRequest();
    searchWordRequest.wordId = parseInt(wordid);
    return this.appService.deleteWord(searchWordRequest);
  }
  // 유저의 의사표현
  @Post('/expression')
  expression(@Body() userExpressionRequest: UserExpressionRequest) {
    return this.appService.userExpression(userExpressionRequest);
  }
  //내가(유저가) 좋아요한 단어 불러오기

  @Get('/fetchexpression')
  fetchexpression(@Query('userid') userid: string) {
    const userExpressionReqeust: UserExpressionRequest =
      new UserExpressionRequest();
    userExpressionReqeust.userId = parseInt(userid);
    return this.appService.getWordbyUserExpression(userExpressionReqeust);
  }
  // create bookmark

  @Post('/bookmarkword')
  bookmarkWord(@Body() bookmarkReqeust: BookmarkRequest) {
    return this.appService.addBookMark(bookmarkReqeust);
  }
  // delete bookmark

  @Delete('/removebookmark')
  removeBookmark(
    @Query('userid') userid: string,
    @Query('wordid') wordid: string,
  ) {
    const bookmarkReqeust: BookmarkRequest = new BookmarkRequest();
    bookmarkReqeust.userId = parseInt(userid);
    bookmarkReqeust.wordId = parseInt(wordid);
    return this.appService.removeBookMark(bookmarkReqeust);
  }
  @Get('/getbookmarkofuser')
  getBookmarkOfUser(@Query('userid') userid: string) {
    const bookmarkReqeust: BookmarkRequest = new BookmarkRequest();
    bookmarkReqeust.userId = parseInt(userid);
    return this.appService.getAllBookmarkedWordsByUser(bookmarkReqeust);
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
