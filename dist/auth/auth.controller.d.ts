import { AuthService } from './auth.service.js';
import type { JwtPayload } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        accessToken: string;
        user: {
            shop: {
                name: string;
                id: string;
                city: string | null;
            } | null;
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
        };
    }>;
    getMe(user: JwtPayload): Promise<{
        shop: {
            name: string;
            id: string;
            city: string | null;
        } | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
