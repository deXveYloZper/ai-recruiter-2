import { ApolloError } from 'apollo-server-express';

export class ValidationError extends ApolloError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR', { field });
    Object.defineProperty(this, 'name', { value: 'ValidationError' });
  }
}

export class AuthorizationError extends ApolloError {
  constructor(message) {
    super(message, 'AUTHORIZATION_ERROR');
    Object.defineProperty(this, 'name', { value: 'AuthorizationError' });
  }
}

export class NotFoundError extends ApolloError {
  constructor(message) {
    super(message, 'NOT_FOUND_ERROR');
    Object.defineProperty(this, 'name', { value: 'NotFoundError' });
  }
}




/*
In this code, we define a custom ValidationError class that extends the ApolloError class provided by apollo-server-express. 
The constructor takes a message and an optional field parameter to specify the field that caused the validation error.
*/