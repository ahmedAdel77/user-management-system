import { Role } from "../enums/role.enum";

/** AuthUser */
export interface AuthUser {
  username: string;
  email: string;
  password: string;
  role: Role;
}
