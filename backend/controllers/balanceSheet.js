import { EntityId } from "redis-om";
import axios from "axios";
import {
	AlreadyTakenError,
	FieldRequiredError,
	NotFoundError,
} from "../helper/customErrors.js";
import { tempBusinessDataRepository } from "../cache/tempBusinessData.js";

const accountingProviderUrl = process.env.ACCOUNTING_PROVIDER_URL;

export const balanceSheet = async (req, res, next) => {
	try {
		const { businessName, yearEstablished, loan, accountingProviderId } =
			req.query;

		const {
			data: { sheet },
		} = await axios.get(
			`${accountingProviderUrl}/balanceSheet?businessName=${businessName}&yearEstablished=${yearEstablished}`
		);

		if (!sheet) throw new NotFoundError("Balance sheet");

		sheet.sort((a, b) => b.year - a.year); //sort by year in descending order
		sheet.sort((a, b) => b.month - a.month); // further sort by month in descending order

		const profitOrLossByYear = sheet.reduce(
			(accumulator, current, i) =>
				i < 12 ? accumulator + current.profitOrLoss : accumulator,
			0
		);

		const averageAssetValue =
			sheet.reduce(
				(acc, curr, i) => (i < 12 ? acc + curr.assetsValue : acc),
				0
			) / sheet.length;

		const tempBusiness = await tempBusinessDataRepository.save({
			businessName,
			yearEstablished: parseInt(yearEstablished),
			loan: parseInt(loan),
			accountingProviderId,
			profitOrLossByYear: parseInt(profitOrLossByYear),
			averageAssetValue: parseInt(averageAssetValue),
		});

		if (!tempBusiness[EntityId]) throw new NotFoundError("Entity Id");

		const ttlInSeconds = 5 * 60; // 5 mins
		await tempBusinessDataRepository.expire(
			tempBusiness[EntityId],
			ttlInSeconds
		);

		res.json({
			tempBusinessId: tempBusiness[EntityId],
			businessName,
			yearEstablished,
			profitOrLossByYear,
			averageAssetValue,
		});
	} catch (error) {
		next(error);
	}
};
