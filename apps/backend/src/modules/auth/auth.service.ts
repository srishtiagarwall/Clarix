import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { AuthResponseDto } from './dto/auth-response.dto';

interface GoogleAuthInput {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly workspacesService: WorkspacesService,
  ) {}

  async loginFromGoogle(input: GoogleAuthInput): Promise<AuthResponseDto> {
    const user = await this.usersService.findOrCreateFromGoogleProfile(input);
    const workspace = await this.workspacesService.ensureDefaultWorkspace(user.id, user.name);
    return this.buildAuthResponse(user, workspace.id);
  }

  async getProfile(userId: string, workspaceId: string): Promise<AuthResponseDto['user']> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('Authenticated user no longer exists');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      workspaceId,
    };
  }

  private buildAuthResponse(user: User, workspaceId: string): AuthResponseDto {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      workspaceId,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        workspaceId,
      },
    };
  }
}
