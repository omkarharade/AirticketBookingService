const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");

class BookingService {
	constructor() {
		this.bookingRepository = new BookingRepository();
	}

	async createBooking(data) {
		try {
			const flightId = data.flightId;
			let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
			const response = await axios.get(getFlightRequestURL);
			console.log();

			// get flight

			const flightData = response.data.data;

			let priceOfFlight = flightData.price;
			if (data.noOfSeats > flightData.totalSeats) {
				throw new ServiceError(
					"Something went wrong in the booking process",
					"Insufficient seats in the flight "
				);
			}

			console.log(flightData);

			// book flight

			const totalCost = priceOfFlight * data.noOfSeats;
			const bookingPayload = { ...data, totalCost };
			const booking = await this.bookingRepository.create(bookingPayload);
			console.log(booking);
			// update flight

			const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
			console.log(updateFlightRequestURL);

			await axios.patch(updateFlightRequestURL, {
				totalSeats: flightData.totalSeats - booking.noOfSeats,
			});
			console.log(booking.id);
			const finalBooking = await this.bookingRepository.update(booking.id, {
				status: "Booked",
			});
			return finalBooking;
		} catch (error) {
			if (error.name == "RepositoryError" || error.name == "ValidationError") {
				throw error;
			}
			throw new ServiceError();
		}
	}

	async update(bookingId, data) {
		try {
			await BookingRepository.update(data, {
				where: {
					id: bookingId,
				},
			});
			return true;
		} catch (error) {
			throw new AppError(
				"RepositoryError",
				"Cannot update Bookig",
				"There was some issue updating the booking, please try again later",
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

module.exports = BookingService;
