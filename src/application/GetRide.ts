import { AccountRepository } from "../resources/AccountRepository";
import RideDAO from "../resources/RideRepository";

export default class GetRide {
    constructor(readonly accountRepository: AccountRepository, readonly rideDAO: RideDAO) { }
    async execute(input: Input): Promise<Output> {
        const ride = await this.rideDAO.getRideById(input.rideId)
        const passenger = await this.accountRepository.getAccountById(ride.passengerId)
        return {
            rideId: ride.rideId,
            passengerId: ride.passengerId,
            fromLat: ride.fromLat,
            fromLong: ride.fromLong,
            toLat: ride.toLat,
            toLong: ride.toLong,
            status: ride.status,
            passengerName: passenger.name,
            passengerEmail: passenger.email
        }
    }
}

type Input = {
    rideId: string
}

type Output = {
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    passengerName: string,
    passengerEmail: string
}