import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentWorkspaceId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: { workspaceId?: string } }>();
    return request.user?.workspaceId;
  },
);
