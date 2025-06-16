import { useState } from "react"


export const Apartamentos=()=>{
    const [apartament, setApartament]= useState({name:"",rent:"",inquilino:0,location:"",locationUrl:""})
    const createApartment = async (data) => {
    const res = await window.api.createApartment(data);
    console.log(res);
  };
    return(
        <div className="principalCol">
            <h1 className="tituloContainer">
                            Apartamentos
            </h1>
            <section className="containerCover">
                <div>
                    <h2>Mis Apartamentos</h2>
                </div>
                <div className="crud">
                    <h2>Crud</h2>
                    <div className="crudForm">
                        <input value={apartament.name}
                            onChange={(e)=>{
                                setApartament({...apartament,name:e.target.value})
                            }}
                        type="text" placeholder="nombre"/>
                        <input
                            onChange={(e)=>{
                                setApartament({...apartament,rent:e.target.value})
                            }}
                        value={apartament.rent} type="text" placeholder="renta"/>
                        <select 
                            onChange={(e)=>{
                                setApartament({...apartament,inquilino:''})
                            }}
                        value={apartament.inquilino}>
                            <option value="ninguno">ninguno</option>
                            <option value="test">Test</option>
                        </select>
                        <input
                            onChange={(e)=>{
                                setApartament({...apartament,location:e.target.value})
                            }}
                        value={apartament.location} type="text" placeholder="ubicacion"/>
                        <input
                            onChange={(e)=>{
                                setApartament({...apartament,locationUrl:e.target.value})
                            }}
                        value={apartament.locationUrl} type="text" placeholder="URL ubicacion" />
                    </div>
                    <div className="buttonContainer">
                        <input
                            onClick={()=>{
                                console.log(apartament)
                            }}
                        type="button" value={'Agregar'}/>
                        <input type="button" value={'Modificar'}/>
                        <input type="button" value={'Eliminar'}/>
                        <input
                            onClick={()=>{
                                setApartament({...apartament,name:'',rent:'',inquilino:0,location:'',locationUrl:''})
                                createApartment(apartament)
                            }}
                        type="button" value={'Limpiar'}/>
                    </div>
                </div>
            </section>
        </div>
    )
}