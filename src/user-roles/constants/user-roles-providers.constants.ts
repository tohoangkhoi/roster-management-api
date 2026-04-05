export const USER_ROLE_REPOSITORY = 'USER_ROLE_REPOSITORY';

export const ROLE_INFORMATION = {
  ADMIN: {
    value: 'ADMIN',
    name: 'Admin',
    route: [],
    landing: '',
  },
  STAFF: {
    value: 'STAFF',
    name: 'Staff',
    route: [],
    landing: '',
  },
} as const;

export type RoleValue = keyof typeof ROLE_INFORMATION;

export const ROLE_VALUES = Object.keys(ROLE_INFORMATION);
