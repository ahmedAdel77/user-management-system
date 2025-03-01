import { Status } from "../enums/status.enum";

/** User */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  status: Status;
}
