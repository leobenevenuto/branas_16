import { getJSDocOverrideTagNoCache } from "typescript"
import { Signup } from "../src/application/Signup"
import { AccountDAODatabase } from "../src/resources/AccountDAO"
import { MailerGatewayMemory } from "../src/resources/MailerGateway"
import RequestRide from "../src/application/RequestRide"

test('deve solicitar uma corrida'), async () => {
    const accountDAO = new AccountDAODatabase
    const rideDAO = new RideDAODatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountDAO, mailerGateway)
    const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	}
    const outputSignup = await signup.execute(inputSignup)
    const requestRide = new RequestRide(accountDAO, rideDAO)
    const inputRequestRide = {
        passenger_id: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide)
    expect(outputRequestRide.rideId).toBeDefined()
    const getRide = new GetRide(accountDAO, rideDAO)
    const inputGetRide = {
        rideId: outputRequestRide.rideId
    }
    const outputGetRide = await getRide.execute(inputGetRide)
    expect(outputGetRide.status).toBe('requested')
    expect(outputGetRide.passengerName).toBe('John Doe')
    expect(outputGetRide.passengerEmail).toBe(inputSignup.email)
    
}


test('Não deve solicitar uma corrida se não for passageiro', async function () {
    const accountDAO = new AccountDAODatabase
    //const rideDAO = new RideDAODatabase()
    const mailerGateway = new MailerGatewayMemory()
    const signup = new Signup(accountDAO, mailerGateway)
    const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
        carPlate: 'AAA9999',
        isPassenger: true
	}
    const outputSignup = await signup.execute(inputSignup)
    const requestRide = new RequestRide(accountDAO)
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
    }
    expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Account is not a passenger'))   
})