// src/errors.ts
import { ApolloError } from 'apollo-server-errors';

export class UserInputError extends ApolloError {
  constructor(message: string) {
    super(message, 'USER_INPUT_ERROR');

    Object.defineProperty(this, 'name', { value: 'UserInputError' });
  }
}

export class AuthenticationError extends ApolloError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR');

    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}

export class ForbiddenError extends ApolloError {
  constructor(message: string) {
    super(message, 'FORBIDDEN_ERROR');

    Object.defineProperty(this, 'name', { value: 'ForbiddenError' });
  }
}

export class InternalServerError extends ApolloError {
  constructor(message: string) {
    super(message, 'INTERNAL_SERVER_ERROR');

    Object.defineProperty(this, 'name', { value: 'InternalServerError' });
  }
}
