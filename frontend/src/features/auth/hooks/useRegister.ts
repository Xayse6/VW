import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getErrorMessage } from '../../../services/api';
import { useAuth } from './useAuth';

import {
  type FieldErrors,
  hasErrors,
  validateRegisterForm,
} from '../../../utils/validation';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function useRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [formError, setFormError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function submit({
    name,
    email,
    password,
    confirmPassword,
  }: RegisterData): Promise<void> {
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

  return {
    submit,
    fieldErrors,
    formError,
    isSubmitting,
  };
}
