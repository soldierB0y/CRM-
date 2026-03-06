import {apartmentModel, monthlyBillsModel, paymentsModel, tenantModel, UserModel } from "./model"

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

export const getUsers=async()=>{
    try {
        const res= await UserModel.findAll();
        const users=[];
        res.map(u=>{ users.push(u.dataValues) });
        return {result:true, object:users};
    } catch (error) {
        console.log(error);
        return {result:false, object:[], message:error};
    }
}

export const createUser=async(data)=>{
    try {
        const existing= await UserModel.findOne({where:{username:data.username}});
        if(existing!=null) return {result:false, message:'Usuario ya existe'};
        await UserModel.create({username:data.username, password:data.password});
        return {result:true, message:'Creado exitosamente'};
    } catch (error) {
        console.log(error);
        return {result:false, message:error};
    }
}

export const deleteUser=async(IDUser)=>{
    try {
        const res= await UserModel.destroy({where:{IDUser:IDUser}});
        return res>0;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const updateUserPassword=async(IDUser, newPassword)=>{
    try {
        const res= await UserModel.update({password:newPassword},{where:{IDUser:IDUser}});
        return res>0;
    } catch (error) {
        console.log(error);
        return false;
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
            rentalDate:apartment.rentalDate,
            maintenance: apartment.maintenance,
            electricity: apartment.electricity
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

export const getApartments2=async ()=>{
    try {
    const apartamentos= await apartmentModel.findAll();
    const ap= []
        apartamentos.map(a=>{
            const element= a.dataValues;
            ap.push(element);
        })

    console.log('ap',ap)
    return{result:1,object:ap,message:"extraido exitosamente"}
    }
    catch(err)
    {
        console.log(err)
        return{result:0,object:[],message:err}
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
        if(res != null)
            return res
        else
            return null
    } catch (error) {
        console.log(error)
        return null
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

export const findBill= async (IDBill)=>{
    const res= await monthlyBillsModel.findOne({where:{IDMonthlyBill:IDBill}});
    if (res)
    {
        try {
            return{result:true,object:res.dataValues,message:'encontrado exitosamente'};            
        } catch (error) {
            return {result:false, object:[],message:error} 
        }
    }
    else
        return {result:false, object:[],message:'no se puedo encontrar factura'}

}

export const deleteLastDateBill = async (IDBill)=>{
    let  res = await findBill(IDBill);
    if (res.result==true) 
    {
        try {
            res= await  getApartments2();
            if(res.result==true)
            {
                 
            }


        } catch (error) {
            return {result:false,message:error}
        }
    }
    else
    {
        console.log(res.message);
        return {result:false,messsage:'error al eliminar registro'}
    }

}

export const deleteMonthlyBill= async(IDMonthlyBill)=>{
    try {
        let  res= await monthlyBillsModel.destroy({where:{IDMonthlyBill:IDMonthlyBill}});
        console.log('delete bill:', res);
        const resDelPay= await  deletePaymentsCascade(IDMonthlyBill);
        
        if (res > 0 && resDelPay.result==true)
        {
            return true
        }
        else return false
    } catch (error) {

        console.log(error)
        return false
        
    }


}
//bills
export const createBills=async ()=>{
    console.log("CREATE BILLS ");
    let  res= await getApartments2();
    const apartments= res.result==true?res.object:[];
    res=  await getBills();
    const bills= res.result==true?res.object:[];

    const today= new Date();
    const currentDay= today.getDate();
    const currentMonth= today.getMonth()+1;
    const currentYear= today.getFullYear();
    console.log('today',{currentDay,currentMonth,currentYear});
    const IDAPBG= [];

    console.log('   RECORRIENDO APARTAMENTOS')
    for(const apartment of apartments)
    {
        const payDay= apartment.paymentDay;
        const IDApartment= apartment.IDApartment;
        const ApartmentBills= bills.filter(b=> b.IDApartment==IDApartment);

        const currentMonthStr = String(currentMonth).padStart(2, '0');
        const payDayStr = String(payDay).padStart(2, '0');
        const payDate = `${currentYear}-${currentMonthStr}-${payDayStr}`;

        console.log('       Apartment:', IDApartment, '| payDay:', payDay);

        // Fuente de verdad: verificar si ya existe una factura creada este mes/año
        const alreadyBilledThisPeriod = ApartmentBills.some(b => {
            const created = new Date(b.createdAt);
            return !isNaN(created.getTime()) &&
                   created.getFullYear() === currentYear &&
                   (created.getMonth() + 1) === currentMonth;
        });

        if(alreadyBilledThisPeriod)
        {
            console.log('       Ya existe factura para este periodo → omitiendo');
            continue;
        }

        if(currentDay >= payDay)
        {
            console.log('       Generando factura (dia', currentDay, '>= payDay', payDay, ')');
            try {
                await monthlyBillsModel.create({debt:apartment.rent, IDApartment, day:payDay, state:0});
                IDAPBG.push(IDApartment);
                await updateLDBG(IDApartment, payDate);
            } catch (error) {
                console.log(error);
            }
        }
        else
        {
            console.log('       Dia actual (', currentDay, ') < payDay (', payDay, ') → esperando');
        }
    }

    return {result:true, generated:IDAPBG};
}

const updateLDBG=async (IDApartment,payDate)=>{
    console.log('ejecutando UPDATE LDBG')
    try {
        const lastDateBillGenerated= payDate;
        console.log(lastDateBillGenerated);
        console.log(IDApartment)
        const res= await apartmentModel.update(
          { lastDateBillGenerated: lastDateBillGenerated },
          { where: { IDApartment: IDApartment } }
        );
        return {result:true}
    } catch (error) {
        console.log(error);
        return {result:false}
    }
    
}
export const payBill= async (data)=>{
    const {IDFactura,dineroPagado,payerName}= data
    const d= {IDMonthlyBill:IDFactura,amount:dineroPagado,payerName:payerName}
    try {
        const res= await paymentsModel.create(d)
        
        console.log(res)
        return {result: true,message:"Registrado exitosamente"};
    } catch (error) {
        return {result: false, message:error}
    }
}


//payments 

export const getPayments= async()=>{
    try {
        const res= await paymentsModel.findAll();
        const payments=[];
        console.log(res)
        for (let pay of  res)
        {
            payments.push(pay.dataValues)   
        }
        return {result:true,object:payments,message:"Extraido con exito"}
    } catch (error) {
        return {result:false,object:null,message:error}
    }
}

export const updateBillState=async ()=>{
    try {
        let res= await getPayments();
        const payments=res.result==true?res.object:[];
        res= await getBills();
        const bills=res.result==true?res.object:[];
        const IDBillsPayed= [];
        for(const b of bills)
        {
            const id= b.IDMonthlyBill
            const amount= b.debt;
            for( const p of payments)
            {
                if(p.IDMonthlyBill==id && p.amount==amount)
                {
                    IDBillsPayed.push(b.IDMonthlyBill);
                }
                    
            }
        }
        //console.log("PAYED BILLS:",IDBillsPayed)
        if (IDBillsPayed.length > 0)
        {
            const state= 1;
            const unicPayedBills=[]; 
            IDBillsPayed.map(bp=>{
                const ID= bp;
                let isRepited=false;
                for(const b of unicPayedBills)
                {
                    if(b!= undefined && b != null)
                    {
                        if(b==ID)
                        {
                            isRepited=true; 
                            break;
                        }
                    }
                }
                if(isRepited==false)
                {
                    unicPayedBills.push(ID);
                }
            })
            console.log("UNIC PAYED BILLS ",unicPayedBills)
            if(unicPayedBills.length > 0)
            {
                unicPayedBills.map(async upb=>{
                    const res= await monthlyBillsModel.update({ state: 1 }, { where: { IDMonthlyBill: upb } });
                    return {result:true, object:res,message:"Modificado Exitosamente"}
                })
            }
            else
            {
                return {result:false, object:null,message:"No existen facturas pagadas"}
            }
        }
        else
        {
            return{result:false,object:[],message:"No hay facturas ni pagadas ni abonadas"}
        }

    } catch (error) {
        console.log(error)
        return {result:false,object:null, message:error}
    }
}

export const deletePaymentsCascade= async (IDMonthlyBill)=>{
    try {
            let res= await getPayments();
            if(res.result==true)
            {
                const payments= res.object;
                console.log("DEL PAYS THE PAYMENT",payments);
                for(const p of payments)
                {
                    console.log("???",[p.IDMonthlyBill,IDMonthlyBill])
                    if(p.IDMonthlyBill==IDMonthlyBill)
                    {
                        const resDel = await paymentsModel.destroy({ where: { IDPaymentModel: p.IDPaymentModel } });
                        console.log("DELETED PAYMENT ", p.IDPaymentModel);
                    }
                }
            }
            // Return true whether or not there were related payments - deletion of 0 payments is still success
            return{result:true,message:""}
        
    } catch (error) {
        return {result:false,message:error}   
    }

}

export const deletePayment=async(IDPayment)=>{
    try {
        const res= await paymentsModel.destroy({where:{IDPaymentModel:IDPayment}})
        return {result:true,object:[],message:"eliminado exitosamente"}
    } catch (error) {
        return {result:false,object:[],message:"Error al eliminar pago"}
    }
}