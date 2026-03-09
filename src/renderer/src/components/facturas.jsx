import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const Facturas = () => {
    const [bills, setBills] = useState([])
    const [searchFilter, setSearchFilter] = useState("")
    const [searchField, setSearchField] = useState("Dia")
    const [searchResult, setSearchResult] = useState([]);
    const [IDFactura, setIDFactura] = useState(-1)
    const [state, setState] = useState(null);
    const navigator = useNavigate();
    const [montoPago, setMontoPago] = useState(-1)
    const [dineroPagado, setDineroPagado] = useState(0.00)
    const [showModalPay, setShowModalPay] = useState(false);
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
        if (showModalPay == true)
            setShowModalPay(false)
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
                        setShowModalPay(false);
                        setShowMessage("Pagado exitosamente");
                        setTimeout(() => {
                            navigator("/Inicio/Pagos")
                        }, 2000);
                    }
                    else if (res.result == false) {
                        setModalMessage("Error al procesar el pago. Intentelo nuevamente");
                    }
                }
            )()
        }
    }

    const updateBillState = async () => {
        const res = await window.api.updateBillState();
    }

    const reloadBills = () => {
        getBills();
    }

    const eliminarFactura = () => {
        if (IDFactura > 0) {
            (
                async () => {
                    const res = await window.api.deleteMonthlyBill(IDFactura);
                    console.log(res)
                    setShowModalDel(false)
                    if (res == true) {
                        getBills()
                        setShowMessage("Eliminado exitosamente")
                    }
                    else {
                        setShowMessage("Error al eliminar factura")
                    }
                    reloadBills();
                }
            )()
        }
    }

    return (
        <>
            <div className="principalCol colAdapt">
                <h1 className="tituloContainer">Facturas</h1>
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
                                <button className="openCrudBtn" onClick={() => {
                                    if (IDFactura < 0) { setShowMessage("Seleccione una factura"); return; }
                                    if (state == 1) { setShowMessage("Esta factura ya ha sido pagada"); return; }
                                    setModalMessage('');
                                    setShowMessage('');
                                    setShowModalPay(true);
                                }}>Pagar</button>
                                <button className="openCrudBtn" onClick={() => {
                                    if (IDFactura < 0) { setShowMessage("Seleccione una factura"); return; }
                                    setShowMessage('');
                                    setShowModalDel(true);
                                }}>Eliminar</button>
                            </span>
                            {showMessage && <p className="visible">{showMessage}</p>}
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
                                        searchResult.length > 0 ? searchResult.map((b, i) => (
                                            <tr key={i}
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
                                        )) : <tr><td colSpan={7}><p className="visible">No hay Registros</p></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── Modal Pagar ── */}
                {showModalPay && (
                    <div className="crudOverlay">
                        <div className="crudModalBox">
                            <button className="crudModalClose" onClick={() => { setShowModalPay(false); setModalMessage(''); }}>✕</button>
                            <h2>Pagar Factura #{IDFactura}</h2>
                            <div className="crudForm">
                                <input type="number" placeholder={`Total: ${montoPago}`}
                                    value={dineroPagado}
                                    onChange={e => setDineroPagado(e.target.value >= 0 ? e.target.value : 0)}
                                />
                                <input type="text" placeholder="Nombre del pagador"
                                    value={payerName}
                                    onChange={e => setPayerName(e.target.value)}
                                />
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input type="checkbox" checked={abonar}
                                        onChange={e => setAbonar(e.target.checked)}
                                    />
                                    Abonar
                                </label>
                            </div>
                            {modalMessage && <p className="visible">{modalMessage}</p>}
                            <div className="buttonContainer">
                                <input type="button" value="Pagar" onClick={() => {
                                    if ((dineroPagado < montoPago && !abonar) || dineroPagado == 0)
                                        return setModalMessage(dineroPagado > 0 ? "Para un monto menor al total marque abonar" : "El monto debe ser mayor a 0");
                                    if (!payerName)
                                        return setModalMessage("Ingrese el nombre de quien está pagando");
                                    setModalMessage('');
                                    pagarFactura();
                                }} />
                                <input type="button" value="Cancelar" onClick={() => { setShowModalPay(false); setModalMessage(''); }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Modal Eliminar ── */}
                {showModalDel && (
                    <div className="crudOverlay">
                        <div className="crudModalBox">
                            <button className="crudModalClose" onClick={() => setShowModalDel(false)}>✕</button>
                            <h2>Eliminar Factura #{IDFactura}</h2>
                            <p style={{ textAlign: 'center' }}>¿Estás seguro? También se eliminarán los pagos vinculados a esta factura.</p>
                            <div className="buttonContainer">
                                <input type="button" value="Sí, eliminar" onClick={eliminarFactura} />
                                <input type="button" value="Cancelar" onClick={() => setShowModalDel(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>)
}