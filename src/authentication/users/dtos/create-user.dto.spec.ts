import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  const dtos = new CreateUserDto();
  beforeEach(() => {
    dtos.email = 'amjaystar@gmail.com';
    dtos.fullName = 'amjaystar';
    dtos.password = 'AbcdEf1@';
  });
  it('should validate complete valid data', async () => {
    // 3 As

    // Arrange

    // Act
    const errors = await validate(dtos);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid password', async () => {
    // 3 As

    // Arrange
    dtos.password = '';

    // Act
    const errors = await validate(dtos);

    // Assert
    expect(errors.length).toBe(1);
    expect(errors[0].property).toBe('password');
  });

  const testPassword = async (password: string, message: string) => {
    dtos.password = password;

    const errors = await validate(dtos);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).toBeTruthy();
    const passwordMessages = errors[0].constraints?.matches;
    expect(passwordMessages).toBe(message);
  };
  it('should fail without an uppercase in password', async () => {
    await testPassword(
      'abcdefg',
      'Password must contain at least one uppercase letter',
    );
  });

  it('should fail without a number in password', async () => {
    await testPassword('abcdeGg', 'Password must contain at least one number');
  });

  it('should fail without a special character in password', async () => {
    await testPassword(
      'abcdefgG1',
      'Password must contain at least one special character',
    );
  });
});
