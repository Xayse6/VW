export const COMMON_ERRORS = {
  INVALID_ID: 'ID inválido.',
  INVALID_ID_USER: 'ID do usuario invalido.',
  INVALID_DATA: 'Dados invalidos.',
  DUPLICATE_RECORD: 'Registro já cadastrado.',
  EMAIL_ALREADY_REGISTERED: 'E-mail já cadastrado.',
  UNEXPECTED_SERVER: 'Erro inesperado do servidor. Tente novamente mais tarde.',
  ROUTE_NOT_FOUND: (method: string, url: string) =>
    `Rota nao encontrada: ${method} ${url}`,
};
