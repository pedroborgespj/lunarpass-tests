export interface LunarBase {
    id: string,
    name: string,
    shortName: string,
    tagline: string,
    description: string,
    imageUrl: string | null,
    sortOrder: number,
    isActive: boolean
}

export interface Mission {
    id: string,
    rocket: string,
    baseId: string,
    departureDate: string,
    returnDate: string,
    price: number
}

export interface Reservation {
    id: string,
    userId: string | null,
    missionId: string,
    reservationCode: string,
    contactEmail: string,
    totalPrice: number,
    status: string
}

export interface Ticket {
    id: string,
    reservationId: string,
    missionId: string,
    seat: string,
    fullName: string,
    document: string
}
