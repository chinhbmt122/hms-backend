// src/common/decorators/auth-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Custom Decorator để lấy thông tin người dùng đã được xác thực (user object hoặc thuộc tính cụ thể)
 * * Giả định rằng MicroserviceAuthGuard đã chèn thông tin user vào request['user']
 * request['user'] = { userId: 123, role: 'ADMIN' };
 */
export const AuthUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request['user'] as any; // Lấy đối tượng user đã được Guard chèn vào

    if (!user) {
      // Tùy chọn: Ném lỗi nếu thông tin user bị thiếu (dù Guard đã chạy)
      // throw new UnauthorizedException('Thông tin người dùng không tìm thấy trong request.');
      return data ? undefined : {};
    }

    // Nếu có key được truyền vào (ví dụ: @AuthUser('role'))
    if (data) {
      return user[data];
    }

    // Nếu không có key, trả về toàn bộ đối tượng user
    return user;
  }
);

/**
 * Custom Decorator tiện ích để chỉ lấy ra User ID
 */
export const AuthUserId = () => AuthUser('userId');
