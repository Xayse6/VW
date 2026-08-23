import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/hooks/useAuth';

import './css/navbar.css';

export default function Navbar() {
  const {
    isAuthenticated,
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  function handleLogout(): void {
    logout();
    navigate('/login');
  }

  const isADM = user?.role === 'adm';
  const isClient = user?.role ==='client';

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-container-logo">
          <Link className="logo" to="/">
            <img
              src="/src/assets/logo.png"
              alt="Velox Wrap"
              className="navbar-logo"
            />

            <span className="logo-title">
              Velox Wrap
            </span>
          </Link>
        </div>

        <div className="navbar-container-service">
          <ul className="navbar-container-service-list">

            <div className="navbar-container-service-list-item">

              <li>
                <Link
                  className="item-link"
                  to="/galeria"
                >
                  Galeria
                </Link>
              </li>

              <li>
                <Link
                  className="item-link"
                  to="/servicos"
                >
                  Serviços
                </Link>
              </li>

              <li>
                <Link
                  className="item-link"
                  to="/contato"
                >
                  Contato
                </Link>
              </li>

            </div>

            <div className="navbar-container-user-list-user">

              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      className="user-link"
                      to="/"
                    >
                      Inicio
                    </Link>
                  </li>

                  {/* SOMENTE ADMIN */}
                  {isADM && (
                    <>
                      <li>
                        <Link
                          className="user-link"
                          to="/usuarios"
                        >
                          Usuarios
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="user-link"
                          to="/modelos"
                        >
                          Modelos
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="user-link"
                          to="/marcas"
                        >
                          Marcas
                        </Link>
                      </li>
                    </>
                  )}

                  {/* CLIENT E ADMIN */}
                  {isClient && (
                    <>
                    <li>  
                      <Link
                        className="user-link"
                        to="/veiculos"
                      >
                        Veiculos
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="user-link"
                        to="/agendamentos"
                      >
                        Agendamentos
                      </Link>
                    </li>
                    </>
                  )}

                  <li>
                    <Link
                      className="user-link"
                      to="/profile"
                    >
                      Meu Perfil
                    </Link>
                  </li>

                  <li>
                    <button
                      className="user-button"
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      className="nav-link"
                      to="/login"
                    >
                      Entrar
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="nav-link"
                      to="/register"
                    >
                      Cadastrar
                    </Link>
                  </li>
                </>
              )}

            </div>

          </ul>
        </div>

      </div>
    </nav>
  );
}