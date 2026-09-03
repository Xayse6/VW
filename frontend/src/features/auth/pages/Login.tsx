import "../css/usuarioLogin.css";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { getErrorMessage } from '../../../services/api';
import { useAuth } from '../../hooks/useAuth';

import {
  type FieldErrors,
  hasErrors,
  validateLoginForm,
} from '../../../utils/validation';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [formError, setFormError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent
  ): Promise<void> {
    event.preventDefault();

    setFormError(null);

    const errors = validateLoginForm({
      email,
      password,
    });

    setFieldErrors(errors);

    if (hasErrors(errors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        email_usuario: email.trim(),
        password,
      });

      navigate('/');
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <h1>Login</h1>
        <p>Entre na plataforma Velox Wrap</p>
      </div>

      <div className="login-form-table">

        {formError && (
          <Alert
            type="error"
            message={formError}
          />
        )}

        <div className="login-form">

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
          <p className="auth-switch">
            Não tem uma conta?{' '}
            <Link to="/register">
              Cadastre-se
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}