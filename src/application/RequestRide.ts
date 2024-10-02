import { AccountRepository } from "../resources/AccountRepository";
import RideDAO from "../resources/RideRepository";
import Ride from "./Ride";

export default class RequestRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideDAO: RideDAO){}
    async execute(input: Input): Promise<Output>{
        console.log(input)
        const account = await this.accountRepository.getAccountById(input.passengerId)
        if(!account.isPassenger) throw new Error('Account is not a passenger')
        const hasActiveRide = await this.rideDAO.hasActiveRideByPassengerId(input.passengerId)
        console.log("hasActiveRide", hasActiveRide)
        if(hasActiveRide) throw new Error('Passenger already has an active ride')
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong)
        await this.rideDAO.saveRide(ride)
        return {
            rideId: ride.rideId
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