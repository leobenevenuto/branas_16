import { getAccount, signup } from "../src/application";


test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await signup(input)
	expect(outputSignup.accountId).toBeDefined()
	const outputGetAccount = await getAccount(outputSignup.accountId)
	expect(outputGetAccount.name).toBe(input.name)
	expect(outputGetAccount.email).toBe(input.email)
	expect(outputGetAccount.cpf).toBe(input.cpf)
});


test("Deve criar uma conta para o motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true,
		carPlate: "AAAA9999",
		isDriver: true
	};
	const outputSignup = await signup(input)
	expect(outputSignup.accountId).toBeDefined()
	const outputGetAccount = await getAccount(outputSignup.accountId)
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
	await expect(() => signup(input)).rejects.toThrow(new Error("Invalid name"))
});


