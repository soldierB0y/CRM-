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
                                        searchResult.length > 0 ? searchResult.map((p, index) => (
                                            <>
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
                            <input className="button" value={'eliminar'} type='button'
                                onClick={() => {
                                    if (selectedID > -1)
                                        setShowModal(true)
                                    else {
                                        setShowMessage("Debe seleccionar el pago a eliminar")
                                    }
                                }}
                            />
                        </div>
                        <p style={{ width: '100%', textAlign: 'center' }}>{
                            showMessage
                        }</p>
                    </div>
                </section>
                <div className="modal" style={showModal == true ? { display: 'flex' } : { display: 'none' }}>
                    <div className="modalPrincipalContainer">
                        <h2>Eliminar</h2>
                        <div style={{ flexDirection: 'column' }}>
                            <h3>Estas seguro que deseas eliminar el Pago?</h3>
                            <p
                                style={{ display: 'flex', height: "50px", alignItems: 'center', paddingLeft: "10%" }}
                            >Si elimina este pago, alterara el estado de pagada o abonada a la factura correspondiente</p>
                        </div>
                        <div className="modalButtonContainer">
                            <button
                                onClick={() => {


                                    setShowModal(false)

                                }}
                            >Cancelar</button>
                            <button
                                onClick={() => {
                                    eliminarPago();
                                }}
                            >Si</button>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}