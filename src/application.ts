import crypto from "crypto";
import { validate } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from "./resource";

export async function signup(input: any): Promise<any> {
	const account = input
	account.accountId = crypto.randomUUID()
	const existingAccount = await getAccountByEmail(account.email)
	if (existingAccount) throw new Error("Account already exists")
	if (!account.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name")
	if (!account.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email")
	if (!validate(account.cpf)) throw new Error("Invalid CPF")
	if (account.isDriver && account.carPlate && !account.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid carplate")
	await saveAccount(account)
	return {
		accountId: account.accountId
	}
}

export async function getAccount(accountId: string) {
	const account = await getAccountById(accountId)
	return account
}