export class BookmarkRequest {
  userId?: number;
  wordId?: number;
}
export class BookmarkResponse {
  result: boolean;
}

export class Bookmark {
  bookMarkId: number;
  word : string
  definition: string
  example : string
  registrarId : number
  registeredTime : Date
  wordId : number
}