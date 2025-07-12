import { useEffect } from "react"


export const Home=()=>{

    useEffect(()=>{
        (
            async ()=>{
                const res= await window.api.createBills();
                console.log(res)
            }
        )()
    },[])
    

    return(
        <>
            <h1 className="tituloContainer">
                Home
            </h1>
            <div>
                <p style={{color:'white'}}>


                </p>
            </div>
        </>

    )
}