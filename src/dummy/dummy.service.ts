import { Injectable } from '@nestjs/common';

@Injectable()
export class DummyService {
  work() {
    return 'Thw work is done!';
  }
}
