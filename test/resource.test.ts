import crypto from 'crypto'
import { AccountRepositoryDatabase } from '../src/resources/AccountRepository'
import Account from '../src/application/Account'

test("Deve salvar um registro na tabela account e consultar por ID", async function(){
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "87748248800", "", true, false)
    const accountRepository = new AccountRepositoryDatabase()
    await accountRepository.saveAccount(account)
    const accountRepositoryById = await accountRepository.getAccountById(account.accountId)
    expect(accountRepositoryById.accountId).toBe(account.accountId)
    expect(accountRepositoryById.name).toBe(account.name)
    expect(accountRepositoryById.email).toBe(account.email)
    expect(accountRepositoryById.cpf).toBe(account.cpf)
})

test("Deve salvar um registro na tabela account e consultar por e-mail", async function(){
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "87748248800", "", true, false)
    const accountRepository = new AccountRepositoryDatabase()
    await accountRepository.saveAccount(account)
    const accountRepositoryByEmail = await accountRepository.getAccountByEmail(account.email)
    expect(accountRepositoryByEmail?.accountId).toBe(account.accountId)
    expect(accountRepositoryByEmail?.name).toBe(account.name)
    expect(accountRepositoryByEmail?.email).toBe(account.email)
    expect(accountRepositoryByEmail?.cpf).toBe(account.cpf)
})