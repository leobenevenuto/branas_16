import { GetAccount } from "../src/application/GetAccount";
import { Signup } from "../src/application/Signup";
import { AccountDAODatabase, AccountDAOMemory } from "../src/resources/AccountDAO";

let signup: Signup
let getAccount: GetAccount

beforeEach(async () => {
	const acountDAO = new AccountDAODatabase()
	signup = new Signup(acountDAO)
	getAccount = new GetAccount(acountDAO)
})

test("Deve criar uma conta para o passageiro", async function () {
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


test("Não deve criar uma conta para o passageiro se o nome for inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"))
});


