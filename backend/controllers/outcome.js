import axios from "axios";
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

		if (!businessName || businessName.length < 0)
			throw new NotFoundError("Business Name");

		await tempBusinessDataRepository.remove(req.params.tempBusinessId);

		let preAssessment = 20; // default value

		if (profitOrLossByYear > 0) preAssessment = 60;
		if (averageAssetValue > loan) preAssessment = 100;

		const { data } = await axios.get(
			`${decisionEngineUrl}/decide?businessName=${businessName}&yearEstablished=${yearEstablished}&profitOrLossByYear=${profitOrLossByYear}&preAssessment=${preAssessment}`
		);
		if (!data) throw new NotFoundError("data");

		res.json({ result: data });
	} catch (error) {
		next(error);
	}
};
