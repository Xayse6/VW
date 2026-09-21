import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/usuarios.css";

import { Alert } from "../../components/Alert";
import { getErrorMessage } from "../../../services/api";
import { userService } from "../../../services/userService";
import { useAuth } from "../../auth/hooks/useAuth";
import type { User } from "../../../types";

type FiltroRole = "todos" | "client" | "adm" | "emp";

export default function Usuarios() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "adm";

  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const [filtroRole, setFiltroRole] = useState<FiltroRole>("todos");

  async function excluirUsuario(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setFormError(null);

      await userService.remove(id);

      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.filter(
          (usuario) => usuario.id_usuario !== id
        )
      );
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    let ativo = true;

    async function carregar() {
      try {
        setIsLoading(true);
        setFormError(null);

        if (!isAdmin) {
          if (ativo && user) {
            setUsuarios([user]);
          }
          return;
        }

        const data = await userService.getAll();

        if (ativo) {
          setUsuarios(data);
        }
      } catch (error) {
        if (ativo) {
          setFormError(getErrorMessage(error));
        }
      } finally {
        if (ativo) {
          setIsLoading(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [isAuthenticated, user, isAdmin]);

  function formatarRole(role: User["role"]) {
    switch (role) {
      case "adm":
        return "Administrador";

      case "emp":
        return "Funcionário";

      case "client":
        return "Cliente";

      default:
        return "Cliente";
    }
  }

  const usuariosVisiveis = isAdmin ? usuarios : [user].filter(Boolean) as User[];

  // Filtra os usuários de acordo com o botão selecionado
  const usuariosFiltrados = usuariosVisiveis.filter((usuario) => {
    if (filtroRole === "todos") {
      return true;
    }

    return usuario.role === filtroRole;
  });

  return (
    <main className="usuarios-container">

      <section className="usuarios-header">
        <div>
          <h1>Usuários</h1>

          <p>
            {isAdmin
              ? "Gerenciamento completo de usuários do sistema"
              : "Você só pode visualizar o seu perfil"}
          </p>
        </div>

        {isAdmin && (
          <Link
            to="/register"
            className="btn-novo"
          >
            <i className="fas fa-user-plus"></i>
            Novo Usuário
          </Link>
        )}
      </section>

      <section className="usuarios-card">

        {isAdmin && (
          <div className="filtros-usuarios">
            <button
              type="button"
              className={filtroRole === "todos" ? "filtro-ativo" : ""}
              onClick={() => setFiltroRole("todos")}
            >
              Todos
            </button>

            <button
              type="button"
              className={filtroRole === "client" ? "filtro-ativo" : ""}
              onClick={() => setFiltroRole("client")}
            >
              Clientes
            </button>

            <button
              type="button"
              className={filtroRole === "adm" ? "filtro-ativo" : ""}
              onClick={() => setFiltroRole("adm")}
            >
              ADMs
            </button>

            <button
              type="button"
              className={filtroRole === "emp" ? "filtro-ativo" : ""}
              onClick={() => setFiltroRole("emp")}
            >
              Funcionários
            </button>
          </div>
        )}

        <div className="table-container">

          {formError && (
            <Alert type="error" message={formError} />
          )}

          {isLoading ? (
            <p>Carregando usuários...</p>
          ) : (
            <table className="usuarios-table">

              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Perfil</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>

                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id_usuario}>

                      <td>
                        {usuario.nome_usuario}
                      </td>

                      <td>
                        {usuario.email_usuario}
                      </td>

                      <td>
                        {formatarRole(usuario.role)}
                      </td>

                      <td>
                        <div className="acoes">

                          {usuario.id_usuario === user?.id_usuario ? (
                            <Link
                              to="/profile/edit"
                              className="btn-editar"
                            >
                              <i className="fas fa-edit"></i>
                              Editar
                            </Link>
                          ) : (
                            <span className="btn-editar-disabled" title="Somente o próprio usuário pode editar seu perfil">
                              —
                            </span>
                          )}

                          <button
                            type="button"
                            className="btn-excluir"
                            onClick={() =>
                              excluirUsuario(
                                usuario.id_usuario
                              )
                            }
                          >
                            <i className="fas fa-trash"></i>
                            Excluir
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>
          )}

        </div>

      </section>

    </main>
  );
}