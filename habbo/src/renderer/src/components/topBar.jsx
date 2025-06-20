import close from '../assets/imagenes/iconos/close.png'
import minimize from '../assets/imagenes/iconos/minimize.png'
import layers from '../assets/imagenes/iconos/layers.png'

export const TopBar= ()=>{

    const closeWindow=()=>{  window.api.closeWindow();}
    const minimizeWindow=()=>{window.api.minimizeWindow();}
    const changeSizeWindow=()=>{window.api.changeSizeWindow();}

    return(
        <div className="topBar">
            <span>
                <p>RentHouse</p>
            </span>
            <span className='dragMe'/>
            <span>
                <i
                    onClick={()=>{
                        minimizeWindow();
                    }}
                >
                    <img src={minimize} alt="" />
                </i>
                <i
                    onClick={()=>{
                        changeSizeWindow();
                    }}
                >
                    <img src={layers} alt="" />
                </i>
                <i className='closeView'
                    onClick={()=>{
                        closeWindow()
                    }}
                >
                    <img src={close} ></img>
                </i>

            </span>

        </div>
    )
}