import { Op, where } from "sequelize";
import {apartmentModel, monthlyBillsModel, tenantModel, UserModel } from "./model"

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
            tenantID:apartment.tenantID,
            paymentDay:apartment.paymentDay,
            rentalDate:apartment.rentalDate
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

export const modifyApartment= async (data)=>{
    try {
        console.log(data.IDApartment)
        console.log(data)
        const res= await apartmentModel.update(data,{where:{IDApartment:data.IDApartment}})
        if (res > 0)
            return true
        else
            return false
    } catch (error) {
        console.log(error);
        return false;
    }
}


//Inquilinos
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

export const findTenant= async(name)=>{
    
try {
    const tenant=await tenantModel.findOne({where:{fullName:name}})
    if(tenant==null)
        return false
    else
        return true
    
} catch (error) {
    console.log(error)
    return false
}
   
    
}

//bills
export const getBills= async()=>{
    try {
        const res= await monthlyBillsModel.findAll()
        const arrBills=[];
        res.map(b=>{
            arrBills.push(b.dataValues)
        })
        const bills= arrBills
        console.log(bills)
        return {result:true,object:bills} 
    } catch (error) {
        return {result:false,object:{},error:error}
    }
}

//bills
export const createBills=async ()=>{
    const res= await getApartments(); //funcion para tomar los apartamentos
    const resBills= await getBills();// funcion para tomar las facturas
    const date= new Date()//objeto fecha
    const currentDay = date.getDate();// toma el dia actual
    

    if (res.result==1 && res.object.length  > 0)// asegura de tener los apartamentos
    {
        const arrApartments = res.object; // los toma en el array
        const apartments = [];
        arrApartments.map(apartment => {
            apartments.push(apartment.dataValues)// los separa y toma solo los dataValues
        })
        // Toma la fecha de hoy
        const today = new Date();
        // Get all bills
        const billsRes = await getBills();
        const bills = billsRes.result ? billsRes.object : []; //captura las facturas
        // Recorre todos los apartamentos y espera a que terminen las operaciones asíncronas
        let billsCreated = 0;
        let billsSkipped = 0;
        for (const a of apartments) {
            if (a.paymentDay <= currentDay) {
                // Verifica que haya pasado al menos un mes desde la creación del apartamento
                let canCreateBill = true;
                if (a.rentalDate) {
                    const creationDate = new Date(a.rentalDate);
                    const creationYear = creationDate.getFullYear();
                    const creationMonth = creationDate.getMonth(); // 0-indexed
                    const currentYear = today.getFullYear();
                    const currentMonth = today.getMonth(); // 0-indexed
                    // Solo permite crear factura si el mes actual es al menos un mes después de la creación
                    if ((currentYear === creationYear && currentMonth <= creationMonth)) {
                        canCreateBill = false;
                    }
                }
                if (!canCreateBill) {
                    billsSkipped++;
                    console.log(`El apartamento ${a.IDApartment} fue creado este mes, no se genera factura.`);
                    continue;
                }
                // Buscar si ya existe una factura para este mes y apartamento
                const billThisMonth = bills.find(b => {
                    if (b.IDApartment !== a.IDApartment || !b.createdAt) return false;
                    const billDate = new Date(b.createdAt);
                    return billDate.getFullYear() === today.getFullYear() && (billDate.getMonth() + 1) === (today.getMonth() + 1);
                });
                if (billThisMonth) {
                    billsSkipped++;
                    console.log(`Ya existe factura para el apartamento ${a.IDApartment} en este mes:`, billThisMonth);
                } else {
                    try {
                        const objBill = { IDApartment: a.IDApartment, debt: a.rent, day: a.paymentDay };
                        const res = await monthlyBillsModel.create(objBill);
                        billsCreated++;
                        console.log('Factura creada exitosamente', res);
                    } catch (error) {
                        console.log('Error al crear factura', error);
                    }
                }
            }
        }
        return {
            result: true,
            message: `Facturas creadas: ${billsCreated}, ya existentes este mes: ${billsSkipped}`
        };
    }
    else
    {
        return {result:false,error:'No existen apartamentos o hubo un error a la hora de cargarlos'}
    }
}