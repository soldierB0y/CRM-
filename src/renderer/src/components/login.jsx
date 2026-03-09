import { useState } from 'react';
import apartment from '../assets/imagenes/apartment.png'
import logo from '../assets/imagenes/logo.svg'
import { useNavigate } from 'react-router-dom';
export const Login = () => {
  const navigator = useNavigate();
  const [userInfo, setUserInfo] = useState({ user: '', pass: '' });
  const [errCampos, setErrCampos] = useState('invisible')
  const [errCred, setErrCred] = useState('invisible')
  const sendLogin = async (data) => {
    const res = await window.api.sendLogin(data);
    if (res == false) {
      setErrCred('visible')
    }
    else {
      navigator('Inicio/Home');
    }
    setUserInfo({ user: '', pass: '' }); // Limpiar campos después de enviar
  };
  return (
    <>

      <section className='loginBody'>
        <img src={logo} alt="HABBO" className='titleLogo' />
        <img src={apartment} className='picLogin'></img>
        <div className='login'>
          <img src={logo} alt="HABBO" className='loginLogo' />
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
              if (userInfo.user != "" && userInfo.pass != "")
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