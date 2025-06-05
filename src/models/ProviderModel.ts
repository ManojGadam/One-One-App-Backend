export class Provider{
    id : number
    userId : number
    serviceName : string
    availability : Availability[]
    constructor(id: number, userId: number, serviceName: string, availability: { day: number, startTime: string, endTime: string }[]) {
        this.id = id;
        this.userId = userId;
        this.serviceName = serviceName;
        this.availability = availability;
    }
}

class Availability {
    day: number; // 0-6 for Sunday-Saturday
    startTime: string;
    endTime: string;

    constructor(day: number, startTime: string, endTime: string) {
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}