import { BrowserRouter, Routes, Route} from 'react-router-dom';
//import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import AddCitie from './Components/Admin/AddCitie';
import BuildingImages from './Components/DataManagement/BuildingImages';
import ShowBuildings from './Components/DataManagement/ShowBuildings';
import Notaries from './Components/DataManagement/Notaries';
import AddBuildings from './Components/DataManagement/AddBuildings';
import Owners from './Components/DataManagement/Owners';
import Architects from './Components/DataManagement/Architects';
import AddNotary from './Components/DataManagement/AddNotary'





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />}></Route>
        <Route path='/Notaries' element={<Notaries />}></Route>
        <Route path='/AddNotary' element={<AddNotary />}></Route>
        <Route path='/AddCitie' element={<AddCitie />}></Route>
        <Route path='/BuildingImages' element={<BuildingImages />}></Route>
        <Route path='/ShowBuildings' element={<ShowBuildings />}></Route>
        <Route path='/AddBuildings' element={<AddBuildings />}></Route>
        <Route path='/Owners' element={<Owners />}></Route>
         <Route path='/Architects' element={<AddNotary />}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
