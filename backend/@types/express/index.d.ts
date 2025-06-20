declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      telegram_id: string;
    };
  }
}