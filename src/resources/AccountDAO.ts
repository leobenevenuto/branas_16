import express from "express";
import pgp from "pg-promise";
const app = express();
app.use(express.json());

export interface AccountDAO{
	getAccountByEmail(email: string): Promise<any>
	getAccountById(accountId: string): Promise<any>
	saveAccount(account: any): Promise<any>
}

export class AccountDAODatabase implements AccountDAO{
	 async getAccountByEmail (email: string){
		const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16");
		const [acc] = await connection.query("select * from branas_16.account where email = $1", [email]);
		await connection.$pool.end();
		return acc
	}
	
	 async getAccountById(accountId: string){
		const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
		const [account] = await connection.query("select * from branas_16.account where account_id = $1", [accountId])
		await connection.$pool.end()
		return account
	}
	
	 async saveAccount(account: any){
		const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
		await connection.query("insert into branas_16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
		await connection.$pool.end()
	}

}

export class AccountDAOMemory implements AccountDAO {
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


