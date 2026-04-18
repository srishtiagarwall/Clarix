import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkspaces1745000000002 implements MigrationInterface {
  name = 'CreateWorkspaces1745000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE workspaces (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        logo_url TEXT,
        brand_color TEXT NOT NULL DEFAULT '#2563EB',
        plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','starter','pro')),
        razorpay_subscription_id TEXT,
        plan_expires_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );

      CREATE INDEX idx_workspaces_user ON workspaces(user_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS workspaces;');
  }
}
