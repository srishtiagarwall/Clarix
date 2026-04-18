import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../modules/users/entities/user.entity';
import { Workspace } from '../modules/workspaces/entities/workspace.entity';
import { ConnectedAccount } from '../modules/accounts/entities/connected-account.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('database.url'),
        autoLoadEntities: true,
        synchronize: false,
        entities: [User, Workspace, ConnectedAccount],
      }),
    }),
  ],
})
export class DatabaseModule {}
