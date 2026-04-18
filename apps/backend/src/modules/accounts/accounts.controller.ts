import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentWorkspaceId } from '../../common/decorators/workspace.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceMemberGuard } from '../../common/guards/workspace-member.guard';
import { CreateConnectedAccountDto } from './dto/create-connected-account.dto';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(JwtAuthGuard, WorkspaceMemberGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  list(@CurrentWorkspaceId() workspaceId: string) {
    return this.accountsService.listAccounts(workspaceId);
  }

  @Post()
  create(
    @CurrentWorkspaceId() workspaceId: string,
    @Body() body: CreateConnectedAccountDto,
  ) {
    return this.accountsService.connectMcc(workspaceId, body);
  }

  @Get(':id/discover')
  discover(@Param('id') accountId: string) {
    return this.accountsService.discoverChildAccounts(accountId);
  }

  @Delete(':id')
  remove(@CurrentWorkspaceId() workspaceId: string, @Param('id') accountId: string) {
    return this.accountsService.deleteAccount(workspaceId, accountId);
  }
}
