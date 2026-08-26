import "../css/marca.css";

import {Link} from "react-router-dom";

export default function MarcaForm() {
    return (
        <main className="usuarios-form-container">

            <div className="usuarios-form-header">
                <h1>Cadastrar Marca</h1>
                <p>Preencha os dados abaixo para cadastrar uma nova marca.</p>
            </div>
            <div className="usuario-form-table">
                <div className="UserForm-form">
                    <form>
                        <div>

                            <label htmlFor="nome_Marca">
                                Nome da Marca
                            </label>

                            <input
                                type="text"
                                id="nome_Marca"
                                name="nome_Marca"
                                placeholder="Digite o nome da marca"
                                value={nome_Marca}
                                onChange={(event) =>
                                    setNome_Marca(
                                        event.target.value
                                    )
                                }
                                maxLength={100}
                                required
                            />

                        </div>

                        {/* Sigla */}

                        <div>

                            <label htmlFor="sigla_Marca">
                                Sigla da Marca
                            </label>

                            <input
                                type="text"
                                id="sigla_Marca"
                                name="sigla_Marca"
                                placeholder="Digite a sigla da marca"
                                value={sigla_Marca}
                                onChange={(event) =>
                                    setSigla_Marca(
                                        event.target.value.toUpperCase()
                                    )
                                }
                                maxLength={5}
                                required
                            />

                        </div>

                        {/* Botão */}

                        <button
                            type="submit"
                            disabled={carregando}
                        >
                            {carregando
                                ? modoEdicao
                                    ? "Salvando..."
                                    : "Cadastrando..."
                                : modoEdicao
                                    ? "Salvar Alterações"
                                    : "Cadastrar Marca"}
                        </button>

                    </form>

                </div>

                {/* Rodapé */}

                <div className="UserForm-footer">

                    <p>

                        <Link
                            className="no-underline"
                            to="/marcas"
                        >
                            Voltar para marcas
                        </Link>

                    </p>

                </div>

            </div>

        </main>
    );
}