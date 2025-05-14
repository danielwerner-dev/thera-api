import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { ConfigService } from "@nestjs/config"
import { AuthService } from "./services/auth.service"
import { AuthController } from "./controllers/auth.controller"
import { UsersModule } from "../users/users.module"
import { JwtStrategy } from "./strategies/jwt.strategy"
import { jwtConstants } from "./constants"

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET") || jwtConstants.secret,
        signOptions: { expiresIn: configService.get("JWT_EXPIRES_IN") || jwtConstants.expiresIn },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: "IAuthService",
      useClass: AuthService,
    },
    JwtStrategy,
  ],
  exports: ["IAuthService"],
})
export class AuthModule {}
