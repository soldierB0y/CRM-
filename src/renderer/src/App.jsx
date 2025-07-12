import { Apartamentos } from "./components/apartamentos";
import {Home} from './components/home'
import {Inquilinos} from './components/inquilinos'
import {Pagos} from './components/pagos'
import { Inicio } from "./components/inicio";
import { Login } from "./components/login"
import {Facturas} from './components/facturas'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { TopBar } from "./components/topBar";
import { Reportes } from "./components/reportes";

function App() {
 return(
  <>
  <TopBar></TopBar>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Inicio" element={<Inicio/>}>
          <Route path="Home" element={<Home/>}/>
          <Route path="Inquilinos" element={<Inquilinos/>}/>
          <Route path="Apartamentos" element={<Apartamentos/>}/>
           <Route path="Pagos" element={<Pagos/>}/>
           <Route path="Facturas" element={<Facturas/>}/>
           <Route path="Reportes" element={<Reportes/>}/>
        </Route>
      </Routes>
    </Router>

  </>
 )
}

export default App
