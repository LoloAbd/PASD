import { BrowserRouter, Routes, Route} from 'react-router-dom';
//import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import Cities from './Components/DataManagement/City/Cities'

import ImageSlider from './Components/ImageSlider'
import BuildingImages from './Components/DataManagement/Buildings/BuildingImages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ImageSlider />}></Route>
        <Route path='/ImageSlider' element={<ImageSlider />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
