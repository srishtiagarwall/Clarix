import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { Workspace } from '../modules/workspaces/entities/workspace.entity';
import { ConnectedAccount } from '../modules/accounts/entities/connected-account.entity';
import { CreateUsers1745000000001 } from './migrations/001_create_users';
import { CreateWorkspaces1745000000002 } from './migrations/002_create_workspaces';
import { CreateConnectedAccounts1745000000003 } from './migrations/003_create_connected_accounts';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL ?? 'postgresql://clarix:clarix@localhost:5433/clarix',
  entities: [User, Workspace, ConnectedAccount],
  migrations: [
    CreateUsers1745000000001,
    CreateWorkspaces1745000000002,
    CreateConnectedAccounts1745000000003,
  ],
});
