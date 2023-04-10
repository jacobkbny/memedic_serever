import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './JWT/auth.controller';
import { AuthService } from './JWT/jwt.authService';
import { AuthModule } from './JWT/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    AuthModule
  ],
  controllers: [AppController,AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
