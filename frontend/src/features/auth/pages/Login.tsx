import "../css/usuarioLogin.css";

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { Alert } from "../../components/Alert";
import { Button } from "../../components/Button";
import { FormInput } from "../../components/FormInput";

import { useLogin } from "../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    submit,
    fieldErrors,
    formError,
    isSubmitting,
  } = useLogin();

  async function handleSubmit(
    event: FormEvent
  ): Promise<void> {
    event.preventDefault();
    await submit(email, password);
  }

  return (
    <div className="container-login">
      <div className="cabecalho-login">
        <h1>Login</h1>
        <p>Entre na plataforma Velox Wrap</p>
      </div>

      <div className="cartao-login">

        {formError && (
          <Alert
            type="error"
            message={formError}
          />
        )}

        <div className="formulario-login">

          <form onSubmit={handleSubmit} noValidate>

            <div>
              <FormInput
                label="E-mail"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                error={fieldErrors.email}
              />
            </div>

            <div>
              <FormInput
                label="Senha"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                error={fieldErrors.password}
              />
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Entrar
            </Button>

          </form>
        </div>

        <div>
          <p className="alternar-autenticacao">
            Não tem uma conta?{" "}
            <Link to="/register">
              Cadastre-se
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
