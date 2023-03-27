import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './dtos/create_user_dto';
import { DeleteWordDTO } from './dtos/delete_user_dto';
import { WordResult } from './dtos/read_word_dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
 // Create
  @Post('/createUser')
  createUser(@Body() createUserRequest: CreateUserRequest) {
    return this.appService.insertUser(createUserRequest);
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
  editWord(@Body() wordData: WordResult){
    return this.appService.updateWordData(wordData)
  }

 // Delete
  @Delete('/deleteword')
  deleteWord(@Body() deleteWordDTO: DeleteWordDTO) {
    return this.appService.deleteWordData(deleteWordDTO);
  }
}
