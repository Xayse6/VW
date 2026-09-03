import { Link, useParams } from "react-router-dom";
import "../css/marcas.css";
import { useMarcaHooks } from "../hook/marca";

export default function MarcaForm() {
  const { id } = useParams(); // pega o id da URL (se existir)
  const isEdit = Boolean(id);

  const {
    nomeMarca,
    setNomeMarca,
    carregando,
    erro,
    sucesso,
    handleSubmit,
  } = useMarcaHooks(id); // passa o id para o hook

  return (
    <>
      {/* TOAST */}
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
          <h1>{isEdit ? "Alterar Marca" : "Cadastrar Marca"}</h1>
          <p>
            {isEdit
              ? "Altere os dados da marca abaixo."
              : "Preencha os dados abaixo para cadastrar uma nova marca."}
          </p>
        </div>

        <div className="usuario-form-table">
          <div className="UserForm-form">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="nome_marca">Nome da Marca</label>
                <input
                  type="text"
                  id="nome_marca"
                  name="nome_marca"
                  placeholder="Digite o nome da marca"
                  value={nomeMarca}
                  onChange={(e) => setNomeMarca(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>

              <button type="submit" disabled={carregando}>
                {carregando
                  ? isEdit
                    ? "Salvando..."
                    : "Cadastrando..."
                  : isEdit
                  ? "Salvar Alterações"
                  : "Cadastrar Marca"}
              </button>
            </form>
          </div>

          <div className="UserForm-footer">
            <p>
              <Link className="no-underline" to="/marcas">
                Voltar para marcas
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}