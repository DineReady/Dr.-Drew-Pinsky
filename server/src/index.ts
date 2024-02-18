/* eslint-disable quotes */
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { allOrders, createOrder, orderDetails, validateOrderId } from "./routes";
import { db } from "./connection";
import { Knex } from "knex";

dotenv.config();
const app: Express = express();
const PORT: number = 8080;

db.schema.hasTable("orders").then((exists: boolean) => {
    if (!exists) {
        db.schema
            .createTable("orders", (table: Knex.CreateTableBuilder) => {
                table.string("id").notNullable().primary();
                table.string("status").notNullable();
                table.timestamps(true, true);
            })
            .then((): void => console.log("[server] Created table: orders"))
            .catch((error: Error) => console.error(`[server] Error creating table: ${error.message}`));
    }
});

{
    /* ============================= MIDDLEWARE ========================== */
}
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

{
    /* ============================= ROUTES ============================= */
}
app.get("/orders", (req: Request, res: Response): Promise<void> => allOrders(req, res));
app.get("/orders/create", (req: Request, res: Response): Promise<void> => createOrder(req, res));
app.get("/orders/validate/:id", (req: Request, res: Response): Promise<void> => validateOrderId(req, res));
app.get("/orders/:id", (req: Request, res: Response): Promise<void> => orderDetails(req, res));

app.listen(PORT, (): void => console.log(`\n[server] Server is running at http://localhost:${PORT}`));
