import { ItemEntity } from './item.entity';
import { MovementationEntity } from './movementation.entity';
import { UserEntity } from './user.entity';

export class EmployeeEntity {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  type?: number;
  employerEmail?: string;

  user_id?: string;
  user?: UserEntity;

  item?: ItemEntity[];
  movementations?: MovementationEntity[];

  created_at: Date;
  updated_at: Date;
}
