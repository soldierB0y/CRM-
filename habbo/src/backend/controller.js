import { apartmentModel, UserModel } from "./model"


export const checkLogin=async (userInfo)=>{
    try {
    const result= await UserModel.findOne({where:{username:userInfo.user,password:userInfo.pass}})
    console.log(result);
    if(result!= null )
    {
        return {result:1, messsage:'success'}
    }
    else
    {
        return {result:0, messsage:'failed'}
    }
        
    } catch (error) {
        console.log(error);
        return {result:-1, message:error}
    }

}

export const createApartment=async(apartment)=>{
    try {
        const result= await apartmentModel.create({
            name:apartment.name,
            rent: apartment.rent,
            tenant: apartment.tenant,
            location:apartment.location,
            locationUrl: apartment.locationUrl
        })
            console.log(result);
        if(result!= null )
        {
            return {result:1, messsage:'success'}
        }
        else
        {
            return {result:0, messsage:'failed'}
        }
    } catch (error) {
        console.log(error);
        return {result:-1, message:error}
    }

}