import {
	AlreadyTakenError,
	FieldRequiredError,
	NotFoundError,
} from "../helper/customErrors.js";

function generateRandomInteger(min, max) {
	return Math.floor(min + Math.random() * (max - min + 1));
}

export const balanceSheet = async (req, res, next) => {
	try {
		const { _businessName, _yearEstablished } = req.query;

		let sheet = [];

		// create random data
		let year = new Date().getFullYear();
		let month = new Date().getMonth() + 1; // we need to add 1, because otherwise it will start with 0

		for (let i = 0; i < 12; i++) {
			if (month < 1) {
				month = 12;
				year--;
			}
			sheet.push({
				year,
				month,
				profitOrLoss: generateRandomInteger(-100000, 300000),
				assetsValue: generateRandomInteger(1234, 200000),
			});
			month--;
		}

		res.json({ sheet });
	} catch (error) {
		next(error);
	}
};
