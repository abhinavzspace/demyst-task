"use client";

import { useState } from "react";
import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

enum AccountingProviderId {
	xerox,
	myob,
}

interface Inputs {
	businessName: string;
	yearEstablished: number;
	loan: number;
	accountingProviderId: AccountingProviderId;
}

interface Outputs {
	tempBusinessId: string;
	profitOrLossByYear: number;
	averageAssetValue: number;
}

export default function Home() {
	const [inputs, setInputs] = useState<Inputs | {}>({});
	const [outputs, setOutputs] = useState<Outputs | {}>({});
	const [result, setResult] = useState<number | null>(null);

	const handleInputs =
		(property: keyof Inputs) =>
		(e: React.FormEvent<HTMLInputElement | HTMLSelectElement>): void =>
			setInputs({ ...inputs, [property]: e.currentTarget.value });

	const requestBalanceSheet = async () => {
		if (Object.keys(inputs).length < 3) return;

		setResult(null);

		const { data } = await axios.get(`${SERVER_URL}/balanceSheet`, {
			params: inputs,
		});

		const { tempBusinessId, profitOrLossByYear, averageAssetValue } = data;
		setOutputs({ tempBusinessId, profitOrLossByYear, averageAssetValue });
	};

	const requestOutcome = async () => {
		if (Object.keys(outputs).length <= 0) return;

		const id = "tempBusinessId" in outputs ? outputs.tempBusinessId : null;

		const {
			data: {
				result: { assesment },
			},
		} = await axios.get(`${SERVER_URL}/outcome/${id}`);

		setResult(assesment);
	};

	return (
		<main>
			<h2 className="flex flex-row flex-nowrap items-center my-8">
				<span
					className="flex-grow block border-t border-black"
					aria-hidden="true"
					role="presentation"
				></span>
				<span className="flex-none block mx-4   px-4 py-2.5 text-xs leading-none font-medium uppercase bg-black text-white">
					Demyst Task
				</span>
				<span
					className="flex-grow block border-t border-black"
					aria-hidden="true"
					role="presentation"
				></span>
			</h2>

			<div className="md:flex bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-row my-2">
				<div className="md:flex-1 md:w-1/2 mb-6 md:mb-0 mx-5">
					<div className="-mx-3 mb-6">
						<div className="px-3 mb-6 md:mb-0">
							<label
								className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
								htmlFor="grid-first-name"
							>
								Business Name
							</label>
							<input
								className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-red rounded py-3 px-4 mb-3"
								id="grid-first-name"
								type="text"
								placeholder="Google"
								value={"businessName" in inputs ? inputs.businessName : ""}
								onChange={handleInputs("businessName")}
							/>
							<p className="text-red text-xs italic text-red-700">
								{"businessName" in inputs ? "" : "Please fill out this field."}
							</p>
						</div>
					</div>
					<div className="-mx-3 mb-6">
						<div className="px-3 mb-6 md:mb-0">
							<label
								className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
								htmlFor="grid-password"
							>
								Year Established
							</label>
							<input
								className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
								id="grid-password"
								type="number"
								placeholder="1952"
								value={
									"yearEstablished" in inputs ? inputs.yearEstablished : ""
								}
								onChange={handleInputs("yearEstablished")}
							/>
							<p className="text-grey-dark text-xs italic text-red-700">
								{"yearEstablished" in inputs
									? ""
									: "Please fill out this field."}
							</p>
						</div>
					</div>
					<div className="-mx-3 mb-6">
						<div className="px-3 md:mb-0">
							<label
								className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
								htmlFor="grid-password"
							>
								Loan Amount
							</label>
							<input
								className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3"
								id="grid-password"
								type="number"
								placeholder="100000"
								value={"loan" in inputs ? inputs.loan : ""}
								onChange={handleInputs("loan")}
							/>
							<p className="text-grey-dark text-xs italic text-red-700">
								{"loan" in inputs ? "" : "Please fill out this field."}
							</p>
						</div>
					</div>
					<div className="-mx-3 mb-2">
						<div className="px-3 md:mb-0">
							<label
								className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
								htmlFor="grid-state"
							>
								Select Accounting Provider
							</label>
							<div className="relative">
								<select
									className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
									id="grid-state"
									value={
										"accountingProviderId" in inputs
											? inputs.accountingProviderId
											: ""
									}
									onChange={handleInputs("accountingProviderId")}
								>
									<option value={"xero"}>Xero</option>
									<option value={"myob"}>MYOB</option>
								</select>
							</div>
							<p className="text-grey-dark text-xs italic">
								This will not affect anything. Just for cosmetic purpose.
							</p>
						</div>
					</div>
					<div className="-mx-3 md:flex mb-2">
						<div className="px-3 mb-6 md:mb-0">
							<button
								type="button"
								className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
								onClick={requestBalanceSheet}
							>
								Request Balance Sheet
							</button>
						</div>
					</div>
				</div>

				<div className="md:flex-1 md:w-1/2 mx-5">
					{Object.keys(outputs).length > 0 && (
						<>
							<div className="-mx-3 mb-6">
								<div className="px-3 md:mb-0">
									<label
										className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
										htmlFor="grid-password"
									>
										Profit or loss by year
									</label>
									<span className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3">
										{"profitOrLossByYear" in outputs
											? outputs.profitOrLossByYear
											: ""}
									</span>
									<p className="text-red text-xs italic text-blue-700">
										This value is calculated from balance sheet (with random
										data) provided by accounting provider.
									</p>
								</div>
							</div>
							<div className="-mx-3 mb-6">
								<div className="px-3 md:mb-0">
									<label
										className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
										htmlFor="grid-password"
									>
										Average Asset Value
									</label>
									<span className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3">
										{"averageAssetValue" in outputs
											? outputs.averageAssetValue
											: ""}
									</span>
									<p className="text-red text-xs italic text-blue-700">
										This value is calculated from balance sheet (with random
										data) provided by accounting provider.
									</p>
								</div>
							</div>
							<div className="-mx-3 md:flex mb-2">
								<div className="px-3 mb-6 md:mb-0">
									<button
										type="button"
										className="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
										onClick={requestOutcome}
									>
										Request Outcome
									</button>
								</div>
							</div>

							<p className="text-blue-700 text-lg italic mt-10">
								{result &&
									`The Loan is favored to be approved ${result}% of the requested value`}
							</p>
						</>
					)}
				</div>
			</div>
		</main>
	);
}
