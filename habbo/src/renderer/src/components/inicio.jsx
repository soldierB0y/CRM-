import apartament from '../assets/imagenes/iconos/apartment.png';
import Inquilinos from '../assets/imagenes/iconos/lender.png';
import Pagos from '../assets/imagenes/iconos/pay.png';
import Home from '../assets/imagenes/iconos/home.png';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export const Inicio= ()=> {
    const navigator= useNavigate()
    return(
        <div className="principal dark">
            <nav className="menu">
                <ul>
                    <span
                     onClick={()=>{
                                navigator('/Inicio/Home')
                            }}
                    >
                        <img src={Home}
                        ></img>
                        <li>Home</li>
                    </span>
                    <span
                        onClick={()=>{
                                navigator('/Inicio/Inquilinos')
                            
                        }}
                    >
                        <img src={Inquilinos}></img>
                        <li>Inquilinos</li>
                    </span>
                    <span
                        onClick={()=>{
                            navigator('/Inicio/Apartamentos')
                        }}
                    >
                        <img src={apartament}></img>
                        <li>Apartamentos</li>
                    </span>
                    <span
                        onClick={()=>{
                            navigator('/Inicio/Pagos')
                        }}
                    >
                        <img src={Pagos}></img>
                        <li>Pagos</li>
                    </span>


                </ul>
            </nav>
            <section className='principalCol rounded'>
                <Outlet/>
            </section>
        </div>
    )
}