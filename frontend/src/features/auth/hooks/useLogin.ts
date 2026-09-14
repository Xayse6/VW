import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from './useAuth';
import { validateLoginForm } from '../../../utils/validation';
import { getErrorMessage } from '../../../services/api';

type FieldErrors = {
  email?: string;
  password?: string;
};

function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [formError, setFormError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function submit(
    email: string,
    password: string
  ): Promise<void> {
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

  return {
    submit,
    fieldErrors,
    formError,
    isSubmitting,
  };
}
