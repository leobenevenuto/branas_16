import { getAccount } from "../src/application"
import { getAccountByEmail, getAccountById, saveAccount } from "../src/resource"
import crypto from 'crypto'

test("Deve salvar um registro na tabela account", async function(){
    const account = {
        accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    await saveAccount(account)
    const savedAccount = await getAccountById(account.accountId)
    expect(savedAccount.account_id).toBe(account.accountId)
    expect(savedAccount.name).toBe(account.name)
    expect(savedAccount.email).toBe(account.email)
    expect(savedAccount.cpf).toBe(account.cpf)
})

test("Deve salvar um registro na tabela account e consultar por e-mail", async function(){
    const account = {
        accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    await saveAccount(account)
    const savedAccount = await getAccountByEmail(account.email)
    expect(savedAccount.account_id).toBe(account.accountId)
    expect(savedAccount.name).toBe(account.name)
    expect(savedAccount.email).toBe(account.email)
    expect(savedAccount.cpf).toBe(account.cpf)
})