import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageFormatterService {
  format(string: string): string {
    const timeStamp = new Date().toISOString();
    return `[${timeStamp}] ${string}`;
  }
}
