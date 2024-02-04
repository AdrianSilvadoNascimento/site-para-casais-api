import { ItemEntity } from './item.entity';
import { ClientEntity } from './client.entity';
import { MovementationEntity } from './movementation.entity';
import { EmployeeEntity } from './employee.entity';

export class UserEntity {
  name: string;
  email: string;
  password: string;
  type: number;

  confirmed_email: boolean;
  is_assinant: boolean;
  is_trial: boolean;
  expiration_trial: Date;

  item?: ItemEntity[];
  movementations?: MovementationEntity[];
  clients?: ClientEntity[];
  employee?: EmployeeEntity[];

  created_at: Date;
  updated_at: Date;
}
