import { apartmentModel, tenantModel, UserModel } from "./model"


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


//apartment

export const createApartment=async(apartment)=>{
    console.log('THE APARTMENT',apartment)

    try {
        const result= await apartmentModel.create({
            name:apartment.name,
            rent: apartment.rent,
            tenantName: apartment.tenantName,
            location:apartment.location,
            locationUrl: apartment.locationUrl,
            inversion:apartment.inversion,
            description:apartment.description,
            tenantID:apartment.tenatID
        })
            console.log('controller',result);
        if(result!= null )
        {
            console.log()
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

export const getApartments=async ()=>{
    try {
    const apartamentos= await apartmentModel.findAll();
        if(apartamentos!=null && apartamentos!=undefined)
        {
            return {result:1,object:apartamentos};
        }
        else
        {
            throw new Error("Not Found")
        }
    } catch (error) {
        return {result:0,error:error};
    }

}

export const deleteApartment=async(IDApartment)=>{
    try {
        const res= await apartmentModel.destroy({where:{IDApartment:IDApartment}});
        console.log('result delete',res)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export const createTenant= async(tenant)=>{
   console.log('THE TENANT',tenant)

    try {
        const result= await tenantModel.create({
            fullName:tenant.fullName,
            number: tenant.number,
            birthDate: tenant.birthDate,
            maritalStatus:tenant.maritalStatus,
            email: tenant.email,
        })
            console.log('controller',result);
        if(result!= null )
        {
            console.log()
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

export const getTenants=async ()=>{
    try {
    const tenants= await tenantModel.findAll();
        if(tenants!=null && tenants!=undefined)
        {
            return {result:1,object:tenants};
        }
        else
        {
            throw new Error("Not Found")
        }
    } catch (error) {
        return {result:0,error:error};
    }

}

export const deleteTenant=async (ID)=>{
    try {
        console.log('THE ID',ID)
        const res= await tenantModel.destroy({where:{IDTenant:ID}})
        if (res> 0)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

export const getTenant=async (ID)=>{
    try {
        console.log('THE ID',ID)
        const res= await tenantModel.findOne({where:{IDTenant:ID}})
        if(res > 0)
            return res
        else
            return 0
    } catch (error) {
        
    }
}

export const updateTenant=async(data)=>{
    try {
        console.log('THE DATA',data);
        const res= await tenantModel.update(data,{where:{IDTenant:data.IDTenant}})
        if(res > 0)
            return true
        else 
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}