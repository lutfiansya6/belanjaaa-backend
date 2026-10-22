import { JwtPayload } from '../auth.service.js';
export declare const CurrentUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof JwtPayload | import("@nestjs/common").ParameterDecoratorOptions | undefined)[]) => ParameterDecorator;
