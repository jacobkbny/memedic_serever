// word, definition, example, username
export class InsertWordRequest {
  word: string;
  definition: string;
  example: string;
  registrar: string;
}

export class InsertWordResponse {
  result: boolean;
  message?: string;
}
