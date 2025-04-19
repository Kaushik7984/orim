// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { UserDocument } from '../../users/schemas/user.schema';
// import { Request } from 'express';

// interface RequestWithUser extends Request {
//   user: UserDocument;
// }

// export const CurrentUser = createParamDecorator<UserDocument>(
//   (data: unknown, ctx: ExecutionContext): UserDocument => {
//     const request = ctx.switchToHttp().getRequest<RequestWithUser>();
//     if (!request.user) {
//       throw new Error('User not found in request');
//     }
//     return request.user;
//   },
// );

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
