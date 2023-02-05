/* eslint-disable max-classes-per-file */
/* eslint-disable prettier/prettier */

/** **
 * @object class(500,'error message',5000)
 *
 *
 */

export class ApplicationError extends Error {
  constructor(statusCode, message = 'an error occurred', code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
  }
}

export class ValidationError extends ApplicationError {
  constructor(code = 4000, message = '') {
    super(400, message || 'ValidationError error', code);
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(code = 4010, message = '') {
    super(401, message || 'Authentication error', code);
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(code = 4030, message = '') {
    super(403, message || 'Authorization error', code);
  }
}
export class NotFoundError extends ApplicationError {
  constructor(code = 4040, message = '') {
    super(404, message || 'Resource not found', code);
  }
}
export class ServerError extends ApplicationError {
  constructor(code = 5000, message = '') {
    super(500, message || 'Server Error', code);
  }
}
