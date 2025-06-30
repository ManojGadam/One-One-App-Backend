
export interface Provider{
    id : number
    user_id : number
    serviceName : string
    availability: Availability[]
}

interface Availability {
    id: number; // Optional, can be used for updates
    day: number; // 0-6 for Sunday-Saturday
    startTime: string;
    endTime: string;
}