import { Controller, Get, Post, Put,Delete, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserRequest } from './dtos/create_user_dto';
import { DeleteWordDTO } from './dtos/delete_user_dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/createUser")
  createUser(@Body() createUserRequest : CreateUserRequest){
    return this.appService.insertUser(createUserRequest)
  }

  @Post("/registerword")
  registerWord(): string{
    this.appService.registerWord()
    return "done!"
  }

  @Get("/pendingword")
  getPendingWord(): string{
    return ""
  }

  @Get("/getword")
  getWord(): string{
    return ""
  }

  @Get("/getuserword")
  getUserWord(): string{
    return ""
  }

  @Put("/editword")
  editWord(): string{
    return ""
  }

  @Delete("/deleteword")
  deleteWord(@Body() deleteWordDTO:DeleteWordDTO){
    return this.appService.deleteWordData(deleteWordDTO)
  }

}
