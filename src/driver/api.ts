import express from "express";
import { Signup} from "../application/Signup";
import {GetAccount} from "../application/GetAccount";
import { AccountRepositoryDatabase } from "../resources/AccountRepository";
import { MailerGatewayMemory } from "../resources/MailerGateway";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
		try{
			const accountRepository = new AccountRepositoryDatabase()
			const mailerGateway = new MailerGatewayMemory()
			const signup = new Signup(accountRepository, mailerGateway)
			const output = await signup.execute(req.body)
			res.json(output)
		}catch(error: any){
			res.status(422).json({
				message: error.message
			})
		}
		
});

app.get("/accounts/:accountId", async function (req, res){
	const accountRepository = new AccountRepositoryDatabase()
	const getAccount = new GetAccount(accountRepository)
	const input = {
		accountId: req.params.accountId
	}
	const account = await getAccount.execute(input)
	res.json(account)
})

app.listen(3000);
