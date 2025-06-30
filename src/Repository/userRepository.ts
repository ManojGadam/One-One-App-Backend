import {  Prisma, PrismaClient } from "@prisma/client";
import { User } from "../models/UserModel";
import { Provider } from "../models/ProviderModel";
const prisma = new PrismaClient();

    export const setUserInfo=async(user : User)=>{
       const userInfo = await prisma.userInformation.create({
            data :{
                name : user.name,
                email : user.email,
                created_on : new Date(),
                modified_on: new Date()   
            } 
        })
        return userInfo.id;
    }
    export const getUserInfo=async()=>{
       return await prisma.userInformation.findMany()
    }

export const setProvider = async (provider: Provider) => {
    console.log(provider, provider.user_id, typeof (provider.user_id));
        let providerRecord;
    providerRecord = await prisma.provider_Info.findUnique({
        where: { user_id: provider.user_id }
        });
        console.log(providerRecord);
        if(providerRecord){
            // Update existing user information
            await prisma.provider_Info.update({
                where: { id: provider.id },
                data: {
                    ServiceName: provider.serviceName,
                }
            });
        }
        else {
          providerRecord = await prisma.provider_Info.create({
                data: {
                    user_id: provider.user_id,
                    ServiceName: provider.serviceName
                }
            });
        }

        for(const avail of provider.availability) {
        console.log(avail.day,avail)
                if(avail.id){
                    await prisma.availability.update({
                        where: { id: avail.id },
                        data: {
                            Day: avail.day,
                            Start_time: avail.startTime,
                            End_time: avail.endTime
                        }
                    });
                }else{
                    await prisma.availability.create({
                        data: {
                            provider_id: providerRecord.id,
                            Day: avail.day,
                            Start_time: avail.startTime,
                            End_time: avail.endTime
                        }
                    });
                }
            }

     
       
    }

    export const getProvider=async()=>{
        return await prisma.provider_Info.findMany({
            include: {
                availability: true
            }
        })
    }
