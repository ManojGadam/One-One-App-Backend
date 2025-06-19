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
    const userInfo = yield prisma.userInformation.create({
        data: {
            name: user.name,
            email: user.email,
            created_on: new Date(),
            modified_on: new Date()
        }
    });
    return userInfo.id;
});
exports.setUserInfo = setUserInfo;
const getUserInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.userInformation.findMany();
});
exports.getUserInfo = getUserInfo;
const setProvider = (provider) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("provider", provider);
    if (provider.id) {
        const existingUser = yield prisma.userInformation.findUnique({
            where: { id: provider.id }
        });
        if (existingUser) {
            // Update existing user information
            yield prisma.provider_Info.update({
                where: { id: provider.id },
                data: {
                    ServiceName: provider.serviceName,
                }
            });
        }
    }
    const createProvider = yield prisma.provider_Info.create({
        data: {
            user_id: provider.userId,
            ServiceName: provider.serviceName
        }
    });
    for (const avail of provider.availability) {
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
                    provider_id: createProvider.id,
                    Day: avail.day,
                    Start_time: avail.startTime,
                    End_time: avail.endTime
                }
            });
        }
    }
    //     await prisma.availability.createMany({
    //     data: provider.availability.map(avail => ({
    //         provider_id: createProvider.id,
    //         Day: avail.day,
    //         Start_time: avail.startTime,
    //         End_time: avail.endTime
    //     }))
    // });
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
