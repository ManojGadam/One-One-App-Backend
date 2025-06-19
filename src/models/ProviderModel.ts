import { Day } from "@prisma/client";

export class Provider{
    id : number
    userId : number
    serviceName : string
    availability : Availability[]
    constructor(id: number, userId: number, serviceName: string, availability: {id:number, day: Day, startTime: Date, endTime: Date }[]) {
        this.id = id;
        this.userId = userId;
        this.serviceName = serviceName;
        this.availability = availability;
    }
}

class Availability {
    id: number; // Optional, can be used for updates
    day: Day; // 0-6 for Sunday-Saturday
    startTime: Date;
    endTime: Date;

    constructor(id:number,day: Day, startTime: Date, endTime: Date) {
        this.id = id;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}