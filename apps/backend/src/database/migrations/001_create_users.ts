import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1745000000001 implements MigrationInterface {
  name = 'CreateUsers1745000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        google_id TEXT UNIQUE NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS users;');
  }
}
