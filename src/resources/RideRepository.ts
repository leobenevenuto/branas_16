import pgp from 'pg-promise'
import Ride from '../application/Ride'

export default interface RideRepository{
    saveRide(ride: Ride): Promise<void>
    getRideById(rideId: string): Promise<Ride>
    hasActiveRideByPassengerId(passengerId: string): Promise<boolean>
}

export class RideRepositoryDatabase implements RideRepository{
    async saveRide(ride: any): Promise<void>{
        console.log("saveRide", ride)
		const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
        await connection.query("insert into branas_16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.status, ride.date]);
        await connection.$pool.end()
    }

    async getRideById(rideId: string): Promise<any>{
        const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
        const [rideData] = await connection.query("select * from branas_16.ride where ride_id = $1", [rideId])
        await connection.$pool.end()
        return Ride.restore(rideData.ride_id, rideData.passenger_id, parseFloat(rideData.from_lat), parseFloat(rideData.from_long), parseFloat(rideData.to_lat), parseFloat(rideData.to_long), rideData.status, rideData.date)
    }

    async hasActiveRideByPassengerId(passengerId: string): Promise<boolean>{
        console.log("passengerId", passengerId)
        const connection = pgp()("postgres://myuser:123456@localhost:5432/branas_16")
        const [rideData] = await connection.query("select * from branas_16.ride where passenger_id = $1 and status <> 'completed'", [passengerId])
        await connection.$pool.end()
        return !!rideData
    }
}