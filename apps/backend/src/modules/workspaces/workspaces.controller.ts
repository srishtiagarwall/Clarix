import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { CurrentWorkspaceId } from '../../common/decorators/workspace.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../../common/guards/workspace-member.guard';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
@UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get('me')
  getCurrent(@CurrentWorkspaceId() workspaceId: string) {
    return this.workspacesService.getById(workspaceId);
  }

  @Patch('me')
  updateCurrent(
    @CurrentWorkspaceId() workspaceId: string,
    @Body() body: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(workspaceId, body);
  }
}
