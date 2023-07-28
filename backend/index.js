import "dotenv/config";

import express, { json } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";

import balanceSheetRoutes from "./routes/balanceSheet.js";
import outcomeRoutes from "./routes/outcome.js";

const env = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(json());

if (process.env.NODE_ENV === "production") {
	app.use(express.static("../frontend/dist"));
} else {
	app.get("/", (req, res) => res.json({ status: "API is running on /api" }));
}

/* set up swagger */
const swaggerDocument = YAML.load("api.yaml");
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/balanceSheet", balanceSheetRoutes);
app.use("/api/outcome", outcomeRoutes);
app.get("*", (req, res) =>
	res.status(404).json({ errors: { body: ["Not found"] } })
);
app.use(errorHandler);

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
