import { Injectable } from '@nestjs/common';

import {
  insertDefinition,
  getWordData,
  insertUserData,
  deleteWordData,
  getPendingData,
  updateWordData
} from 'src/app.test.prisma';
import { CreateUserRequest } from './dtos/create_user_dto';
import { DeleteWordDTO } from './dtos/delete_user_dto';
import { InsertUserResponse } from './dtos/Insert_user_dto';
import { WordResult } from './dtos/read_word_dto';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async insertUser(createUserRequest: CreateUserRequest) {
    const response: InsertUserResponse = await insertUserData(
      createUserRequest,
    );
    return JSON.stringify(response);
  }

  async registerWord(wordRequest: WordResult) {
    const response: any = await insertDefinition(wordRequest);
    return response;
  }

 
  async getWord(word: string) {
    const response: WordResult = await getWordData(word);
    if (response === null) {
      return false;
    }
    return response;
  }

  async getPendingWords() {
    const response = await getPendingData();
    return response;
  }

  async updateWordData(updateData : WordResult) {
    const response = await updateWordData(updateData)
      return response;
  }
  async deleteWordData(deleteWordDTO: DeleteWordDTO) {
    const response: boolean = await deleteWordData(deleteWordDTO);
    return response;
  }
}
