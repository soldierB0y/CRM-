
import { useEffect, useState } from "react";

export const Inquilinos=()=>{
    //variables
    const [errEnv,setErrEnv]= useState('invisible');
    const [envEx,setEnvEx]= useState('invisible');
    const [delEx,setDelEx]=useState('invisible');
    const [actEx,setActEx]=useState('invisible');
    const [errCampos,setErrCampos]= useState('invisible');
    const [errRep, setErrRep]= useState('invisible')
    const today=()=>{
        const date= new Date();
        return date.toLocaleDateString('en-us');
    }
    const tenantDefault= {fullName:'',number:undefined,birthDate:today(),maritalStatus:'soltero/a',email:''};
    const [tenant,setTenant]= useState(tenantDefault);
    const [registros,setRegistros]=useState([])
    const [searchResult,setSearchResult]= useState([]);
    const [searcher,setSearcher]=useState(''); 
    const [searchFilter,setSearchFilter]=useState("fullName");
    const [selectedID,setSelectedID]= useState(-1)
    //funciones
    const limpiar= ()=>{
        setSelectedID(-1)
        setTenant({...tenant,fullName:'',number:'',birthDate:today(),maritalStatus:'soltero/a',email:'',});
    }
    const quitNot=()=>{
        if(errEnv=='visible')
            setErrEnv('invisible')

        if(envEx=='visible')
            setEnvEx('invisible')
        if(errCampos=='visible')
            setErrCampos('invisible')
        if(delEx=='visible')
            setDelEx('invisible')
        if(actEx=='visible')
            setActEx('invisible')
        if(errRep=='visible')
            setErrRep('invisible')
    }
    //funciones de render

    const reloadTenants=async()=>{
        limpiar();
        const res= await getTenants();
        const objTenant=[]
        if(res.result==1)
        {
            console.log('ok')
            res.object.map(x=>{
                console.log(x.dataValues)
                objTenant.push(x.dataValues)
            })
            console.log(objTenant)
            setRegistros(objTenant)
        }
    }

    const createTenant= async (data)=>{

        const fullName= data.fullName;
        console.log('NAME',fullName)
        const res= await findTenant(fullName)

        if (res== true)
        {
            setErrRep('visible')
            return false
        }
        else
        {
        
            const res= await window.api.createTenant(data)
            reloadTenants();
            return res;
        }
    }
    const getTenants= async ()=>{
        const res= await window.api.getTenants();
        return res;
    }
    const deleteTenant=async(ID)=>{
        const res= await window.api.deleteTenant(ID);
        console.log(res)
        return res;
    }

    const updateTenant=async(data)=>{
        const res= await window.api.updateTenant(data);
        if(res!=false)
            reloadTenants();
        console.log(res);
        return res;
    }

    //verifyTenant
    const findTenant=async(name)=>{
        const res= await window.api.findTenant(name);
        return res;
    }


    //

    useEffect(()=>{
        reloadTenants();
    },[])


    useEffect(()=>{
        setSearchResult(registros)
    },[registros])

    useEffect(()=>{
       setSearchResult(registros.filter(item=>(item[searchFilter].toUpperCase().includes(searcher.toUpperCase()))))
    },[searcher])


    return(
        <div className="principalCol colAdapt">
            <h1 className="tituloContainer">
                Inquilinos
            </h1>
            <section className="containerCover">
                <div className="apartContainer">
                    <h2>Mis Inquilinos</h2>
                    <div className="searchContainer">
                        {/*Buscador*/}
                        <span className="searchButtons">
                            <input className="searcher" type='search' placeholder="buscador"
                                value={searcher}
                                onChange={(e)=>{
                                    setSearcher(e.target.value)
                                }}
                            />
                            <select
                                onChange={(e)=>{setSearchFilter(e.target.value)}}
                                value={searchFilter}
                            >
                                <option value="fullName">nombre completo</option>
                                <option value="number">numero</option>
                                <option value="email">email</option>
                                <option value="maritalStatus">estado civil</option>
                            </select>
                        </span>
                        <table className="tableInfo">
                            <thead>
                            <tr className="mainRow">
                                <td>ID</td>
                                <td>nombre</td>
                                <td>numero</td>
                                <td>fecha de nacimiento</td>
                                <td>estado civil</td>
                                <td>correo</td>
                                <td>fecha de creacion</td>
                                <td>fecha de modificacion</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                searchResult.length > 0?
                                searchResult.map((item,index)=>(
                                    <>
                                        <tr
                                            className={selectedID==item.IDTenant?"rowSelected":""}
                                            onClick={()=>{
                                                quitNot()
                                                console.log(selectedID)
                                                setSelectedID(item.IDTenant);
                                                setTenant({...tenant,fullName:item.fullName,number:item.number,birthDate:item.birthDate,maritalStatus:item.maritalStatus,email:item.email})
                                            }}
                                            key={index}
                                        >
                                            <td>{item.IDTenant}</td>
                                            <td>{item.fullName}</td>
                                            <td>{item.number}</td>
                                            <td>{item.birthDate.toString()}</td>
                                            <td>{item.maritalStatus}</td>
                                            <td>{item.email}</td>
                                            <td>{item.createdAt.toString()}</td>
                                            <td>{item.updatedAt.toString()}</td>
                                        </tr>
                                    </>
                                )):<><tr><td>N/A</td></tr></>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="crud apartContainer">
                    <h2>Nuevo Inquilino</h2>
                    <div className="crudForm">
                        {/*Form*/}
                        {/*fullName */}
                        <input
                            type="text"
                            onChange={(e)=>{
                                setTenant({...tenant,fullName:e.target.value})
                                quitNot()
                            }}
                            value={tenant.fullName}
                            placeholder="nombre completo"
                        ></input>
                        {/*number */}
                        <input
                            type='number'
                            placeholder="numero"
                            onChange={(e)=>{
                                setTenant({...tenant,number:e.target.value})
                                quitNot()
                            }}
                            value={tenant.number}
                        ></input>
                        {/*birthDate */}
                        <input
                            type='date'
                            placeholder="fecha de nacimiento"
                            onChange={(e)=>{
                                setTenant({...tenant,birthDate:e.target.value})
                                quitNot();
                            }}
                        ></input>
                        {/*maritalStatus*/}
                        <select
                            onChange={(e)=>{
                                setTenant({...tenant,maritalStatus:e.target.value})
                                quitNot()
                            }}
                            value={tenant.maritalStatus}
                        >
                            <option value="soltero/a">soltero/a</option>
                            <option value="casado/a">casado/a</option>
                            <option value="divorciado/a">divorciado/a</option>
                            <option value="viudo/a">viudo/a</option>
                            <option value="union libre">union libre</option>
                        </select>
                        {/*email*/}
                        <input
                            placeholder="email"
                            type='email'
                            onChange={(e)=>{
                                setTenant({...tenant,email:e.target.value})
                                quitNot()
                            }}
                            value={tenant.email}
                        ></input>
                    </div>
                    <div className="buttonContainer">
                        <input type='button' value={'Agregar'} 
                            onClick={()=>{
                                quitNot()
                                if(tenant.fullName=="")
                                    setErrCampos('visible')
                                else
                                {
                                    (async()=>{
                                        const result= await createTenant(tenant)
                                        console.log('result:',result)
                                        if (result!=false)
                                        {
                                            setEnvEx('visible')
                                        }

                                    })()

                                }
                            }}
                        />
                        <input type='button' value={'Modificar'}
                            onClick={()=>{
                                quitNot()
                                if (selectedID >= 0)
                                {
                                    (
                                        async()=>{
                                            const objTenant= tenant;
                                            objTenant['IDTenant']= selectedID
                                            const res= await updateTenant(objTenant);
                                            if(res!=false)
                                            {
                                                setActEx('visible');
                                            }
                                            else
                                            {
                                                setErrEnv('visible')
                                            }

                                        }
                                    )()
                                }
                            }}
                        />
                        <input type='button' value={'Eliminar'}
                            onClick={()=>{
                                quitNot()
                                if(selectedID >=0)
                                {
                                    (
                                        async()=>{
                                            const res= await deleteTenant(selectedID);
                                            if (res==false)
                                            {
                                                setDelEx('visible')
                                                reloadTenants();
                                            }
                                            else
                                                setErrEnv('visible')
                                        }
                                    )()
                                }
                            }}
                        />
                        <input type='button' value={'Limpiar'}
                            onClick={()=>{
                                limpiar()
                                quitNot()
                            }}
                        />
                    </div>
                    <p className={envEx}>Agregado Exitosamente!</p>
                    <p className={delEx}>Eliminado Exitosamente!</p>
                    <p className={actEx}>Actualizado Exitosamente!</p>
                    <p className={errEnv}>Intentelo Nuevamente!</p>
                    <p className={errCampos}>Rellene los Campos</p>
                    <p className={errRep}>Ya existe un inquilino con este nombre</p>
                </div>
            </section>

        </div>

    )
}