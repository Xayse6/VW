import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/modelos.css";

import { api, getErrorMessage } from "../../../services/api";
import { useAuth } from "../../hooks/useAuth";

type Modelo = {
  id_modelo: string;
  id_marca: string;
  nome_marca: string;
  nome_modelo: string;
  ano_modelo: number;
};

export default function Modelos() {
  const { isAuthenticated } = useAuth();

  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  async function excluirModelo(id: string) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este modelo?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setFormError(null);

      await api.delete(`/modelos/${id}`);

      setModelos((modelosAtuais) =>
        modelosAtuais.filter(
          (modelo) => modelo.id_modelo !== id
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

        const response = await api.get<{
          modelos: Modelo[];
        }>("/modelos");

        if (ativo) {
          setModelos(response.data.modelos);
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
          <h1>Modelos</h1>

          <p>
            Gerenciamento completo de modelos do sistema
          </p>
        </div>

        <Link
          to="/cadastrarModelo"
          className="btn-novo"
        >
          <i className="fas fa-plus"></i>
          Novo Modelo
        </Link>
      </section>

      <section className="usuarios-card">
        <div className="table-container">

          {formError && (
            <p className="erro">
              {formError}
            </p>
          )}

          {isLoading ? (
            <p>Carregando modelos...</p>
          ) : (
            <table className="usuarios-table">

              <thead>
                <tr>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>

                {modelos.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      Nenhum modelo encontrado.
                    </td>
                  </tr>
                ) : (
                  modelos.map((modelo) => (
                    <tr key={modelo.id_modelo}>

                      <td>{modelo.nome_marca}</td>

                      <td>{modelo.nome_modelo}</td>

                      <td>{modelo.ano_modelo}</td>

                      <td>
                        <div className="acoes">

                          <Link
                            to={`/modelo/edit/${modelo.id_modelo}`}
                            className="btn-editar"
                          >
                            <i className="fas fa-edit"></i>
                            Editar
                          </Link>

                          <button
                            type="button"
                            className="btn-excluir"
                            onClick={() =>
                              excluirModelo(
                                modelo.id_modelo
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