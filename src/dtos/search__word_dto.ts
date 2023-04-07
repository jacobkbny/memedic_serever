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
  username?: string;
  registerd_time?: Date;
  numberOfLikes?: number;
}

/*
 word: wordData.word,
        definition: wordData.definition,
        example: wordData.example,
        username: wordData.registrar.username,
        registered_time: wordData.registered_time,
        numberOfLikes: numberOfLikes,
*/
