import { BrowserRouter, Routes, Route} from 'react-router-dom';
//import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import AddCitie from './Components/Admin/AddCitie';
import BuildingImages from './Components/DataManagement/BuildingImages';
import ShowBuildings from './Components/DataManagement/ShowBuildings';
import Notaries from './Components/DataManagement/Notaries';
import AddBuildings from './Components/DataManagement/AddBuildings';





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Notaries />}></Route>
        <Route path='/Dashboard' element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
