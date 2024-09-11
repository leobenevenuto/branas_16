import { AccountDAO } from "../resources/AccountDAO";
import crypto from 'crypto'
import RideDAO from "../resources/RideDAO";

export default class RequestRide {
    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO){}
    async execute(input: Input): Promise<Output>{
        const account = await this.accountDAO.getAccountById(input.passengerId)
        if(!account.isPassenger) throw new Error('Account is not a passenger')
        // const hasActiveRide = await this.rideDAO.hasActiveRideByPassengerId(input.passengerId)
        // if(hasActiveRide) throw new Error('Passenger already has an active ride')
        const ride = {
            rideId: crypto.randomUUID(),
            passengerId: input.passengerId,
            fromLat: input.fromLat,
            fromLong: input.fromLong,
            toLat: input.toLat,
            toLong: input.toLong,
            status: 'requested',
            date: new Date()
        }
        await this.rideDAO.saveRide(ride)
        return {
            rideId: ""
        }

    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId: string
}