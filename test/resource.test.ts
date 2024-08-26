import crypto from 'crypto'
import { AccountDAODatabase } from '../src/resources/AccountDAO'

test("Deve salvar um registro na tabela account e consultar por ID", async function(){
    const account = {
        accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    const accountDAO = new AccountDAODatabase()
    await accountDAO.saveAccount(account)
    const accountDAOById = await accountDAO.getAccountById(account.accountId)
    expect(accountDAOById.account_id).toBe(account.accountId)
    expect(accountDAOById.name).toBe(account.name)
    expect(accountDAOById.email).toBe(account.email)
    expect(accountDAOById.cpf).toBe(account.cpf)
})

test("Deve salvar um registro na tabela account e consultar por e-mail", async function(){
    const account = {
        accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    const accountDAO = new AccountDAODatabase()
    await accountDAO.saveAccount(account)
    const accountDAOByEmail = await accountDAO.getAccountByEmail(account.email)
    expect(accountDAOByEmail.account_id).toBe(account.accountId)
    expect(accountDAOByEmail.name).toBe(account.name)
    expect(accountDAOByEmail.email).toBe(account.email)
    expect(accountDAOByEmail.cpf).toBe(account.cpf)
})