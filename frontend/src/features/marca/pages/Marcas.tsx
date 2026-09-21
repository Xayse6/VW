import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/marcas.css";

import { Alert } from "../../components/Alert";
import { getErrorMessage } from "../../../services/api";
import { useAuth } from "../../auth/hooks/useAuth";
import { marcaService, type Marca } from "../service/marcaService";

export default function Marcas() {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "adm";

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  async function excluirMarca(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta marca?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setFormError(null);

      await marcaService.remove(id);

      setMarcas((marcasAtuais) =>
        marcasAtuais.filter(
          (marca) => marca.id_marca !== id
        )
      );
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let ativo = true;

    async function carregar() {
      try {
        setIsLoading(true);
        setFormError(null);

        const data = await marcaService.getAll();

        if (ativo) {
          setMarcas(data);
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
  }, [isAuthenticated]);

  return (
    <main className="usuarios-container">
      <section className="usuarios-header">
        <div>
          <h1>Marcas</h1>

          <p>
            {isAdmin
              ? "Gerenciamento completo de marcas do sistema"
              : "Você não tem permissão para gerenciar marcas"}
          </p>
        </div>

        {isAdmin && (
          <Link
            to="/cadastrarMarca"
            className="btn-novo"
          >
            <i className="fas fa-plus"></i>
            Nova Marca
          </Link>
        )}
      </section>

      <section className="usuarios-card">
        <div className="table-container">

          {formError && (
            <Alert type="error" message={formError} />
          )}

          {isLoading ? (
            <p>Carregando marcas...</p>
          ) : (
            <table className="usuarios-table">

              <thead>
                <tr>
                  <th>Nome da Marca</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {marcas.length === 0 ? (
                  <tr>
                    <td colSpan={2}>
                      Nenhuma marca encontrada.
                    </td>
                  </tr>
                ) : (
                  marcas.map((marca) => (
                    <tr key={marca.id_marca}>

                      <td>
                        {marca.nome_marca}
                      </td>

                      <td>
                        {isAdmin ? (
                          <div className="acoes">
                            <Link
                              to={`/marca/edit/${marca.id_marca}`}
                              className="btn-editar"
                            >
                              <i className="fas fa-edit"></i>
                              Editar
                            </Link>

                            <button
                              type="button"
                              className="btn-excluir"
                              onClick={() =>
                                excluirMarca(
                                  marca.id_marca
                                )
                              }
                            >
                              <i className="fas fa-trash"></i>
                              Excluir
                            </button>
                          </div>
                        ) : (
                          <span className="btn-editar-disabled">—</span>
                        )}
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