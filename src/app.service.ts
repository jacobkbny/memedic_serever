import { Injectable } from '@nestjs/common';

import {insertDefinition, getWordData, insertUser} from 'src/app.test.prisma'
import { CreateUserRequest } from './dtos/create_user_dto';
@Injectable()
export class AppService {
  
  getHello(): string {
    return 'Hello World!';
  }
  createUser(createUserRequest : CreateUserRequest){
   console.log(insertUser( createUserRequest))
  }
  registerWord() : void{
    insertDefinition();
  }

  // getWord() : void {
  //   getWordData()
  // }

  

}
