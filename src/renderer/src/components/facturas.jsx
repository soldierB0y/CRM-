import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const Facturas=()=>{
    const [bills,setBills]= useState([])
    const [searchFilter,setSearchFilter]=useState("")
    const [searchResult,setSearchResult]= useState([]);
    const [envPay, setEnvPay]= useState('invisible');
    const [errPay, setErrPay]=useState('invisible');
    const [Del,setDel]= useState('invisible');
    const [IDFactura,setIDFactura]=useState(-1)
    const [state,setState]=useState(null);
    const navigator= useNavigate();
    const [montoPago,setMontoPago]= useState(-1)
    const [dineroPagado,setDineroPagado]= useState(0.00)
    const [showModal,setShowModal]= useState(false);
    const [showModalDel,setShowModalDel]= useState(true);
    const [modalMessage,setModalMessage]= useState('')
    const [abonar,setAbonar]= useState(false);
    const [payerName, setPayerName]=useState("");
    


    useEffect(()=>{
        //Catura las facturas y las actualiza
        (
            async ()=>{
                const res= await window.api.createBills();
                console.log(res)
            }
        )()
        getBills();
        updateBillState();
        //Cerrar modales si estan abiertos
        if(showModal==true)
            setShowModal(false)
        if(showModalDel==true)
            setShowModalDel(false)
    },[])

    useEffect(()=>{
        console.log(bills)
        setSearchResult(bills);
    },[bills])


    useEffect(()=>{
        console.log('SEARCH RESULT',searchResult)
    },[searchResult])

    //funciones
    const getBills= async ()=>{
        const res= await window.api.getBills();
        const objBills= res.result==true?res.object:[];
        setBills(objBills);
    }
    const pagarFactura= ()=>{
        if(IDFactura > 0)
        {
            (
                async ()=>{
                    console.log("Pagando...")
                    const res= await window.api.payBill(IDFactura,dineroPagado,payerName);
                    console.log(res)
                    if(res.result== true)
                    {
                        setDineroPagado(0.00);
                        setAbonar(false);
                        setPayerName("");
                        setIDFactura(-1);
                        setEnvPay("visible");
                        setShowModal(false);
                        setTimeout(() => {
                            navigator("/Inicio/Pagos")
                        }, 2000);
                    }
                    else if(res.result== false)
                    {
                        setErrPay("visible");
                    }
                }
            )()
        }
    }

    const updateBillState= async()=>{
        const res= await window.api.updateBillState();
    }

    const limpiar= ()=>{
        setEnvPay("invisible");
        setErrPay("invisible");
    }

    //Eliminar Factura

    const eliminarFactura=()=>{
        if(IDFactura > 0)
        {
            (
                async ()=>{
                    const res= await window.api.deleteMonthlyBill(IDFactura);
                    getBills()
                    console.log(res)
                }
            )()
            showModalDel(false);
        }
    }

    return(        
        <>
            <div className="principalCol colAdapt">
                <h1 className="tituloContainer">
                    Facturas
                </h1>
                <section className="containerCover">
                <div className="apartContainer">
                    <h2>Mis Facturas</h2>
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
                                <td>IDApartment</td>
                                <td>Dia</td>
                                <td>Deuda</td>
                                <td>Estado</td>
                                <td>Fecha de Creacion</td>
                                <td>Fecha de Modificacion</td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                           searchResult.length > 0? searchResult.map(b=>(
                                <>
                                    <tr
                                        className={IDFactura==b.IDMonthlyBill?"rowSelected":""}
                                        onClick={()=>{
                                            setIDFactura(b.IDMonthlyBill)
                                            setMontoPago(b.debt)
                                            setState(b.state);
                                        }}
                                    >
                                        <td>{b.IDMonthlyBill}</td>
                                        <td>{b.IDApartment}</td>
                                        <td>{b.day}</td>
                                        <td>{b.debt}</td>
                                        <td>{b.state==-1?'pendiente':b.state==0?'abonado':'pagado'}</td>
                                        <td>{b.createdAt.toString()}</td>
                                        <td>{b.updatedAt.toString()}</td>
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
                                if(state!=1)
                                {
                                    setShowModal(true)
                                }
                                else
                                {
                                    setModalMessage("Esta Factura ya ha sido Pagada")
                                }
                            }}
                        />
                        <input className="button" value={'eliminar'} type='button'
                            onClick={()=>{
                                setShowModalDel(true)
                            }}
                        />
                    </div>
                    <p className={envPay}>Pagado Exitosamente</p>
                    <p className={errPay}>Error al procesar el pago.<br/> Intentelo Nuevamente</p>
                    
                </div>
                </section>
                {/*Modal Pagar */}
                <div className="modal"  style={showModal==true?{display:"flex"}:{display:"none"}}>
                    <div className="modalPrincipalContainer">
                        <h2>
                            Pagar
                        </h2>
                        <div>
                            <p>Total:{montoPago}</p>
                            <p>Monto:</p>
                            <input className="inputMonto" type='number' value={dineroPagado}
                                onChange={(e)=>{

                                    if(e.target.value.toString() != "")
                                    {
                                        if(e.target.value >= 0)
                                        {
                                            setDineroPagado(e.target.value)
                                        }
                                        else
                                        {
                                            setDineroPagado(0)
                                        }
                                    }
                                    else
                                    {
                                        setDineroPagado(0)
                                    }
                                    
                                    
                                }} 
                            />
                            <span>
                                <input type='checkbox' value={abonar}
                                    onChange={(e)=>{
                                        setAbonar(e.target.checked)
                                    }}
                                />
                                <label>Abonar</label>
                            </span>
                        </div>
                        <div className="modalInputNameContainer">
                            <label>Nombre:</label>
                            <input  placeholder="nombre"  type='text' value={payerName}
                                onChange={(e)=>{
                                    setPayerName(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className="modalButtonContainer">
                        <button
                            onClick={()=>{
                                if((dineroPagado < montoPago && (abonar==false || dineroPagado==0)) || payerName=="")
                                {
                                    if(dineroPagado > 0)
                                        setModalMessage("Para un monto menor al total marque abonar")
                                    else
                                        setModalMessage("El monto a pagar debe ser mayor a 0")

                                    if(payerName=="")
                                    {
                                        setModalMessage("Ingrese el nombre de quien esta pagando")
                                    }


                                }
                                else
                                {
                                    setModalMessage("")
                                    pagarFactura()
                                }
                            }}
                        >Pagar</button>
                        <button
                            onClick={()=>{setShowModal(false)}}
                        >cancelar</button>
                    </div>
                    <p>{modalMessage}</p>
                </div>
                {/*Modal Eliminar */}
                <div className="modal" style={showModalDel==true?{display:'flex'}:{display:'none'}}>
                    <div className="modalPrincipalContainer">
                        <h2>Eliminar</h2>
                        <div style={{flexDirection:'column'}}>
                            <h3>Estas seguro que deseas eliminar la factura?</h3>
                            <p
                                style={{display:'flex',height:"50px",alignItems:'center',paddingLeft:"10%"}}
                            >Al eliminar esta factura, tambien eliminara los pagos anteriormente realizados que se encuentren vinculados</p>
                        </div>
                        <div className="modalButtonContainer">
                            <button
                                onClick={()=>{
                                    setShowModalDel(false)
                                }}
                            >Cancelar</button>
                            <button
                                onClick={()=>{
                                    eliminarFactura();
                                }}
                            >Si</button>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}