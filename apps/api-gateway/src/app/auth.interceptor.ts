// // src/interceptors/auth-client.interceptor.ts
// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { Request } from 'express';
// import { isObject } from 'class-validator';

// @Injectable()
// export class AuthClientInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const httpContext = context.switchToHttp();
//     const request = httpContext.getRequest<Request>();

//     // 1. Lấy thông tin user từ request (đã được Guard chèn vào)
//     const user = request['user'];

//     // Kiểm tra xem có user info không
//     if (!user || !user.userId || !user.role) {
//       // Nếu không có thông tin user, cho phép tiếp tục mà không thêm context
//       // Hoặc ném lỗi nếu yêu cầu phải có user context
//       return next.handle();
//     }

//     // 2. Lấy đối số thứ hai của context (thường là message/data gửi đi)
//     const messageData = context.getArgs()[1];

//     // 3. Đóng gói payload để bao gồm cả data gốc và auth context
//     let payload = messageData;

//     // Nếu messageData là một đối tượng, chúng ta sẽ bọc nó lại
//     if (isObject(messageData)) {
//       payload = {
//         data: messageData,
//         authContext: {
//           userId: user.userId,
//           role: user.role,
//         },
//       };
//     } else {
//       // Xử lý các trường hợp đặc biệt (ví dụ: chỉ gửi ID)
//       // Trong trường hợp này, messageData là ID (number)
//       // Chúng ta sẽ gửi nó dưới dạng object
//       payload = {
//         data: messageData,
//         authContext: {
//           userId: user.userId,
//           role: user.role,
//         },
//       };
//     }

//     // 4. Ghi đè đối số message data trong context
//     // Đây là thủ thuật để NestJS Microservice Client sử dụng payload đã thay đổi
//     context.getArgs()[1] = payload;

//     return next.handle();
//   }
// }
