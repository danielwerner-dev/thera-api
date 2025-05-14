import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersService } from "./services/users.service"
import { UserRepository } from "./repositories/user.repository"
import { User } from "./entities/user.entity"

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
    {
      provide: "IUsersService",
      useClass: UsersService,
    },
  ],
  exports: ["IUsersService"],
})
export class UsersModule {}
