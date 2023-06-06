const { StatusCodes } = require("http-status-codes");

class ValidationError extends Error {
	constructor() {
		let explaination = [];
		error.errors.forEach((err) => {
			explaination.push(err.message);
		});

		this.name = "ValidationError";
		this.message = "Not able to validate the data";
		this.explaination = explaination;
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

module.exports = ValidationError;
