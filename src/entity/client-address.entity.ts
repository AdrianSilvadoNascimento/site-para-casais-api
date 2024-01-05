import { ClientEntity } from "./client.entity";

export class ClientAddresEntity {
  street: string;
  house_number: number;
  neighborhood: string;
  postal_code: string;
  country: string;
  client_id: string;
  user: ClientEntity;

  created_at: Date;
  updated_at?: Date;
}
