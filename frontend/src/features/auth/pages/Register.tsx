import "../css/usuarioForm.css"
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
  validateRegisterForm,
} from '../../../utils/validation';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

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

    const errors = validateRegisterForm({
      name,
      email,
      password,
      confirmPassword,
    });

    setFieldErrors(errors);

    if (hasErrors(errors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        nome_usuario: name.trim(),
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
            <form onSubmit={handleSubmit} noValidate>
                <div>
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
                </div>
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
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                setPassword(e.target.value)
                }
                error={fieldErrors.password}
            />
</div>
<div>
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
</div>
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