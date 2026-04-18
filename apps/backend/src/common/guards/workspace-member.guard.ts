import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: { workspaceId?: string } }>();
    return Boolean(request.user?.workspaceId);
  }
}
