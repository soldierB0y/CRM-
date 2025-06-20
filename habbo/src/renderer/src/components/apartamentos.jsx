import { useState,useEffect } from "react"

export const Apartamentos=()=>{

    //variables
    const [apartament, setApartament]= useState({name:"",rent:undefined,location:"",locationUrl:"",tenantName:"",inversion:undefined,description:"",tenantID:undefined})
    const [tenants,setTenants]= useState([]); 
    const [errEnv,setErrEnv]= useState('invisible');
    const [envEx,setEnvEx]= useState('invisible');
    const [delEx,setDelEx]=useState('invisible');
    const [errDel,setErrDel]=useState('invisible');
    const [errCampos,setErrCampos]= useState('invisible');
    const [registros,setRegistros]=useState([])
    const [searchResult,setSearchResult]= useState([]);
    const [searchFilter,setSearchFilter]=useState("name");
    const [selectedID,setSelectedID]= useState(-1)
    //funciones
    const limpiar= ()=>{
        setSelectedID(-1)
        setApartament({...apartament,name:'',rent:'',tenantName:"",location:'',locationUrl:'',inversion:'',description:""})
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
    }
    //funciones de render
    const createApartment = async (data) => {
        const res = await window.api.createApartment(data);
        return res
    };

    const getApartments= async()=>{
        const res= await window.api.getApartments();
        if (res.result==1)
        {
            return res.object
        }
    }
    //eliminar apartamento
    const deleteApartment= async(IDApartment)=>{
        const res= await window.api.deleteApartment(IDApartment)
        if(res==true)
        {
            return true
        }
        else
        {
            console.log('err');
            return false;
        }
    }
    //recargar
    const reloadApartment= async()=>{
            limpiar();
            const res= await getApartments();
            const objArray= []

            if (res!= undefined || res !=false)
            {
                console.log(true)
                res.map((item)=>{
                    objArray.push(item.dataValues)
                })

                setRegistros(prev=>({...prev,objArray}))
            }
            else
            {
                console.log(false);
            }
        }

    //cargar Apartamentos
    useEffect(()=>{
        reloadApartment()
    },[])

    //cargar Inquilinos
    useEffect(()=>{
        (
            async()=>{
                const res= await window.api.getTenants();
                if(res.result==true)
                {
                    const objTenants= res.object
                    const arrayTenants= []
                    objTenants.map((item)=>{
                        arrayTenants.push(item.dataValues)
                    })
                    setTenants(arrayTenants)
                }
            }
        )()
    },[])

    useEffect(()=>{
        setSearchResult(registros.objArray)
    },[registros])





    return(
        <div className="principalCol colAdapt">
            <h1 className="tituloContainer">
                            Apartamentos
            </h1>
            <section className="containerCover">
                <div className="apartContainer">
                    <h2>Mis Apartamentos</h2>
                    <div className="searchContainer">
                        {/*Buscador */}
                        <span className="searchButtons">
                        <input className="searcher" type='search' placeholder="buscar"
                            onChange={(e)=>{
                                setSearchResult(
                                    registros.objArray.filter((item)=>item[searchFilter].toString().toLowerCase().includes(e.target.value))
                                )
                            }}
                        />
                        <select onChange={(e)=>{setSearchFilter(e.target.value)}} value={searchFilter}>
                            <option value={"name"}>nombre</option>
                            <option value={"rent"}>renta</option>
                            <option value={"tenantName"}>Inquilino</option>
                            <option value={"location"}>Ubicacion</option>
                        </select>
                        </span>
                        <table className="tableInfo">
                            <thead>
                            <tr className="mainRow">
                                <td>ID</td>
                                <td>nombre</td>
                                <td>renta</td>
                                <td>Inquilino</td>
                                <td>Inversion</td>
                                <td>Descripcion</td>
                                <td>Retorno</td>
                                <td>Ubicacion</td>
                                <td>UbiURL</td>
                                <td>Creacion</td>
                                <td>Modificacion</td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                           searchResult!=null && searchResult!=undefined && searchResult.length >0?                           
                            searchResult.map((item,index)=>(
                                <>
                                    <tr 
                                    onClick={(e)=>{
                                        setApartament({apartament,name:item.name,rent:item.rent,tenantName:item.tenantName,inversion:parseFloat(item.inversion),description:item.description,location:item.location,locationUrl:item.locationURL});
                                        setSelectedID(parseInt(item.IDApartment))
                                        console.log(selectedID)
                                    }}
                                    key={index}>
                                            <td>{item.IDApartment}</td>
                                            <td>{item.name}</td>
                                            <td>{item.rent}</td>
                                            <td>{item.tenantName}</td>
                                            <td>{item.inversion}</td>
                                            <td>{item.description}</td>
                                            <td>{item.revenue}</td>
                                            <td>{item.location}</td>
                                            <td>{item.locationURL}</td>
                                            <td>{item.createdAt.toString()}</td>
                                            <td>{item.updatedAt.toString()}</td>
                                    </tr>
                                </>
                            )):<></>
                        }
                        </tbody>
                            
                        </table>
                    </div>
                </div>
                <div className="crud apartContainer">
                    <h2>Nuevo Apartamento</h2>
                    {/*Form*/}
                    <div className="crudForm">
                    {/*Nombre*/}
                        <input value={apartament.name}
                            onChange={(e)=>{
                                setApartament({...apartament,name:e.target.value})
                                quitNot()
                            }}
                        type="text" placeholder="nombre"/>
                    {/*renta*/}
                        <input
                            onChange={(e)=>{
                                setApartament({...apartament,rent:e.target.value})
                                quitNot()
                            }}
                        value={apartament.rent} type="number" placeholder="renta"/>
                    {/*Inquilino*/}
                        <select 
                            onChange={(e)=>{
                                setApartament({...apartament,tenantName:e.target.value})
                                quitNot();
                            }}
                        value={apartament.tenantName}>
                            <option value="">Inquilino</option>
                            {
                                tenants.map((item,index)=>(<>
                                    <option onSelect={()=>{
                                        setApartament({...apartament,tenantID:item.IDTenant})
                                    }} value={item.fullName} key={index}>{item.fullName}</option>
                                </>))
                            }
                        </select>
                    {/*Location*/}
                        <input
                            onChange={(e)=>{
                                setApartament({...apartament,location:e.target.value})
                                quitNot()
                            }}
                        value={apartament.location} type="text" placeholder="ubicacion"/>
                    {/*LocationURL*/}
                        <input
                            onChange={(e)=>{
                                setApartament({...apartament,locationUrl:e.target.value})
                                quitNot()
                            }}
                        value={apartament.locationUrl} type="text" placeholder="URL ubicacion" />
                    {/*Inversion*/}
                        <input
                            placeholder="inversion"
                            type="number"
                            onChange={(e)=>{
                                setApartament({...apartament,inversion:e.target.value})
                                quitNot()
                            }}
                            value={apartament.inversion}
                        />
                        <textarea placeholder="descripcion"
                            onChange={(e)=>{
                                setApartament({...apartament,description:e.target.value})
                            }}
                            value={apartament.description}
                        ></textarea>
                    </div>
                    <div className="buttonContainer">
                        <input
                            onClick={()=>{
                                if(apartament.name!="" && apartament.rent!="")
                                (async ()=>{
                                    console.log(apartament)
                                    const result= await createApartment(apartament);
                                    console.log('THE RESULT',result)
                                    if (result==true)
                                    {
                                        reloadApartment();
                                        setEnvEx('visible')
                                    }
                                    else
                                    {
                                        setErrEnv('visible')
                                    }
                                })()
                                else
                                setErrCampos('visible')
                            }}
                        type="button" value={'Agregar'}/>
                        <input type="button" value={'Modificar'}/>
                        <input type="button" value={'Eliminar'}
                            onClick={()=>{
                                if(selectedID >0)
                                {
                                    ( async ()=>{
                                        
                                        
                                        const res = await deleteApartment(selectedID);
                                        if(res)
                                        {
                                            setDelEx('visible')
                                            quitNot()
                                        }
                                        else
                                            setErrEnv('visible')
                                        
                                    })()
                                    reloadApartment();
                                }
                                else
                                {
                                    console.log('lower',selectedID)
                                }
                            }}
                        />
                        <input
                            onClick={()=>{
                                limpiar();
                            }}
                        type="button" value={'Limpiar'}/>
                    </div>
                    <p className={envEx}>Agregado Exitosamente!</p>
                    <p className={delEx}>Eliminado Exitosamente!</p>
                    <p className={errEnv}>Intentelo Nuevamente!</p>
                    <p className={errCampos}>Rellene los Campos</p>
                </div>
            </section>
        </div>
    )
}