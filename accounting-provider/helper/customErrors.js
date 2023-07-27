class MyError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class ForbiddenError extends MyError {
	constructor(message) {
		super(`You are not the author of this ${message}`);
	}
}
export class NotFoundError extends MyError {
	constructor(property, message = "") {
		super(`${property} not found ${message}`);
	}
}
export class UnauthorizedError extends MyError {
	constructor() {
		super("You need to login first!");
	}
}

export class ValidationError extends MyError {}

export class FieldRequiredError extends ValidationError {
	constructor(field) {
		super(`${field} is required`);
	}
}

export class AlreadyTakenError extends ValidationError {
	constructor(property, message = "") {
		super(`${property} already exists.. ${message}`);
	}
}
