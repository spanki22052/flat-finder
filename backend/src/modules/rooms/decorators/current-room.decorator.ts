import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentRoom = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.roomId as string;
  },
);
