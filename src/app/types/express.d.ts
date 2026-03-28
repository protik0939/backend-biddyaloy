import "express";

declare global {
  namespace Express {
    interface Request {
      authUser?: {
        id: string;
        role: string;
      };
    }
  }
}

export {};
