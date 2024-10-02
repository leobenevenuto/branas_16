import express from "express";
import pgp from "pg-promise";
import Account from "../application/Account";
const app = express();
app.use(express.json());

export interface AccountRepository{
	getAccountByEmail(email: string): Promise<Account | undefined>
	getAccountById(accountId: string): Promise<Account>
	saveAccount(account: Account): Promise<void>
}

export class AccountRepositoryDatabase implements AccountRepository{
	 async getAccountByEmail (email: string){
		const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16");
		const [accountData] = await connection.query("select * from branas_16.account where email = $1", [email]);
		await connection.$pool.end();
		if(!accountData) return;
		return Account.restore(accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
	}
	
	 async getAccountById(accountId: string){
		const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
		const [accountData] = await connection.query("select * from branas_16.account where account_id = $1", [accountId])
		await connection.$pool.end()
		return Account.restore(accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver)
	}
	
	 async saveAccount(account: Account){
		const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
		await connection.query("insert into branas_16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
		await connection.$pool.end()
	}

}

export class AccountRepositoryMemory implements AccountRepository {
	accounts: any[]

	constructor(){
		this.accounts = []
	}

	async getAccountByEmail(email: string): Promise<any>{
		const account = this.accounts.find((account: any) => account.email === email)
		return account;
	}

	async getAccountById(accountId: string): Promise<any>{
		const account = this.accounts.find((account: any) => account.accountId === accountId)
		return account
	}

	async saveAccount(account: any): Promise<void>{
		this.accounts.push(account)
	}
}


