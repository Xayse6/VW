import assert from 'node:assert/strict';
import test from 'node:test';

import { requirePermission } from '../middleware/auth';
import { getPermissionsForRole } from '../utils/permissions';

test('adm deve possuir permissões administrativas', () => {
  const permissions = getPermissionsForRole('adm');

  assert.ok(permissions.includes('users.view'));
  assert.ok(permissions.includes('users.delete'));
  assert.ok(permissions.includes('settings.manage'));
});

test('requirePermission bloqueia usuário sem permissão', () => {
  const req = {
    user: {
      sub: 'user-1',
      email: 'cliente@teste.com',
      role: 'client',
      permissions: ['profile.edit'],
    },
  } as any;

  const res = {} as any;

  assert.throws(
    () => requirePermission('users.view')(req, res, () => undefined),
    /Acesso negado/i
  );
});

test('requirePermission permite usuário com permissão válida', () => {
  let called = false;

  const req = {
    user: {
      sub: 'user-1',
      email: 'admin@teste.com',
      role: 'adm',
      permissions: ['users.view', 'settings.manage'],
    },
  } as any;

  const res = {} as any;

  requirePermission('users.view')(req, res, () => {
    called = true;
  });

  assert.equal(called, true);
});
