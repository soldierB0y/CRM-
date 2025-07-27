import apartament from '../assets/imagenes/iconos/apartment.png';
import Inquilinos from '../assets/imagenes/iconos/tenant.png';
import Pagos from '../assets/imagenes/iconos/pay.png';
import Home from '../assets/imagenes/iconos/home.png';
import Report from '../assets/imagenes/iconos/reports.png'
import { Outlet } from 'react-router-dom';
import bills from '../assets/imagenes/iconos/bills.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


export const Inicio= ()=> {

    const navigator= useNavigate()
    const [selected,setSelected]= useState();
    return(
        <div className="principal dark colAdapt">
            <nav className="menu">
                <ul>
                    <span
                     className={selected=='home'?"menuOptionSelected":""}
                     onClick={()=>{
                                navigator('/Inicio/Home')
                                setSelected('home')
                            }}
                    >
                        <img src={Home}
                        ></img>
                        <li>Home</li>
                    </span>
                    <span
                     className={selected=='inquilinos'?"menuOptionSelected":""}
                        onClick={()=>{
                                navigator('/Inicio/Inquilinos')
                                setSelected('inquilinos')
                            
                        }}
                    >
                        <img src={Inquilinos}></img>
                        <li>Inquilinos</li>
                    </span>
                    <span
                     className={selected=='apartamentos'?"menuOptionSelected":""}
                        onClick={()=>{
                            navigator('/Inicio/Apartamentos')
                            setSelected('apartamentos')
                        }}
                    >
                        <img src={apartament}></img>
                        <li>Apartamentos</li>
                    </span>
                    <span
                     className={selected=='facturas'?"menuOptionSelected":""}
                        onClick={()=>{
                            navigator('/Inicio/Facturas')
                            setSelected('facturas')
                        }}
                    >
                        <img src={bills}></img>
                        <li>Facturas</li>
                    </span>
                    <span
                     className={selected=='pagos'?"menuOptionSelected":""}
                        onClick={()=>{
                            navigator('/Inicio/Pagos')
                            setSelected('pagos')
                        }}
                    >
                        <img src={Pagos}></img>
                        <li>Pagos</li>
                    </span>

                    <span
                     className={selected=='reportes'?"menuOptionSelected":""}
                        onClick={()=>{
                            navigator('/Inicio/Reportes')
                            setSelected('reportes')
                        }}
                    >
                        <img src={Report}></img>
                        <li>Reportes</li>
                    </span>


                </ul>
            </nav>
            <section className='principalCol rounded'>
                <Outlet/>
            </section>
        </div>
    )
}