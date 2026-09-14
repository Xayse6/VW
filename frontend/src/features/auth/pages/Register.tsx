import "../css/usuarioForm.css";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';

import { useRegister } from '../hooks/useRegister';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const {
    submit,
    fieldErrors,
    formError,
    isSubmitting,
  } = useRegister();

  async function handleSubmit(
    event: React.FormEvent
  ): Promise<void> {
    event.preventDefault();

    await submit({
      name,
      email,
      password,
      confirmPassword,
    });
  }

  return (
    <main className="usuarios-form-container">
      <div className="usuarios-form-header">
        <h1>Criar conta</h1>

        <p className="auth-subtitle">
          Cadastre-se para gerenciar suas informações
          de acesso.
        </p>
      </div>

      <div className="usuario-form-table">
        {formError && (
          <Alert
            type="error"
            message={formError}
          />
        )}

        <div className="UserForm-form">
          <form
            onSubmit={handleSubmit}
            noValidate
          >
            <FormInput
              label="Nome completo"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              error={fieldErrors.name}
            />

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

            <FormInput
              label="Senha"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              error={fieldErrors.password}
            />

            <FormInput
              label="Confirmar senha"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              error={fieldErrors.confirmPassword}
            />

            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Cadastrar
            </Button>
          </form>

          <p className="auth-switch">
            Já tem uma conta?{' '}
            <Link to="/login">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
