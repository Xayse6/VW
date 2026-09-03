import { useState, useEffect } from "react";
import { api, getErrorMessage } from "../../../services/api";

export function useMarcaHooks(id?: string) {
  const [nomeMarca, setNomeMarca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const isEdit = Boolean(id);

  useEffect(() => {
    if (!id) return;

    async function carregarMarca() {
      try {
        const response = await api.get<{
          marca: {
            id_marca: string;
            nome_marca: string;
          };
        }>(`/marcas/${id}`);

        setNomeMarca(
          response.data.marca.nome_marca
        );
      } catch (error) {
        setErro(getErrorMessage(error));
      } finally {
        setCarregando(false);
      }
    }

    carregarMarca();
  }, [id]);

  useEffect(() => {
    if (sucesso) {
      const timer = setTimeout(
        () => setSucesso(null),
        3000
      );

      return () => clearTimeout(timer);
    }
  }, [sucesso]);

  useEffect(() => {
    if (erro) {
      const timer = setTimeout(
        () => setErro(null),
        4000
      );

      return () => clearTimeout(timer);
    }
  }, [erro]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setCarregando(true);
      setErro(null);
      setSucesso(null);

      if (isEdit) {
        await api.put(`/marcas/${id}`, {
          nome_marca: nomeMarca,
        });

        setSucesso(
          "Marca alterada com sucesso!"
        );
      } else {
        await api.post(
          "/marcas/cadastroMarca",
          {
            nome_marca: nomeMarca,
          }
        );

        setSucesso(
          "Marca cadastrada com sucesso!"
        );

        setNomeMarca("");
      }
    } catch (error) {
      setErro(getErrorMessage(error));
    } finally {
      setCarregando(false);
    }
  }

  return {
    nomeMarca,
    setNomeMarca,
    carregando,
    erro,
    sucesso,
    handleSubmit,
  };
}