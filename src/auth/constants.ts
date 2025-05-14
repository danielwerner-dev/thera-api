export const jwtConstants = {
  secret: process.env.JWT_SECRET || "sua_chave_secreta_muito_segura",
  expiresIn: process.env.JWT_EXPIRES_IN || "1h",
}
