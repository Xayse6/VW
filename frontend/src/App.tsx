import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthProvider';

import Home from './features/home/pages/Home';
import { EditProfile } from './features/Perfil/pages/EditProfile';
import Login from './features/auth/pages/Login';
import { NotFound } from './components/NotFound';

import { Profile } from './features/Perfil/pages/Profile';
import { Register } from './features/auth/pages/Register';

import Usuarios from "./features/usuario/pages/Usuarios";


/**
 * Componente raiz da aplicacao. Define as rotas publicas e protegidas,
 * envolvendo tudo com o AuthProvider para que o estado de autenticacao
 * fique disponivel em toda a arvore de componentes.
 */

export function App() {
  return (
    <AuthProvider>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/"element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/usuarios" element={<Usuarios />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/profile/edit" element={<EditProfile />}/>
          </Route>
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </main>

      <Footer />
    </AuthProvider>
  );
}



