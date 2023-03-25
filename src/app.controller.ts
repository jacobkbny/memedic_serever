import { Controller, Get, Post, Put,Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  deleteWord(): string{
    return ""
  }

}
