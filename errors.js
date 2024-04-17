import { ApolloError } from 'apollo-server-express';

export class ValidationError extends ApolloError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR', { field });

    Object.defineProperty(this, 'name', { value: 'ValidationError' });
  }
}



/*
In this code, we define a custom ValidationError class that extends the ApolloError class provided by apollo-server-express. 
The constructor takes a message and an optional field parameter to specify the field that caused the validation error.
*/