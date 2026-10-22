var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'belanjaaa_secret_key_jwt_token_2026',
                signOptions: { expiresIn: '1d' },
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService, JwtAuthGuard, RolesGuard],
        exports: [AuthService, JwtAuthGuard, RolesGuard],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map