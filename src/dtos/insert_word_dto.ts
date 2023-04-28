// word, definition, example, username
export class InsertWordRequest {
  word: string;
  definition: string;
  example: string;
  registrarId: number;
}

export class InsertWordResponse {
  result: boolean;
  message?: string;
}
