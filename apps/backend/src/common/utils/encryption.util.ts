import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionUtil {
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const rawKey = this.configService.getOrThrow<string>('app.encryptionKey');
    this.key = Buffer.from(rawKey, 'utf8').subarray(0, 32);
    if (this.key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be at least 32 bytes long');
    }
  }

  encrypt(value: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }

  decrypt(payload: string): string {
    const buffer = Buffer.from(payload, 'base64');
    const iv = buffer.subarray(0, 16);
    const tag = buffer.subarray(16, 32);
    const encrypted = buffer.subarray(32);
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }
}
