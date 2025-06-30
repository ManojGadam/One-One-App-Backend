"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvider = exports.setProvider = exports.getUserInfo = exports.setUserInfo = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const setUserInfo = (user) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.userInformation.create({
        data: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            created_on: new Date(),
            modified_on: new Date()
        }
    });
});
exports.setUserInfo = setUserInfo;
const getUserInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.userInformation.findMany();
});
exports.getUserInfo = getUserInfo;
const setProvider = (provider) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(provider, provider.user_id, typeof (provider.user_id));
    let providerRecord;
    providerRecord = yield prisma.provider_Info.findUnique({
        where: { user_id: provider.user_id }
    });
    console.log(providerRecord);
    if (providerRecord) {
        // Update existing user information
        yield prisma.provider_Info.update({
            where: { id: provider.id },
            data: {
                ServiceName: provider.serviceName,
            }
        });
    }
    else {
        providerRecord = yield prisma.provider_Info.create({
            data: {
                user_id: provider.user_id,
                ServiceName: provider.serviceName
            }
        });
    }
    for (const avail of provider.availability) {
        console.log(avail.day, avail);
        if (avail.id) {
            yield prisma.availability.update({
                where: { id: avail.id },
                data: {
                    Day: avail.day,
                    Start_time: avail.startTime,
                    End_time: avail.endTime
                }
            });
        }
        else {
            yield prisma.availability.create({
                data: {
                    provider_id: providerRecord.id,
                    Day: avail.day,
                    Start_time: avail.startTime,
                    End_time: avail.endTime
                }
            });
        }
    }
});
exports.setProvider = setProvider;
const getProvider = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.provider_Info.findMany({
        include: {
            availability: true
        }
    });
});
exports.getProvider = getProvider;
