import crypto from 'crypto'
import { AccountRepositoryDatabase } from '../src/resources/AccountRepository'

test("Deve salvar um registro na tabela account e consultar por ID", async function(){
    const account = {
        accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    const accountRepository = new AccountRepositoryDatabase()
    await accountRepository.saveAccount(account)
    const accountRepositoryById = await accountRepository.getAccountById(account.accountId)
    expect(accountRepositoryById.account_id).toBe(account.accountId)
    expect(accountRepositoryById.name).toBe(account.name)
    expect(accountRepositoryById.email).toBe(account.email)
    expect(accountRepositoryById.cpf).toBe(account.cpf)
})

test("Deve salvar um registro na tabela account e consultar por e-mail", async function(){
    const account = {
        accountId: crypto.randomUUID(),
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    const accountRepository = new AccountRepositoryDatabase()
    await accountRepository.saveAccount(account)
    const accountRepositoryByEmail = await accountRepository.getAccountByEmail(account.email)
    expect(accountRepositoryByEmail.account_id).toBe(account.accountId)
    expect(accountRepositoryByEmail.name).toBe(account.name)
    expect(accountRepositoryByEmail.email).toBe(account.email)
    expect(accountRepositoryByEmail.cpf).toBe(account.cpf)
})