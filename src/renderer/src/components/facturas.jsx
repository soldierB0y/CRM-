import { useEffect, useState } from "react"

export const Facturas=()=>{
    const [bills,setBills]= useState([])


    const getBills= async ()=>{
        const res= await window.api.getBills();
        console.log('bills:',bills);
    }

    useEffect(()=>{
        (
            async ()=>{
                const res= await window.api.createBills();
                console.log(res)
            }
        )()
        getBills();
    },[])

    return(        
        <>
            <h1 className="tituloContainer">
                Facturas
            </h1>
            <div>
                <p style={{color:'white'}}>


                </p>
            </div>
        </>)
}