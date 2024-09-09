import { GetAccount } from "../src/application/GetAccount";
import { Signup } from "../src/application/Signup";
import { AccountDAODatabase, AccountDAOMemory } from "../src/resources/AccountDAO";
import { MailerGatewayMemory } from "../src/resources/MailerGateway";
import sinon from "sinon";

let signup: Signup
let getAccount: GetAccount

beforeEach(async () => {
	const acountDAO = new AccountDAODatabase()
	const mailerGateway = new MailerGatewayMemory()
	signup = new Signup(acountDAO, mailerGateway)
	getAccount = new GetAccount(acountDAO)
})

test.only("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input)
	expect(outputSignup.accountId).toBeDefined()
	const outputGetAccount = await getAccount.execute(outputSignup)
	expect(outputGetAccount.name).toBe(input.name)
	expect(outputGetAccount.email).toBe(input.email)
	expect(outputGetAccount.cpf).toBe(input.cpf)
});


test("Deve criar uma conta para o motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false,
		carPlate: "AAAA9999",
		isDriver: true
	};
	const outputSignup = await signup.execute(input)
	expect(outputSignup.accountId).toBeDefined()
	const outputGetAccount = await getAccount.execute(outputSignup)
	expect(outputGetAccount.name).toBe(input.name)
	expect(outputGetAccount.email).toBe(input.email)
	expect(outputGetAccount.cpf).toBe(input.cpf)
	expect(outputGetAccount.car_plate).toBe(input.carPlate)
});


test("Não deve criar uma conta para o passageiro se o email for inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"))
});

test("Não deve criar uma conta para o passageiro se o cpf for inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "8774800",
		isPassenger: true,
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid CPF"))
});

test("Não deve criar uma conta para o passageiro se a conta já existe", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await signup.execute(input)
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"))
});

test("Não deve criar uma conta para o motorista se a placa for inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isDriver: true,
		carPlate: "AAAA",
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid carplate"))
});

test("Deve criar uma conta para o passageiro com stub", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const saveAccountStub = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves()
	const getAccountByEmailStub = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves(null)
	const getAccountByIdStub = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(input)
	const accountDAO = new AccountDAOMemory()
	const mailerGateway = new MailerGatewayMemory()
	const signup = new Signup(accountDAO, mailerGateway)
	const getAccount = new GetAccount(accountDAO)
	const outputSignup = await signup.execute(input)
	expect(outputSignup.accountId).toBeDefined()
	const outputGetAccount = await getAccount.execute(outputSignup)
	expect(outputGetAccount.name).toBe(input.name)
	expect(outputGetAccount.email).toBe(input.email)
	expect(outputGetAccount.cpf).toBe(input.cpf)
	saveAccountStub.restore()
	getAccountByEmailStub.restore()
	getAccountByIdStub.restore()
});


test("Deve criar uma conta para o passageiro com spy", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const sendSpy = sinon.spy(MailerGatewayMemory.prototype, "send")
	const accountDAO = new AccountDAOMemory()
	const mailerGateway = new MailerGatewayMemory()
	const signup = new Signup(accountDAO, mailerGateway)
	const getAccount = new GetAccount(accountDAO)
	const outputSignup = await signup.execute(input)
	expect(outputSignup.accountId).toBeDefined()
	const outputGetAccount = await getAccount.execute(outputSignup)
	expect(outputGetAccount.name).toBe(input.name)
	expect(outputGetAccount.email).toBe(input.email)
	expect(outputGetAccount.cpf).toBe(input.cpf)
	expect(sendSpy.calledOnce).toBe(true)
	expect(sendSpy.calledWith(input.email, "Welcome!", "")).toBe(true)
});


test.only("Deve criar uma conta para o passageiro com mock", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const sendMock = sinon.mock(MailerGatewayMemory.prototype)
	sendMock.expects("send").withArgs(input.email, "Welcome!", "").once().callsFake(() => {console.log("abc")})
	const accountDAO = new AccountDAOMemory()
	const mailerGateway = new MailerGatewayMemory()
	const signup = new Signup(accountDAO, mailerGateway)
	const getAccount = new GetAccount(accountDAO)
	const outputSignup = await signup.execute(input)
	expect(outputSignup.accountId).toBeDefined()
	const outputGetAccount = await getAccount.execute(outputSignup)
	expect(outputGetAccount.name).toBe(input.name)
	expect(outputGetAccount.email).toBe(input.email)
	expect(outputGetAccount.cpf).toBe(input.cpf)
	sendMock.verify()
});

