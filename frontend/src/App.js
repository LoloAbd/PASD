import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Components/Login/Login';
import AddAdmin from './Components/Admin/AddAdmin';
import UpdateAdminInfo from './Components/Admin/UpdateAdminInfo';
import Dashboard from './Components/Dashboard/Dashboard'
import ShowAllAdmins from './Components/Admin/ShowAllAdmins';
import Notaries from './Components/DataManagement/Notaries';
import Owners from './Components/DataManagement/Owners';
import AddCitie from './Components/Admin/AddCitie'




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path = '/Dashboard' element={<Dashboard />}></Route>
        <Route path='/UpdateAdminInfo' element={<UpdateAdminInfo />}></Route>
        <Route path='/AddAdmin' element={<AddAdmin />}></Route>
        <Route path='/ShowAllAdmins' element={<ShowAllAdmins />}></Route>
        <Route path='/Notaries' element={<Notaries />}></Route>
        <Route path='/Owners' element={<Owners />}></Route>
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
