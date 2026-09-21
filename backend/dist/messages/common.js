"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_ERRORS = void 0;
exports.COMMON_ERRORS = {
    INVALID_ID: 'ID inválido.',
    INVALID_ID_USER: 'ID do usuario invalido.',
    INVALID_DATA: 'Dados invalidos.',
    DUPLICATE_RECORD: 'Registro já cadastrado.',
    EMAIL_ALREADY_REGISTERED: 'E-mail já cadastrado.',
    UNEXPECTED_SERVER: 'Erro inesperado do servidor. Tente novamente mais tarde.',
    ROUTE_NOT_FOUND: (method, url) => `Rota nao encontrada: ${method} ${url}`,
};
