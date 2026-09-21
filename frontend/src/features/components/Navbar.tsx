import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/hooks/useAuth';
import logoImg from '../../assets/logo.png';

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
  const isClient = user?.role === 'client';

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-container-logo">
          <Link className="logo" to="/">
            <img
              src={logoImg}
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
                  to="/"
                >
                  Início
                </Link>
              </li>

              <li>
                <a
                  className="item-link"
                  href="/#servicos"
                >
                  Serviços
                </a>
              </li>

            </div>

            <div className="navbar-container-user-list-user">

              {isAuthenticated ? (
                <>
                  {/* SOMENTE ADMIN */}
                  {isADM && (
                    <>
                      <li>
                        <Link
                          className="user-link"
                          to="/usuarios"
                        >
                          Usuários
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

                  {/* CLIENT */}
                  {isClient && (
                    <>
                      <li>
                        <Link
                          className="user-link"
                          to="/modelos"
                        >
                          Modelos
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