import crypto from "crypto";
import { validate } from "./validateCpf";
import { AccountRepository } from "../resources/AccountRepository";


export class GetAccount {
	constructor(readonly accountRepository: AccountRepository){}

	async execute(input: any): Promise<any>{
		const account = await this.accountRepository.getAccountById(input.accountId)
		return account
	}

}