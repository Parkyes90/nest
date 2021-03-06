import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TokensService } from './tokens.service';
import { UsersService } from '../users/users.service';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class TokensMiddleware implements NestMiddleware {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-token'];
    if (token) {
      try {
        const decoded = this.tokensService.verify(
          token.toString(),
        ) as JwtPayload;
        console.log(decoded);
        req['user'] = await this.usersService.findById(decoded.id);
      } catch (e) {
        throw new ForbiddenException(e);
      }
    }
    next();
  }
}
