const { StatusCodes } = require("http-status-codes");

class ServiceError extends Error {
	constructor(
		message = "Something went wrong",
		explaination = "Service layer error",
		statusCodes = StatusCodes.INTERNAL_SERVER_ERROR
	) {
		(this.name = "ServiceError"),
			(this.message = message),
			(this.explaination = explaination),
			(this.statusCodes = statusCodes);
	}
}

module.exports = ServiceError;
