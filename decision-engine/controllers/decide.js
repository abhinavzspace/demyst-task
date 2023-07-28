import {
	AlreadyTakenError,
	FieldRequiredError,
	NotFoundError,
} from "../helper/customErrors.js";

export const decide = async (req, res, next) => {
	try {
		const { businessName, yearEstablished, profitOrLossByYear, preAssessment } =
			req.query;

		res.json({ preAssessment });
	} catch (error) {
		next(error);
	}
};
