import { useState, useEffect } from "react";
import { api, getErrorMessage } from "../../../services/api";

type Marca = {
  id_marca: string;
  nome_marca: string;
};

export function useModeloHooks(id?: string) {
  const [nomeModelo, setNomeModelo] = useState("");
  const [idMarca, setIdMarca] = useState("");
  const [anoModelo, setAnoModelo] = useState(
    new Date().getFullYear()
  );

  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const isEdit = Boolean(id);

  useEffect(() => {
    async function carregarMarcas() {
      try {
        const response = await api.get<{
          marcas: Marca[];
        }>("/marcas");

        setMarcas(response.data.marcas);
      } catch (error) {
        setErro(getErrorMessage(error));
      }
    }

    carregarMarcas();
  }, []);

  useEffect(() => {
    if (!id) return;

    async function carregarModelo() {
      try {
        setCarregando(true);

        const response = await api.get<{
          modelo: {
            id_modelo: string;
            id_marca: string;
            nome_modelo: string;
            ano_modelo: number;
          };
        }>(`/modelos/${id}`);

        setNomeModelo(
          response.data.modelo.nome_modelo
        );

        setIdMarca(
          response.data.modelo.id_marca
        );

        setAnoModelo(
          response.data.modelo.ano_modelo
        );
      } catch (error) {
        setErro(getErrorMessage(error));
      } finally {
        setCarregando(false);
      }
    }

    carregarModelo();
  }, [id]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setCarregando(true);
      setErro(null);

      const payload = {
        id_marca: idMarca,
        nome_modelo: nomeModelo,
        ano_modelo: anoModelo,
      };

      if (isEdit) {
        await api.put(
          `/modelos/${id}`,
          payload
        );

        setSucesso(
          "Modelo alterado com sucesso!"
        );
      } else {
        await api.post(
          "/modelos/cadastroModelo",
          payload
        );

        setSucesso(
          "Modelo cadastrado com sucesso!"
        );

        setNomeModelo("");
        setIdMarca("");
        setAnoModelo(
          new Date().getFullYear()
        );
      }
    } catch (error) {
      setErro(getErrorMessage(error));
    } finally {
      setCarregando(false);
    }
  }

return {
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
};
}