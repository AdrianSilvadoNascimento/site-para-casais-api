import { ClientAddress } from "@prisma/client"

import { UserEntity } from "./user.entity"

export class ClientEntity {
  name: string
  lastname: string
  age: number
  email: string
  sex: string
  user_id: string
  user?: UserEntity
  created_at: Date
  updated_at: Date
  address?: ClientAddress
}
