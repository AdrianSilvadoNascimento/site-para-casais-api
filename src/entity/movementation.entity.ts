import { EmployeeModel } from '../dtos/employee-model';
import { ItemEntity } from './item.entity';
import { UserEntity } from './user.entity';

export class MovementationEntity {
  move_type: string;
  quantity: number;
  item_id?: string;
  item?: ItemEntity;
  user_id?: string;
  user?: UserEntity;
  employee_id?: string;
  employee?: EmployeeModel;
  created_at: Date;
  updated_at?: Date;
}
