import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './dtos/create_user_dto';
import { DeleteWordDTO } from './dtos/delete_user_dto';
import { WordResult } from './dtos/read_word_dto';
import { RequestHeader } from './dtos/request_header_dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // Create
  @Post('/createUser')
  createUser(
    @Headers() header: RequestHeader,
    @Body() createUserRequest: CreateUserRequest,
  ) {
    const response = CheckHeader(header);
    if (response) return this.appService.insertUser(createUserRequest);
    else {
      return HttpCode(400);
    }
  }

  @Post('/registerword')
  registerWord(@Body() wordRequest: WordResult) {
    return this.appService.registerWord(wordRequest);
  }
  // Read
  @Get('/pendingword')
  getPendingWord() {
    return this.appService.getPendingWords();
  }

  @Get('/getword')
  getWord(@Body() wordResult: WordResult) {
    return this.appService.getWord(wordResult.word);
  }

  @Get('/getuserword')
  getUserWord(): string {
    return '';
  }
  // Update
  @Put('/editword')
  editWord(@Body() wordData: WordResult) {
    return this.appService.updateWordData(wordData);
  }

  // Delete
  @Delete('/deleteword')
  deleteWord(@Body() deleteWordDTO: DeleteWordDTO) {
    return this.appService.deleteWordData(deleteWordDTO);
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
