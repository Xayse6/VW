export type UserRole = 'adm' | 'client' | 'emp';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  adm: [
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'models.view',
    'models.create',
    'models.update',
    'models.delete',
    'brands.view',
    'brands.create',
    'brands.update',
    'brands.delete',
    'settings.manage',
    'reports.export',
    'profile.view',
    'profile.edit',
  ],
  client: [
    'profile.view',
    'profile.edit',
    'models.view',
    'brands.view',
  ],
  emp: [
    'profile.view',
    'profile.edit',
    'models.view',
    'brands.view',
    'models.create',
    'models.update',
  ],
};

export function getPermissionsForRole(role: UserRole): string[] {
  return [...(ROLE_PERMISSIONS[role] ?? [])];
}

export function hasPermission(
  permissions: string[] | undefined,
  permission: string
): boolean {
  return Boolean(permissions?.includes(permission));
}
