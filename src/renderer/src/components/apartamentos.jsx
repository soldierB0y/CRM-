import { useState, useEffect } from "react"

export const Apartamentos = () => {
    //captura la fecha completa
    const today = new Date();
    //captura el dia especifico
    const day = today.getDate();
    //variables
    const [apartament, setApartament] = useState({ name: "", rent: '', location: "", locationUrl: "", tenantName: "", inversion: '', description: "", tenantID: '', paymentDay: day, rentalDate: "", maintenance: "", electricity: "" })
    const [tenants, setTenants] = useState([]);
    const [errEnv, setErrEnv] = useState('invisible');
    const [modEx, setModEx] = useState('invisible');
    const [envEx, setEnvEx] = useState('invisible');
    const [delEx, setDelEx] = useState('invisible');
    const [errDel, setErrDel] = useState('invisible');
    const [errCampos, setErrCampos] = useState('invisible');
    const [registros, setRegistros] = useState([])
    const [searchResult, setSearchResult] = useState([]);
    const [searchFilter, setSearchFilter] = useState("name");
    const [selectedID, setSelectedID] = useState(-1)
    const [showCrudModal, setShowCrudModal] = useState(false);
    //funciones
    const limpiar = () => {
        setSelectedID(-1)
        setApartament({ ...apartament, name: '', rent: '', tenantName: "", location: '', locationUrl: '', inversion: '', description: "", paymentDay: day, tenantID: '', rentalDate: '', maintenance: "", electricity: "" })
        quitNot();
    }

    const quitNot = () => {
        if (errEnv == 'visible')
            setErrEnv('invisible')

        if (envEx == 'visible')
            setEnvEx('invisible')
        if (errCampos == 'visible')
            setErrCampos('invisible')
        if (delEx == 'visible')
            setDelEx('invisible')
        if (modEx == 'visible')
            setModEx('invisible')
    }
    //funciones de render
    const createApartment = async (data) => {
        console.log(data);
        const res = await window.api.createApartment(data);
        return res
    };

    const getApartments = async () => {
        const res = await window.api.getApartments();
        console.log(res);
        if (res.result == 1) {
            return res.object
        }
    }
    //eliminar apartamento
    const deleteApartment = async (IDApartment) => {
        const res = await window.api.deleteApartment(IDApartment)
        if (res == true) {
            return true
        }
        else {
            console.log('err');
            return false;
        }
    }

    const modifyApartment = async (data) => {
        data.IDApartment = selectedID;
        console.log(data);
        const res = await window.api.modifyApartment(data);
        return res;
    }

    //recargar
    const reloadApartment = async () => {
        limpiar();
        const res = await getApartments();
        let objArray = []

        if (res != undefined || res != false) {
            objArray = res.map(a => a.dataValues);
            setRegistros(objArray)
        }
        else {
            console.log(false);
        }
    }

    //cargar Apartamentos
    useEffect(() => {
        (async () => {
            await reloadApartment()
        })();
    }, [])

    //cargar Inquilinos
    useEffect(() => {
        (
            async () => {
                const res = await window.api.getTenants();
                if (res.result == true) {
                    const objTenants = res.object
                    const arrayTenants = []
                    objTenants.map((item) => {
                        arrayTenants.push(item.dataValues)
                    })
                    setTenants(arrayTenants)
                }
            }
        )()
    }, [])

    useEffect(() => {
        setSearchResult(registros)
    }, [registros])

    useEffect(() => {
        console.log(searchResult)
    }, [searchResult])

    return (
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
                                onChange={(e) => {
                                    setSearchResult(
                                        registros.filter((item) => item[searchFilter].toString().toLowerCase().includes(e.target.value))
                                    )
                                }}
                            />
                            <select onChange={(e) => { setSearchFilter(e.target.value) }} value={searchFilter}>
                                <option value={"name"}>nombre</option>
                                <option value={"rent"}>renta</option>
                                <option value={"tenantName"}>Inquilino</option>
                                <option value={"location"}>Ubicacion</option>
                            </select>
                            <button className="openCrudBtn" onClick={() => { quitNot(); setShowCrudModal(true); }}>
                                + Nuevo / Editar
                            </button>
                        </span>
                        <table className="tableInfo">
                            <thead>
                                <tr className="mainRow">
                                    <td>ID</td>
                                    <td>nombre</td>
                                    <td>renta</td>
                                    <td>Inquilino</td>
                                    <td>Electricidad</td>
                                    <td>Mantenimiento</td>
                                    <td>Descripcion</td>
                                    <td>Ubicacion</td>
                                    <td>UbiURL</td>
                                    <td>Fecha de Pago</td>
                                    <td>Dia de renta</td>
                                    <td>Creacion</td>
                                    <td>Modificacion</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    searchResult ? searchResult.map((item, index) => (
                                        <tr key={index}
                                            className={selectedID == item.IDApartment ? "rowSelected" : ""}
                                            onClick={() => {
                                                setApartament(item);
                                                setSelectedID(item.IDApartment);
                                            }}
                                        >
                                            <td>{item.IDApartment}</td>
                                            <td>{item.name}</td>
                                            <td>{item.rent}</td>
                                            <td>{item.tenantName}</td>
                                            <td>{item.electricity}</td>
                                            <td>{item.maintenance}</td>
                                            <td>{item.description}</td>
                                            <td>{item.location}</td>
                                            <td>{item.locationUrl}</td>
                                            <td>{item.paymentDay?.toString()}</td>
                                            <td>{item.rentalDate?.toString()}</td>
                                            <td>{item.createdAt?.toString()}</td>
                                            <td>{item.updatedAt?.toString()}</td>
                                        </tr>)
                                    ) : <>No hay registros</>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ── CRUD Modal ── */}
            {showCrudModal && (
                <div className="crudOverlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowCrudModal(false); limpiar(); } }}>
                    <div className="crudModalBox">
                        <button className="crudModalClose" onClick={() => { setShowCrudModal(false); limpiar(); }}>✕</button>
                        <h2>{selectedID > 0 ? 'Editar Apartamento' : 'Nuevo Apartamento'}</h2>
                        {/*Form*/}
                        <div className="crudForm">
                            {/*Nombre*/}
                            <input value={apartament.name}
                                onChange={(e) => {
                                    setApartament({ ...apartament, name: e.target.value })
                                    quitNot()
                                }}
                                type="text" placeholder="nombre" />
                            {/*renta*/}
                            <input
                                onChange={(e) => {
                                    setApartament({ ...apartament, rent: e.target.value })
                                    quitNot()
                                }}
                                value={apartament.rent} type="number" placeholder="renta" />
                            {/*Inquilino*/}
                            <select
                                onChange={(e) => {
                                    const tenantChoosed = tenants.filter(t => t.fullName == e.target.value)
                                    console.log(tenantChoosed[0].IDTenant)
                                    setApartament({ ...apartament, tenantName: e.target.value, tenantID: tenantChoosed[0].IDTenant || null })
                                    quitNot();
                                }}
                                value={apartament.tenantName}>
                                <option value="">Inquilino</option>
                                {
                                    tenants.map((item, index) => (
                                        <option key={index}>{item.fullName}</option>
                                    ))
                                }
                            </select>
                            {/*Location*/}
                            <input
                                onChange={(e) => {
                                    setApartament({ ...apartament, location: e.target.value })
                                    quitNot()
                                }}
                                value={apartament.location} type="text" placeholder="ubicacion" />
                            {/*LocationURL*/}
                            <input
                                onChange={(e) => {
                                    setApartament({ ...apartament, locationUrl: e.target.value })
                                    quitNot()
                                }}
                                value={apartament.locationUrl} type="text" placeholder="URL ubicacion" />
                            {/*Inversion*/}
                            <input
                                placeholder="inversion"
                                type="number"
                                onChange={(e) => {
                                    setApartament({ ...apartament, inversion: e.target.value })
                                    quitNot()
                                }}
                                value={apartament.inversion}
                            />
                            {/*Rental Date */}
                            <input id='rentalDate' type='date' placeholder="fecha de renta"
                                onChange={(e) => {
                                    setApartament({ ...apartament, rentalDate: e.target.value })
                                }}
                                value={apartament.rentalDate}
                            />
                            {/*PaymentDate */}
                            <span className="paymentContainer">
                                <input id='paymentDay' type='number' min="1" max="31"
                                    onChange={(e) => {
                                        var result = e.target.value;
                                        if (result < 1) result = 1
                                        if (result > 31) result = 31
                                        setApartament({ ...apartament, paymentDay: result })
                                    }}
                                    value={apartament.paymentDay}
                                    placeholder="Dia de Pago"
                                />
                            </span>
                            {/* Electricidad*/}
                            <input type="number" placeholder="electricidad"
                                onChange={(e) => {
                                    setApartament({ ...apartament, electricity: e.target.value })
                                    quitNot()
                                }}
                                value={apartament.electricity}
                            />
                            {/*Mantenimiento*/}
                            <input type="number" placeholder="mantenimiento"
                                onChange={(e) => {
                                    setApartament({ ...apartament, maintenance: e.target.value })
                                    quitNot()
                                }}
                                value={apartament.maintenance}
                            />
                            {/*Descripcion */}
                            <textarea placeholder="descripcion"
                                onChange={(e) => {
                                    setApartament({ ...apartament, description: e.target.value })
                                }}
                                value={apartament.description}
                            ></textarea>
                        </div>
                        <div className="buttonContainer">
                            <input
                                onClick={() => {
                                    if (apartament.name != "" && apartament.rent != "")
                                        (async () => {
                                            const result = await createApartment(apartament);
                                            if (result == true) {
                                                reloadApartment();
                                                setEnvEx('visible')
                                            }
                                            else {
                                                setErrEnv('visible')
                                            }
                                        })()
                                    else
                                        setErrCampos('visible')
                                }}
                                type="button" value={'Agregar'} />
                            <input type="button" value={'Modificar'}
                                onClick={(e) => {
                                    if (apartament.name != "") {
                                        (async () => {
                                            const res = await modifyApartment(apartament);
                                            if (res == true) {
                                                setModEx('visible')
                                                reloadApartment();
                                            }
                                            else
                                                setErrEnv('visible')
                                        })()
                                    }
                                    else {
                                        setErrEnv('visible')
                                    }
                                }}
                            />
                            <input type="button" value={'Eliminar'}
                                onClick={() => {
                                    if (selectedID > 0) {
                                        (async () => {
                                            const res = await deleteApartment(selectedID);
                                            if (res) {
                                                setDelEx('visible')
                                                quitNot()
                                            }
                                            else
                                                setErrEnv('visible')
                                        })()
                                        reloadApartment();
                                    }
                                }}
                            />
                            <input
                                onClick={() => { limpiar(); }}
                                type="button" value={'Limpiar'} />
                        </div>
                        <p className={envEx}>Agregado Exitosamente!</p>
                        <p className={modEx}>Modificado Exitosamente!</p>
                        <p className={delEx}>Eliminado Exitosamente!</p>
                        <p className={errEnv}>Intentelo Nuevamente!</p>
                        <p className={errCampos}>Rellene los Campos</p>
                    </div>
                </div>
            )}
        </div>
    )
}
