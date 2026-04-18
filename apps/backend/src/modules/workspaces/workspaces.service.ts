import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspacesRepository: Repository<Workspace>,
  ) {}

  async ensureDefaultWorkspace(userId: string, userName: string): Promise<Workspace> {
    const existing = await this.workspacesRepository.findOne({ where: { userId } });
    if (existing) {
      return existing;
    }

    return this.workspacesRepository.save(
      this.workspacesRepository.create({
        userId,
        name: `${userName}'s Workspace`,
      }),
    );
  }

  async getById(id: string): Promise<Workspace> {
    const workspace = await this.workspacesRepository.findOne({ where: { id } });
    if (!workspace) {
      throw new NotFoundException(`Workspace ${id} not found`);
    }
    return workspace;
  }

  async update(workspaceId: string, input: UpdateWorkspaceDto): Promise<Workspace> {
    const workspace = await this.getById(workspaceId);
    Object.assign(workspace, input);
    return this.workspacesRepository.save(workspace);
  }
}
