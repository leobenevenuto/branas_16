export default interface RideDAO {
    saveRide(ride: any): Promise<void>
    hasActiveRideByPassengerId(passengerId: string): Promise<boolean>
}