import { EmployeeEntity } from "./employee.entity"
import { MovementationEntity } from "./movementation.entity"
import { UserEntity } from "./user.entity"

export class ItemEntity {
  id?: string
  name?: string
  category?: string
  unit_price?: number
  sale_price?: number
  barcode?: string
  quantity?: number
  product_image?: string
  user_id?: string
  user?: UserEntity
  employee_id?: string
  employee?: EmployeeEntity
  movementations?: MovementationEntity[]
  created_at: Date
  updated_at: Date
}
