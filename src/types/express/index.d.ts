import * as express from 'express';
import { User } from '../../entities/User';
import { Jwt, JwtPayload } from 'jsonwebtoken';

console.log('Types are loaded!')

declare global {
  namespace Express {
    interface Request {
      user?: User | JwtPayload;
      validatedQuery?: any;
    }
  }
}

export {};
