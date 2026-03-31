export enum Role {
  CREATOR = 'creator',
  MANAGER = 'manager',
  SIGNER = 'signer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: Role;
  department?: string;
  avatar?: string;
}
