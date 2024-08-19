import express from "express";
import pgp from "pg-promise";
const app = express();
app.use(express.json());

export async function getAccountByEmail (email: string){
	const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16");
	const [acc] = await connection.query("select * from branas_16.account where email = $1", [email]);
	await connection.$pool.end();
	return acc
}

export async function getAccountById(accountId: string){
	const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
	const [account] = await connection.query("select * from branas_16.account where account_id = $1", [accountId])
	await connection.$pool.end()
	return account
}

export async function saveAccount(account: any){
	const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
	await connection.query("insert into branas_16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
	await connection.$pool.end()
}

