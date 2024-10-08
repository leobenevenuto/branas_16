import crypto from "crypto";
import { validate } from "./validateCpf";
import { AccountRepository } from "../resources/AccountRepository";
import { MailerGateway } from "../resources/MailerGateway";
import Account from "./Account";


export class Signup {
	constructor(readonly accountRepository: AccountRepository, readonly mailerGateway: MailerGateway) {

	}

	async execute(input: any): Promise<any> {
		const existingAccount = await this.accountRepository.getAccountByEmail(input.email)
		if (existingAccount) throw new Error("Account already exists")
		const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver)
		await this.accountRepository.saveAccount(account)
		await this.mailerGateway.send(account.email, "Welcome!", "")
		return {
			accountId: account.accountId
		}
	}
}