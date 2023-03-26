import { Injectable } from '@nestjs/common';

import {insertDefinition, getWordData} from 'src/app.test.prisma'
@Injectable()
export class AppService {
  
  getHello(): string {
    return 'Hello World!';
  }

  registerWord() : void{
    
    insertDefinition();
  }

  // getWord() : void {
  //   getWordData()
  // }

  

}
