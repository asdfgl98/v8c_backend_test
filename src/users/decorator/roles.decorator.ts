import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'user_roles';

export const Roles = (role: string)=> SetMetadata(ROLES_KEY, role)