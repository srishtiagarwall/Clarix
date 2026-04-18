import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ConnectedAccount } from '../../accounts/entities/connected-account.entity';

@Entity({ name: 'workspaces' })
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column()
  name!: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl!: string | null;

  @Column({ name: 'brand_color', type: 'text', default: '#2563EB' })
  brandColor!: string;

  @Column({ type: 'text', default: 'free' })
  plan!: 'free' | 'starter' | 'pro';

  @Column({ name: 'razorpay_subscription_id', type: 'text', nullable: true })
  razorpaySubscriptionId!: string | null;

  @Column({ name: 'plan_expires_at', type: 'timestamptz', nullable: true })
  planExpiresAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.workspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => ConnectedAccount, (account) => account.workspace)
  accounts!: ConnectedAccount[];
}
