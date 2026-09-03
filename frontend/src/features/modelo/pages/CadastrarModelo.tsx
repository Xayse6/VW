import { Link, useParams } from "react-router-dom";

import "../css/modelos.css";

import { useModeloHooks } from "../hooks/modelo";

export default function ModeloForm() {
  const { id } = useParams();

  const isEdit = Boolean(id);

  const {
    nomeModelo,
    setNomeModelo,

    idMarca,
    setIdMarca,

    anoModelo,
    setAnoModelo,

    marcas,

    carregando,
    erro,
    sucesso,
    handleSubmit,
  } = useModeloHooks(id);

  return (
    <>
      {sucesso && (
        <div className="toast toast-sucesso">
          {sucesso}
        </div>
      )}

      {erro && (
        <div className="toast toast-erro">
          {erro}
        </div>
      )}

      <main className="usuarios-form-container">

        <div className="usuarios-form-header">
          <h1>
            {isEdit
              ? "Alterar Modelo"
              : "Cadastrar Modelo"}
          </h1>

          <p>
            {isEdit
              ? "Altere os dados do modelo abaixo."
              : "Preencha os dados abaixo para cadastrar um novo modelo."}
          </p>
        </div>

        <div className="usuario-form-table">

          <div className="UserForm-form">

            <form onSubmit={handleSubmit}>

              <div>
                <label htmlFor="id_marca">
                  Marca
                </label>

                <select
                  id="id_marca"
                  name="id_marca"
                  value={idMarca}
                  onChange={(e) =>
                    setIdMarca(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Selecione uma marca
                  </option>

                  {marcas.map((marca) => (
                    <option
                      key={marca.id_marca}
                      value={marca.id_marca}
                    >
                      {marca.nome_marca}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="nome_modelo">
                  Nome do Modelo
                </label>

                <input
                  type="text"
                  id="nome_modelo"
                  name="nome_modelo"
                  placeholder="Digite o nome do modelo"
                  value={nomeModelo}
                  onChange={(e) =>
                    setNomeModelo(
                      e.target.value
                    )
                  }
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label htmlFor="ano_modelo">
                  Ano do Modelo
                </label>

                <input
                  type="number"
                  id="ano_modelo"
                  name="ano_modelo"
                  value={anoModelo}
                  onChange={(e) =>
                    setAnoModelo(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  min={1900}
                  max={2100}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={carregando}
              >
                {carregando
                  ? isEdit
                    ? "Salvando..."
                    : "Cadastrando..."
                  : isEdit
                  ? "Salvar Alterações"
                  : "Cadastrar Modelo"}
              </button>

            </form>

          </div>

          <div className="UserForm-footer">
            <p>
              <Link
                className="no-underline"
                to="/modelos"
              >
                Voltar para modelos
              </Link>
            </p>
          </div>

        </div>

      </main>
    </>
  );
}