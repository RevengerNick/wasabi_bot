import { User } from '@prisma/client';

// 2. Расширяем глобальный неймспейс Express
declare global {
  namespace Express {
    // 3. Говорим, что в объекте Request теперь МОЖЕТ БЫТЬ поле user
    //    с полным, правильным типом User из нашей базы данных.
    export interface Request {
      user?: User;
    }
  }
}