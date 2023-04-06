export class UserExpressionRequest {
  wordId?: number;
  userId?: number;
  expression?: boolean;
}

export class UserExpressionResponse {
  result: boolean;
  expression?: boolean;
  wordId?: number;
  userId?: number;
  likeId?: number;
}
