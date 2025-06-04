import { PrismaClient } from "@prisma/client";
import { User } from "../models/UserModel";
import { Provider } from "../models/ProviderModel";
const prisma = new PrismaClient();

    export const setUserInfo=async(user : User)=>{
        await prisma.userInformation.create({
            data :{
                firstname : user.firstname,
                lastname : user.lastname,
                email : user.email,
                created_on : new Date(),
                modified_on: new Date()   
            } 
        })
    }
    export const getUserInfo=async()=>{
       return await prisma.userInformation.findMany()
    }

    export const setProvider=async(provider : Provider)=>{
        const createProvider = await prisma.provider_Info.create({
            data: {
                user_id: provider.userId,
                ServiceName: provider.serviceName
            }
        })
        await prisma.availability.createMany({
            data: provider.availability.map(avail => ({
                provider_id: createProvider.id,
                Day: avail.day,
                Start_time: avail.startTime,
                End_time: avail.endTime
            }))
        });
    }

    export const getProvider=async()=>{
        return await prisma.provider_Info.findMany({
            include: {
                availability: true
            }
        })
    }
