import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Components/Login/Login';
import AddAdmin from './Components/Admin/AddAdmin';
import UpdateAdminInfo from './Components/Admin/UpdateAdminInfo';
import Dashboard from './Components/Dashboard/Dashboard'
import ShowAllAdmins from './Components/Admin/ShowAllAdmins';
import DocSearch from './Components/Search/DocSearch'
import ArchitectSearch from './Components/Search/ArchitectSearch';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ArchitectSearch />}></Route>
        <Route path = '/Dashboard' element={<Dashboard />}></Route>
        <Route path='/UpdateAdminInfo' element={<UpdateAdminInfo />}></Route>
        <Route path='/AddAdmin' element={<AddAdmin />}></Route>
        <Route path='/ShowAllAdmins' element={<ShowAllAdmins />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
