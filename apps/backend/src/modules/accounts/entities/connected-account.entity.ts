import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity({ name: 'connected_accounts' })
export class ConnectedAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'workspace_id' })
  workspaceId!: string;

  @Column({ default: 'google_ads' })
  platform!: string;

  @Column({ name: 'account_id' })
  accountId!: string;

  @Column({ name: 'account_name' })
  accountName!: string;

  @Exclude()
  @Column({ name: 'refresh_token_encrypted' })
  refreshTokenEncrypted!: string;

  @Column({ name: 'last_synced_at', type: 'timestamptz', nullable: true })
  lastSyncedAt!: Date | null;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => Workspace, (workspace) => workspace.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspace_id' })
  workspace!: Workspace;
}
