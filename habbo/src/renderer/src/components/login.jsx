import { useState } from 'react';
import apartment from '../assets/imagenes/apartment.png'
import { useNavigate } from 'react-router-dom';
import { TopBar } from './topBar';
export const Login= ()=>{
    const navigator= useNavigate();
    const [userInfo, setUserInfo] = useState({ user: '', pass: '' });
    const [errCampos,setErrCampos]= useState('invisible')
    const [errCred,setErrCred]= useState('invisible')
    const sendLogin = async (data) => {
    const res = await window.api.sendLogin(data);
    if(res==false)
    {
      setErrCred('visible')
    }
    else
    {
        navigator('Inicio/Home');
    }
    setUserInfo({ user: '', pass: '' }); // Limpiar campos después de enviar
  };
  return (
    <>

    <section className='loginBody'>
      <h1 className='title'>RentHouse</h1>
      <img src={apartment} className='picLogin'></img>
      <div className='login'>
        <h1>Login</h1>
        <input
          value={userInfo.user}
          onChange={(e) => {
            setUserInfo({ ...userInfo, user: e.target.value });
            setErrCampos('invisible')
            setErrCred('invisible')
          }}
          className='textbox'
          name='user'
          type='text'
          placeholder='usuario'
        />
        <input
          value={userInfo.pass}
          onChange={(e) => {
            setUserInfo({ ...userInfo, pass: e.target.value });
            setErrCampos('invisible')
            setErrCred('invisible')

          }}
          className='textbox'
          name='pass'
          type='password'
          placeholder='clave'
        />
        <button
          className='submit'
          name='submit'
          onClick={() => {
            if(userInfo.user!="" && userInfo.pass!= "")
            sendLogin(userInfo);
          else
          setErrCampos('visible')
          }}
        >
          Enviar
        </button>
        <p className={errCampos}>Rellene todos los Campos</p>
        <p className={errCred}>Credenciales Incorrecta/s</p>
      </div>
    </section>
  </>
  );
}