import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
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
import { AuthGuard } from '@nestjs/passport';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 유저 생성 (session || JWT)
  @Post('/createUser')
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.appService.insertUser(createUserRequest);
  }
  // 닉네임 변경
  @UseGuards(AuthGuard('jwt'))
  @Put('/changeUsername')
  changeUsername(@Body() changeUsernameRequest: ChangeUsernameRequest) {
    return this.appService.modifyUsername(changeUsernameRequest);
  }
  // 유저 삭제
  @Delete('/deleteUser')
  deleteUser(@Body() deleteUserRequest: DeleteUserRequest) {
    return this.appService.deleteUser(deleteUserRequest);
  }
  // 단어 등록
  @UseGuards(AuthGuard('jwt'))
  @Post('/registerword')
  registerWord(@Body() insertWordRequest: InsertWordRequest) {
    return this.appService.registerWord(insertWordRequest);
  }

  // 승인전 단어들 불러오기
  @UseGuards(AuthGuard('jwt'))
  @Get('/getallpending')
  getPendingWord() {
    return this.appService.getPendingWords();
  }
  // 검색창에 단어를 검색하는 경우
  @Get('/searchword')
  searchWord(@Body() searchWordRequest: SearchWordRequest) {
    return this.appService.getWord(searchWordRequest);
  }
  // 검색된 단어중 하나를 클릭하여 상세 보기를 원하는 경우
  @Get('/getword')
  getword(@Body() searchWordRequest: SearchWordRequest) {
    return this.appService.getWordDetail(searchWordRequest);
  }
  // 홈 피드 단어 불러오기
  @Get('/getHomeFeed')
  getHomeFeed() {
    return this.appService.getHomeFeeds();
  }
  // 단어 승인
  @Put('/approval')
  approval(@Body() searchWordRequest: SearchWordRequest) {
    return this.appService.approval(searchWordRequest);
  }
  // 단어 승인 거절로 인한 삭제
  @Delete('/removebydenial')
  removeByDenial(@Body() searchWordRequest: SearchWordRequest) {
    return this.appService.deleteByDenial(searchWordRequest);
  }
  // 내가(유저) 등록한 단어 불러오기
  @UseGuards(AuthGuard('jwt'))
  @Get('/getwordbyuser')
  getwordByUser(@Body() searchWordRequest: SearchWordRequest) {
    return this.appService.getWordByUser(searchWordRequest);
  }

  // 단어 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('/deleteword')
  deleteWord(@Body() searchWordRequest: SearchWordRequest) {
    return this.appService.deleteWord(searchWordRequest);
  }
  // 유저의 의사표현
  @UseGuards(AuthGuard('jwt'))
  @Post('/expression')
  expression(@Body() userExpressionRequest: UserExpressionRequest) {
    return this.appService.userExpression(userExpressionRequest);
  }
  //내가(유저가) 좋아요한 단어 불러오기
  @UseGuards(AuthGuard('jwt'))
  @Get('/fetchexpression')
  fetchexpression(@Body() userExpressionReqeust: UserExpressionRequest) {
    return this.appService.getWordbyUserExpression(userExpressionReqeust);
  }
  // create bookmark
  @UseGuards(AuthGuard('jwt'))
  @Post('/bookmarkword')
  bookmarkWord(@Body() bookmarkReqeust: BookmarkRequest) {
    return this.appService.addBookMark(bookmarkReqeust);
  }
  // delete bookmark
  @UseGuards(AuthGuard('jwt'))
  @Delete('/removebookmark')
  removeBookmark(@Body() bookmarkReqeust: BookmarkRequest) {
    return this.appService.removeBookMark(bookmarkReqeust);
  }
  @Get('/getbookmarkofuser')
  @UseGuards(AuthGuard('jwt'))
  getBookmarkOfUser(@Body() bookmarkReqeust: BookmarkRequest) {
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
