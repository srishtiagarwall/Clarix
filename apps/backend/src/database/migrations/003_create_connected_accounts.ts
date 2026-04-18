import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConnectedAccounts1745000000003 implements MigrationInterface {
  name = 'CreateConnectedAccounts1745000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE connected_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        platform TEXT NOT NULL DEFAULT 'google_ads',
        account_id TEXT NOT NULL,
        account_name TEXT NOT NULL,
        refresh_token_encrypted TEXT NOT NULL,
        last_synced_at TIMESTAMPTZ,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE(workspace_id, platform, account_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS connected_accounts;');
  }
}
