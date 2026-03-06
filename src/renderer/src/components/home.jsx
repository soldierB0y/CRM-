import { useEffect } from "react"
import house from '../assets/imagenes/pics/modernHouse.png';
import char from '../assets/imagenes/pics/char.png';
export const Home=()=>{

    useEffect(()=>{
        (
            async ()=>{
                const res= await window.api.createBills();
                console.log(res);
            }
        )()
    },[])
    

    return(
        <>
            <h1 className="tituloContainer">
                Home
            </h1>
            <div style={{display:'flex',justifyContent:'center'}}>
                <img draggable={false} src={char} className="characterHome"></img>
                <img draggable={false} src={house} style={{width:'100%',maxWidth:'1250px'}}></img>
            </div>
        </>

    )
}