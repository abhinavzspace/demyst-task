import {
	AlreadyTakenError,
	FieldRequiredError,
	NotFoundError,
} from "../helper/customErrors.js";
import { tempBusinessDataRepository } from "../cache/tempBusinessData.js";

const decisionEngineUrl = process.env.DECISION_ENGINE_URL;

export const outcome = async (req, res, next) => {
	try {
		const {
			businessName,
			yearEstablished,
			loan,
			// accountingProviderId,
			profitOrLossByYear,
			averageAssetValue,
		} = await tempBusinessDataRepository.fetch(req.params.tempBusinessId);

		await tempBusinessDataRepository.remove(req.params.tempBusinessId);

		let preAssessment = 20; // default value

		if (profitOrLossByYear > 0) preAssessment = 60;
		if (averageAssetValue > loan) preAssessment = 100;

		const result = await axios.get(
			`${decisionEngineUrl}/decide?businessName=${businessName}&yearEstablished=${yearEstablished}&profitOrLossByYear=${profitOrLossByYear}&preAssessment=${preAssessment}`
		);
		if (!result) throw new NotFoundError("result");

		res.json({ result });
	} catch (error) {
		next(error);
	}
};
