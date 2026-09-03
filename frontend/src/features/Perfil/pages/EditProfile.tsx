import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';

import { getErrorMessage } from '../../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../../services/userService';

import {
  type FieldErrors,
  hasErrors,
  validateEmail,
  validateName,
} from '../../../utils/validation';

/**
 * Tela de edicao dos dados do usuario.
 *
 * Permite alterar nome e e-mail e,
 * opcionalmente, alterar a senha.
 */
export function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // O User do frontend usa "nome" e "email"
  const [nome, setNome] = useState(user?.nome_usuario ?? '');
  const [email, setEmail] = useState(user?.email_usuario ?? '');

  const [currentPassword, setCurrentPassword] =
    useState('');

  const [newPassword, setNewPassword] =
    useState('');

  const [confirmNewPassword, setConfirmNewPassword] =
    useState('');

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [formError, setFormError] =
    useState<string | null>(null);

  const [successMessage, setSuccessMessage] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    const nomeError = validateName(nome);

    if (nomeError) {
      errors.name = nomeError;
    }

    const emailError = validateEmail(email);

    if (emailError) {
      errors.email = emailError;
    }

    const wantsPasswordChange = Boolean(
      newPassword ||
      confirmNewPassword ||
      currentPassword
    );

    if (wantsPasswordChange) {
      if (!currentPassword) {
        errors.currentPassword =
          'Informe sua senha atual.';
      }

      if (
        !newPassword ||
        newPassword.length < 6
      ) {
        errors.newPassword =
          'A nova senha deve ter pelo menos 6 caracteres.';
      }

      if (
        newPassword !== confirmNewPassword
      ) {
        errors.confirmNewPassword =
          'As senhas não coincidem.';
      }
    }

    return errors;
  }

  async function handleSubmit(
    event: React.FormEvent
  ): Promise<void> {
    event.preventDefault();

    setFormError(null);
    setSuccessMessage(null);

    if (!user) {
      return;
    }

    const errors = validate();

    setFieldErrors(errors);

    if (hasErrors(errors)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updated =
        await userService.update(
          user.id_usuario,
          {
            nome_usuario: nome.trim(),
            email_usuario: email.trim(),

            ...(newPassword
              ? {
                  currentPassword,
                  newPassword,
                }
              : {}),
          }
        );

      setUser(updated);

      setNome(updated.nome_usuario);
      setEmail(updated.email_usuario);

      setSuccessMessage(
        'Informações atualizadas com sucesso.'
      );

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      setFormError(
        getErrorMessage(error)
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteAccount(): Promise<void> {
    if (!user) {
      return;
    }

    const confirmed = window.confirm(
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.'
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setFormError(null);

    try {
      await userService.remove(user.id_usuario);

      navigate('/login');
    } catch (error) {
      setFormError(
        getErrorMessage(error)
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="page">
      <h1>Editar Informações</h1>

      {formError && (
        <Alert
          type="error"
          message={formError}
        />
      )}

      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
        />
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="edit-form"
      >
        <FormInput
          label="Nome completo"
          name="nome_usuario"
          type="text"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          error={fieldErrors.name}
        />

        <FormInput
          label="E-mail"
          name="email_usuario"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          error={fieldErrors.email}
        />

        <h2 className="edit-form__section-title">
          Alterar senha (opcional)
        </h2>

        <FormInput
          label="Senha atual"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(
              e.target.value
            )
          }
          error={fieldErrors.currentPassword}
        />

        <FormInput
          label="Nova senha"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
          error={fieldErrors.newPassword}
        />

        <FormInput
          label="Confirmar nova senha"
          name="confirmNewPassword"
          type="password"
          autoComplete="new-password"
          value={confirmNewPassword}
          onChange={(e) =>
            setConfirmNewPassword(
              e.target.value
            )
          }
          error={
            fieldErrors.confirmNewPassword
          }
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          Salvar alterações
        </Button>
      </form>

      <div className="danger-zone">
        <h2>Zona de risco</h2>

        <p>
          Excluir sua conta é uma ação permanente
          e não pode ser desfeita.
        </p>

        <Button
          variant="danger"
          onClick={handleDeleteAccount}
          isLoading={isDeleting}
        >
          Excluir minha conta
        </Button>
      </div>
    </div>
  );
}