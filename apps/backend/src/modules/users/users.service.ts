import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

interface GoogleProfileInput {
  email: string;
  name: string;
  googleId: string;
  avatarUrl?: string | null;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOrCreateFromGoogleProfile(profile: GoogleProfileInput): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: [{ googleId: profile.googleId }, { email: profile.email }],
    });

    if (existing) {
      existing.name = profile.name;
      existing.avatarUrl = profile.avatarUrl ?? null;
      return this.usersRepository.save(existing);
    }

    return this.usersRepository.save(
      this.usersRepository.create({
        email: profile.email,
        name: profile.name,
        googleId: profile.googleId,
        avatarUrl: profile.avatarUrl ?? null,
      }),
    );
  }
}
