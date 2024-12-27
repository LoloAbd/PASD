import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './Components/Login/Login';
import AddBuildings from './Components/DataManagement/AddBuildings';
import AddAdmin from './Components/Admin/AddAdmin';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AddBuildings />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
