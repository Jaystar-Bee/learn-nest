import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly SAIL_ROUNDS = 12;

  public async hashText(text: string): Promise<string> {
    return await bcrypt.hash(text, this.SAIL_ROUNDS);
  }

  public async compareHash(text: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(text, hash);
  }
}
