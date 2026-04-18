import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConnectedAccountDto {
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @IsString()
  @IsNotEmpty()
  accountName!: string;

  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
