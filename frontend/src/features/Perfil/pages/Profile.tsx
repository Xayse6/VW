import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import "../css/profile.css";

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="perfil-container">
        <div className="perfil-card">
          <div className="perfil-info">
            <p>Carregando informações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <section className="perfil-card">
        <div className="perfil-header">
          <div className="avatar">
            {user.nome_usuario?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1>{user.nome_usuario}</h1>
            <p>Informações da conta</p>
          </div>
        </div>

        <div className="perfil-info">
          <h2>Meu Perfil</h2>

          <div className="profile-card">
            <div className="profile-field">
              <span className="profile-label">Nome</span>
              <strong className="profile-value">
                {user.nome_usuario}
              </strong>
            </div>

            <div className="profile-field">
              <span className="profile-label">E-mail</span>
              <strong className="profile-value">
                {user.email_usuario}
              </strong>
            </div>

            <div className="profile-field">
              <span className="profile-label">Cadastrado em</span>
              <strong className="profile-value">
                {user.created_at_usuario
                  ? new Date(
                      user.created_at_usuario
                    ).toLocaleDateString("pt-BR")
                  : "Não informado"}
              </strong>
            </div>

            <div className="profile-field">
              <span className="profile-label">
                Última atualização
              </span>

              <strong className="profile-value">
                {user.updated_at_usuario
                  ? new Date(
                      user.updated_at_usuario
                    ).toLocaleDateString("pt-BR")
                  : "Não informado"}
              </strong>
            </div>
          </div>

          <Link
            to="/profile/edit"
            className="btn-editar"
          >
            Editar informações
          </Link>
        </div>
      </section>
    </div>
  );
}