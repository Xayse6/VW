import { Route, Routes } from 'react-router-dom';



import { NotFound } from './components/NotFound';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';

import Home from './features/home/pages/Home';

import { Register } from './features/auth/pages/Register';
import Login from './features/auth/pages/Login';
import { Profile } from './features/Perfil/pages/Profile';
import { EditProfile } from './features/Perfil/pages/EditProfile';


import Usuarios from "./features/usuario/pages/Usuarios";

import Marcas from "./features/marca/pages/Marcas"
import CadastrarMarca from './features/marca/pages/CadastrarMarca';

import Modelos from "./features/modelo/pages/Modelos"


export function App() {
  return (
    <AuthProvider>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="*" element={<NotFound />}/>

          <Route path="/"element={<Home/>}/>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/usuarios" element={<Usuarios />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/profile/edit" element={<EditProfile />}/>
            <Route path="/marcas" element={<Marcas />}/>
            <Route path='/cadastrarMarca' element={<CadastrarMarca/>}/>

            <Route path="/modelos" element={<Modelos />}/>
          </Route>

          
        </Routes>
      </main>

      <Footer />
    </AuthProvider>
  );
}



