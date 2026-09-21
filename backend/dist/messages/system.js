"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYSTEM_MESSAGES = void 0;
exports.SYSTEM_MESSAGES = {
    ENV_MISSING: (name) => `${name} nao configurada. Verifique o arquivo .env.`,
    USER_CREATE_FAILED: 'Falha ao recuperar usuário cadastrado.',
    MODELO_CREATE_FAILED: 'Falha ao recuperar modelo recém-criado.',
};
