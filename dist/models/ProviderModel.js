"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
class Provider {
    constructor(id, userId, serviceName, availability) {
        this.id = id;
        this.userId = userId;
        this.serviceName = serviceName;
        this.availability = availability;
    }
}
exports.Provider = Provider;
class Availability {
    constructor(id, day, startTime, endTime) {
        this.id = id;
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
