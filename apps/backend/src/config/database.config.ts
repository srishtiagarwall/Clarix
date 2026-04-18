import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL ?? 'postgresql://clarix:clarix@localhost:5433/clarix',
}));
