import { Schema, Repository } from "redis-om";
import client from "./client.js";

/* create a Schema */
const tempBusinessDataSchema = new Schema(
	"tempBusinessData",
	{
		businessName: { type: "string" },
		yearEstablished: { type: "number" },
		loan: { type: "number" },
		accountingProviderId: { type: "string" },
		profitOrLossByYear: { type: "number" },
		averageAssetValue: { type: "number" },
	},
	{
		dataStructure: "JSON",
	}
);

export const tempBusinessDataRepository = new Repository(
	tempBusinessDataSchema,
	client
);
