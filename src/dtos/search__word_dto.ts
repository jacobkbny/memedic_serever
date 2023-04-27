export class SearchWordRequest {
  word?: string;
  wordId?: number;
  registrarId?: number;
}

export class SearchWordResponse {
  result: boolean;
  word?: string;
  wordId?: number;
  definition?: string;
  example?: string;
  userName?: string;
  registerdTime?: Date;
  numberOfLikes?: number;
  userId?: number;
  message?: string;
}

/*
 word: wordData.word,
        definition: wordData.definition,
        example: wordData.example,
        username: wordData.registrar.username,
        registered_time: wordData.registered_time,
        numberOfLikes: numberOfLikes,
*/
