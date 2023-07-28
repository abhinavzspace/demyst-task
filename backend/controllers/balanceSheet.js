import { EntityId } from "redis-om";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import {
	AlreadyTakenError,
	FieldRequiredError,
	NotFoundError,
} from "../helper/customErrors.js";
import client from "../cache/client.js";

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

		const key = uuidv4();

		const _tempBusiness = await client.set(
			key,
			JSON.stringify({
				businessName,
				yearEstablished: parseInt(yearEstablished),
				loan: parseInt(loan),
				accountingProviderId,
				profitOrLossByYear: parseInt(profitOrLossByYear),
				averageAssetValue: parseInt(averageAssetValue),
			})
		);

		res.json({
			tempBusinessId: key,
			businessName,
			yearEstablished,
			profitOrLossByYear,
			averageAssetValue,
		});
	} catch (error) {
		next(error);
	}
};
