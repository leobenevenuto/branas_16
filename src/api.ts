import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	let result;
	const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16");
	try {
		const id = crypto.randomUUID()
		const [acc] = await connection.query("select * from branas_16.account where email = $1", [req.body.email]);
		if (acc) result = -4
		if (!req.body.name.match(/[a-zA-Z] [a-zA-Z]+/)) result = -3
		if (!req.body.email.match(/^(.+)@(.+)$/)) result = -2
		if (!validate(req.body.cpf)) result = -1
		if (req.body.isDriver && req.body.carPlate && !req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) result = -5
		await connection.query("insert into branas_16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver]);
		if (typeof result === "number") {
			res.status(422).send(result + "");
		} else {	
			const obj = {
				accountId: id
			}
			result = obj
			res.json(result);
		}
	} finally {
		await connection.$pool.end();
	}
});

app.get("/accounts/:accountId", async (req, res) => {
	const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
	const [account] = await connection.query("select * from branas_16.account where account_id = $1", [req.params.accountId])
	await connection.$pool.end();
	res.json(account)
})

app.listen(3000);
