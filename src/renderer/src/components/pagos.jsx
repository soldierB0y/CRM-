import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"


export const Pagos=()=>{
    const location= useLocation()
    const {IDMonthlyBill}= location.state || -1;
    const [searchResult,setSearchResult]= useState([])
    const [envPay, setEnvPay]= useState('invisible');
    const [errPay, setErrPay]=useState('invisible');
    const [Del,setDel]= useState('invisible');
    const [payments,setPayments]= useState([])

    useEffect(()=>{
        (
            async ()=>{
                const res= await window.api.getPayments();
                if(res.result==true)
                {
                    setPayments(res.object)
                }
                else
                {
                    console.log(res.message)
                }
            }
        )() 
    },[])

    useEffect(()=>{
        (
            async()=>{
                const res= await window.api.updateBillState();
                console.log(res);
            }
        )()
    },[])

    useEffect(()=>{
        setSearchResult(payments)
    },[payments])

    return(        
        <>
            <div className="principalCol colAdapt">
                <h1 className="tituloContainer">
                    Pagos
                </h1>
                <section className="containerCover">
                <div className="apartContainer">
                    <h2>Mis Pagos</h2>
                    <div className="searchContainer">
                    {/*Buscador*/}
                    <span className="searchButtons">
                        <input className="searcher" type='search' placeholder="buscador"/>
                        <select>
                            <option>Dia</option>
                            <option>ID del apartamento</option>
                            <option>Deuda</option>
                            <option>Estado</option>
                        </select>
                    </span>
                    <table className="tableInfo">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>ID Factura</td>
                                <td>monto</td>
                                <td>Nombre</td>
                                <td>Fecha De Creacion</td>
                                <td>Fecha de Modificacion</td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                           searchResult.length > 0? searchResult.map(p=>(
                                <>
                                    <tr
                                        
                                        onClick={()=>{

                                        }}
                                    >
                                        <td>{p.IDPaymentModel}</td>
                                        <td>{p.IDMonthlyBill}</td>
                                        <td>{p.amount}</td>
                                        <td>{p.payerName}</td>
                                        <td>{p.createdAt.toString()}</td>
                                        <td>{p.updatedAt.toString()}</td>
                                    </tr>
                                </>
                            )):<> <p className="visible" >No hay Registros</p></>
                        }
                        </tbody>
                    </table>
                    </div> 
                </div>
                <div className="crud apartContainer">
                    <h2>Opciones</h2>
                    <div className="buttonContainer">
                        <input className="button" value={'pagar'} type='button'
                            onClick={()=>{
 
                            }}
                        />
                        <input className="button" value={'eliminar'} type='button'
                            onClick={()=>{
                                eliminarFactura();
                            }}
                        />
                    </div>
                    <p className={envPay}>Pagado Exitosamente</p>
                    <p className={errPay}>Error al procesar el pago.<br/> Intentelo Nuevamente</p>
                    
                </div>
                </section>

            </div>
        </>)
}