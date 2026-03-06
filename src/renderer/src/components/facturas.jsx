import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const Facturas = () => {
    const [bills, setBills] = useState([])
    const [searchFilter, setSearchFilter] = useState("")
    const [searchField, setSearchField] = useState("Dia")
    const [searchResult, setSearchResult] = useState([]);
    const [envPay, setEnvPay] = useState('invisible');
    const [errPay, setErrPay] = useState('invisible');
    const [IDFactura, setIDFactura] = useState(-1)
    const [state, setState] = useState(null);
    const navigator = useNavigate();
    const [montoPago, setMontoPago] = useState(-1)
    const [dineroPagado, setDineroPagado] = useState(0.00)
    const [showModal, setShowModal] = useState(false);
    const [showModalDel, setShowModalDel] = useState(false);
    const [modalMessage, setModalMessage] = useState('')
    const [showMessage, setShowMessage] = useState('')
    const [abonar, setAbonar] = useState(false);
    const [payerName, setPayerName] = useState("");



    useEffect(() => {
        //Catura las facturas y las actualiza
        (
            async () => {
                const res = await window.api.createBills();
                getBills();
                updateBillState();
                console.log(res)
            }
        )()

        //Cerrar modales si estan abiertos
        if (showModal == true)
            setShowModal(false)
        if (showModalDel == true)
            setShowModalDel(false)
    }, [])


    useEffect(() => {
        setSearchResult(bills)
    }, [bills])

    useEffect(() => {
        // Filtra las facturas según el campo y el texto
        if (searchFilter === "") {
            setSearchResult(bills);
        } else {
            let filtered = bills.filter(b => {
                switch (searchField) {
                    case "Dia":
                        return b.day && b.day.toString().toLowerCase().includes(searchFilter.toLowerCase());
                    case "ID":
                        return b.IDApartment && b.IDApartment.toString().toLowerCase().includes(searchFilter.toLowerCase());
                    case "Deuda":
                        return b.debt && b.debt.toString().toLowerCase().includes(searchFilter.toLowerCase());
                    case "Estado":
                        let estado = b.state == 0 ? 'pendiente' : 'pagado';
                        return estado.toLowerCase().includes(searchFilter.toLowerCase());
                    default:
                        return true;
                }
            });
            setSearchResult(filtered);
        }
    }, [bills, searchFilter, searchField])


    useEffect(() => {
        console.log('SEARCH RESULT', searchResult)
    }, [searchResult])

    //funciones
    const getBills = async () => {
        const res = await window.api.getBills();
        const objBills = res.result == true ? res.object : [];
        setBills(objBills);
    }
    const pagarFactura = () => {
        if (IDFactura > 0) {
            (
                async () => {
                    console.log("Pagando...")
                    const res = await window.api.payBill(IDFactura, dineroPagado, payerName);
                    console.log(res)
                    if (res.result == true) {
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
                    else if (res.result == false) {
                        setErrPay("visible");
                    }
                }
            )()
        }
    }

    const updateBillState = async () => {
        const res = await window.api.updateBillState();
    }

    const limpiar = () => {
        setEnvPay("invisible");
        setErrPay("invisible");
    }

    const reloadBills = () => {
        getBills();
    }
    //Eliminar Factura

    const eliminarFactura = () => {
        if (IDFactura > 0) {
            (
                async () => {
                    const res = await window.api.deleteMonthlyBill(IDFactura);
                    console.log(res)
                    if (res == true) {
                        getBills()
                        setModalMessage("Eliminado exitosamente")

                    }
                    else {

                        setModalMessage("Error al eliminar factura")
                    }
                    setShowModalDel(false)
                    reloadBills();
                }
            )()

        }
    }

    return (
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
                                <input className="searcher" type='search' placeholder="buscador"
                                    value={searchFilter}
                                    onChange={e => setSearchFilter(e.target.value)}
                                />
                                <select value={searchField} onChange={e => setSearchField(e.target.value)}>
                                    <option value={"Dia"}>Dia</option>
                                    <option value={"ID"}>ID del apartamento</option>
                                    <option value={"Deuda"}>Deuda</option>
                                    <option value={"Estado"}>Estado</option>
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
                                        searchResult.length > 0 ? searchResult.map(b => (
                                            <>
                                                <tr
                                                    className={IDFactura == b.IDMonthlyBill ? "rowSelected" : ""}
                                                    onClick={() => {
                                                        setIDFactura(b.IDMonthlyBill)
                                                        setMontoPago(b.debt)
                                                        setState(b.state);
                                                        setShowMessage("")
                                                    }}
                                                >
                                                    <td>{b.IDMonthlyBill}</td>
                                                    <td>{b.IDApartment}</td>
                                                    <td>{b.day}</td>
                                                    <td>{b.debt}</td>
                                                    <td>{b.state == 0 ? 'pendiente' : 'pagado'}</td>
                                                    <td>{b.createdAt?.toString()}</td>
                                                    <td>{b.updatedAt?.toString()}</td>
                                                </tr>
                                            </>
                                        )) : <> <p className="visible" >No hay Registros</p></>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="crud apartContainer">
                        <h2>Opciones</h2>
                        <div className="buttonContainer">
                            <input className="button" value={'pagar'} type='button'
                                onClick={() => {
                                    if (state != 1) {
                                        setShowModal(true)
                                    }
                                    else {
                                        setShowMessage("Esta Factura ya ha sido Pagada")
                                    }
                                }}
                            />
                            <input className="button" value={'eliminar'} type='button'
                                onClick={() => {
                                    setShowModalDel(true)
                                }}
                            />
                        </div>
                        <p className={envPay}>Pagado Exitosamente</p>
                        <p className="visible">{showMessage}</p>
                        <p className={errPay}>Error al procesar el pago.<br /> Intentelo Nuevamente</p>

                    </div>
                </section>
                {/*Modal Pagar */}
                <div className="modal" style={showModal == true ? { display: "flex" } : { display: "none" }}>
                    <div className="modalPrincipalContainer">
                        <h2>
                            Pagar
                        </h2>
                        <div>
                            <p>Total:{montoPago}</p>
                            <p>Monto:</p>
                            <input className="inputMonto" type='number' value={dineroPagado}
                                onChange={(e) => {

                                    if (e.target.value.toString() != "") {
                                        if (e.target.value >= 0) {
                                            setDineroPagado(e.target.value)
                                        }
                                        else {
                                            setDineroPagado(0)
                                        }
                                    }
                                    else {
                                        setDineroPagado(0)
                                    }


                                }}
                            />
                            <span>
                                <input type='checkbox' value={abonar}
                                    onChange={(e) => {
                                        setAbonar(e.target.checked)
                                    }}
                                />
                                <label>Abonar</label>
                            </span>
                        </div>
                        <div className="modalInputNameContainer">
                            <label>Nombre:</label>
                            <input placeholder="nombre" type='text' value={payerName}
                                onChange={(e) => {
                                    setPayerName(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className="modalButtonContainer">
                        <button
                            onClick={() => {
                                if ((dineroPagado < montoPago && (abonar == false || dineroPagado == 0)) || payerName == "") {
                                    if (dineroPagado > 0)
                                        setModalMessage("Para un monto menor al total marque abonar")
                                    else
                                        setModalMessage("El monto a pagar debe ser mayor a 0")

                                    if (payerName == "") {
                                        setModalMessage("Ingrese el nombre de quien esta pagando")
                                    }


                                }
                                else {
                                    setModalMessage("")
                                    pagarFactura()
                                }
                            }}
                        >Pagar</button>
                        <button
                            onClick={() => { setShowModal(false) }}
                        >cancelar</button>
                    </div>
                    <p>{modalMessage}</p>
                </div>
                {/*Modal Eliminar */}
                <div className="modal" style={showModalDel == true ? { display: 'flex' } : { display: 'none' }}>
                    <div className="modalPrincipalContainer">
                        <h2>Eliminar</h2>
                        <div style={{ flexDirection: 'column' }}>
                            <h3>Estas seguro que deseas eliminar la factura?</h3>
                            <p
                                style={{ display: 'flex', height: "50px", alignItems: 'center', paddingLeft: "10%" }}
                            >Al eliminar esta factura, tambien eliminara los pagos anteriormente realizados que se encuentren vinculados</p>
                        </div>
                        <div className="modalButtonContainer">
                            <button
                                onClick={() => {
                                    setShowModalDel(false)
                                }}
                            >Cancelar</button>
                            <button
                                onClick={() => {
                                    eliminarFactura();
                                }}
                            >Si</button>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}