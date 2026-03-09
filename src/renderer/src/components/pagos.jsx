import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"


export const Pagos = () => {
    const location = useLocation()
    const { IDMonthlyBill } = location.state || {};
    const [searchResult, setSearchResult] = useState([])
    const [searchFilter, setSearchFilter] = useState("")
    const [searchField, setSearchField] = useState("Dia")
    const [showMessage, setShowMessage] = useState("")
    const [payments, setPayments] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedID, setSelectedID] = useState(-1)

    useEffect(() => {
        getPayments();
    }, [])

    useEffect(() => {
        (
            async () => {
                const res = await window.api.updateBillState();
                console.log(res);
            }
        )()
    }, [])

    useEffect(() => {
        // Filtra los pagos según el campo y el texto
        if (searchFilter === "") {
            setSearchResult(payments);
        } else {
            let filtered = payments.filter(p => {
                switch (searchField) {
                    case "Dia":
                        return p.createdAt && p.createdAt.toString().toLowerCase().includes(searchFilter.toLowerCase());
                    case "ID":
                        return p.IDMonthlyBill && p.IDMonthlyBill.toString().toLowerCase().includes(searchFilter.toLowerCase());
                    case "Deuda":
                        return p.amount && p.amount.toString().toLowerCase().includes(searchFilter.toLowerCase());
                    case "Estado":
                        // No hay campo estado en pagos, pero puedes filtrar por nombre si lo deseas
                        return p.payerName && p.payerName.toLowerCase().includes(searchFilter.toLowerCase());
                    default:
                        return true;
                }
            });
            setSearchResult(filtered);
        }
    }, [payments, searchFilter, searchField])


    //funciones
    const getPayments = async () => {
        const res = await window.api.getPayments();
        if (res.result == true) {
            setPayments(res.object)
        }
        else {
            console.log(res.message)
        }

    }
    const eliminarPago = async () => {
        if (selectedID > -1) {
            const res = await window.api.deletePayment(selectedID);
            if (res.result == true) {
                getPayments();
                setShowModal(false)
                setShowMessage("Eliminado exitosamente")
            }
            else
                setShowMessage("Error al eliminar Pago")
        }
        else {
            setShowMessage("Debe seleccionar el pago a eliminar")
        }

    }

    return (
        <>
            <div className="principalCol colAdapt">
                <h1 className="tituloContainer">
                    Historial de Pagos
                </h1>
                <section className="containerCover">
                    <div className="apartContainer">
                        <h2>Mis Pagos</h2>
                        <div className="searchContainer">
                            {/*Buscador*/}
                            <span className="searchButtons">
                                <input className="searcher" type='search' placeholder="buscador"
                                    value={searchFilter}
                                    onChange={e => setSearchFilter(e.target.value)}
                                />
                                <select value={searchField} onChange={e => setSearchField(e.target.value)}>
                                    <option value="Dia">Dia</option>
                                    <option value="ID">ID Factura</option>
                                    <option value="Deuda">Deuda</option>
                                    <option value="Estado">Nombre</option>
                                </select>
                                <button className="openCrudBtn" onClick={() => {
                                    if (selectedID < 0) { setShowMessage("Seleccione un pago para eliminar"); return; }
                                    setShowMessage('');
                                    setShowModal(true);
                                }}>Eliminar</button>
                            </span>
                            {showMessage && <p className="visible">{showMessage}</p>}
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
                                        searchResult.length > 0 ? searchResult.map((p, index) => (
                                            <tr
                                                className={selectedID == p.IDPaymentModel ? "rowSelected" : ""}
                                                onClick={() => {
                                                    setSelectedID(p.IDPaymentModel)
                                                    setShowMessage("");
                                                }}
                                                key={index}
                                            >
                                                <td>{p.IDPaymentModel}</td>
                                                <td>{p.IDMonthlyBill}</td>
                                                <td>{p.amount}</td>
                                                <td>{p.payerName}</td>
                                                <td>{p.createdAt.toString()}</td>
                                                <td>{p.updatedAt.toString()}</td>
                                            </tr>
                                        )) : <tr><td colSpan={6}><p className="visible">No hay Registros</p></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* ── Modal Eliminar ── */}
                {showModal && (
                    <div className="crudOverlay">
                        <div className="crudModalBox">
                            <button className="crudModalClose" onClick={() => setShowModal(false)}>✕</button>
                            <h2>Eliminar Pago #{selectedID}</h2>
                            <p style={{ textAlign: 'center' }}>¿Estás seguro? Esto alterará el estado de la factura correspondiente.</p>
                            <div className="buttonContainer">
                                <input type="button" value="Sí, eliminar" onClick={eliminarPago} />
                                <input type="button" value="Cancelar" onClick={() => setShowModal(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>)
}