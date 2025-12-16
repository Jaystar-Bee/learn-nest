export class WrongTaskStatusException extends Error {
  constructor(message?: string) {
    super(message || 'Cannot update task status');
    this.name = 'WrongTaskStatusException';
  }
  statusCode = 400;
}
