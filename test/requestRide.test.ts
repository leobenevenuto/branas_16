import { Signup } from "../src/application/Signup"
import { AccountRepositoryDatabase } from "../src/resources/AccountRepository"
import { MailerGatewayMemory } from "../src/resources/MailerGateway"
import RequestRide from "../src/application/RequestRide"
import { RideRepositoryDatabase } from "../src/resources/RideRepository"
import GetRide from "../src/application/GetRide"

test('deve solicitar uma corrida', async () => {
    const accountRepository = new AccountRepositoryDatabase
    const rideDAO = new RideRepositoryDatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountRepository, mailerGateway)
    const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    const outputSignup = await signup.execute(inputSignup)
    const requestRide = new RequestRide(accountRepository, rideDAO)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide)
    expect(outputRequestRide.rideId).toBeDefined()
    const getRide = new GetRide(accountRepository, rideDAO)
    const inputGetRide = {
        rideId: outputRequestRide.rideId
    }
    const outputGetRide = await getRide.execute(inputGetRide)
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId)
    expect(outputGetRide.status).toBe('requested')
    expect(outputGetRide.passengerId).toBe(outputSignup.accountId)
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat)
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong)
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat)
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong)
    
})


test('Não deve solicitar uma corrida se não for passageiro', async function () {
    const accountRepository = new AccountRepositoryDatabase
    const rideDAO = new RideRepositoryDatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountRepository, mailerGateway)
    const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
        carPlate: 'AAA9999',
        isPassenger: false
	}
    const outputSignup = await signup.execute(inputSignup)
    const requestRide = new RequestRide(accountRepository, rideDAO)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Account is not a passenger')) 
})


test('Não deve poder solicitar uma corrida se o passageiro já tiver outra corrida ativa', async () => {
    const accountRepository = new AccountRepositoryDatabase
    const rideDAO = new RideRepositoryDatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountRepository, mailerGateway)
    const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    const outputSignup = await signup.execute(inputSignup)
    const requestRide = new RequestRide(accountRepository, rideDAO)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    await requestRide.execute(inputRequestRide)
    await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Passenger already has an active ride')) 
    
    
})