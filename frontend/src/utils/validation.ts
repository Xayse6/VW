/**
 * Funcoes de validacao de formularios utilizadas no frontend.
 * Espelham (de forma simplificada) as regras aplicadas no backend,
 * dando feedback imediato ao usuario antes do envio da requisicao.
 */

export interface FieldErrors {
  [key: string]: string | undefined;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name: string): string | undefined {
  if (!name.trim()) return 'O nome e obrigatorio.';
  if (name.trim().length < 2) return 'O nome deve ter pelo menos 2 caracteres.';
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'O e-mail e obrigatorio.';
  if (!EMAIL_REGEX.test(email.trim())) return 'Informe um e-mail valido.';
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'A senha e obrigatoria.';
  if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
  return undefined;
}

export function validateRegisterForm(values: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FieldErrors {
  const errors: FieldErrors = {};

  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  if (!errors.password && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'As senhas nao coincidem.';
  }

  return errors;
}

export function validateLoginForm(values: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  if (!values.password) errors.password = 'A senha e obrigatoria.';

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}
