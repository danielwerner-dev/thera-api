import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  email: string

  @ApiProperty()
  nome: string

  @ApiProperty()
  isAdmin: boolean
}

export class AuthResponseDto {
  @ApiProperty()
  user: UserDto

  @ApiProperty()
  access_token: string
}
