import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../dto/api-response';
import { PageResponse } from '../dto/page-response';
import { Reflector } from '@nestjs/core';
import { MESSAGE_KEY } from '../decorators/message.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    constructor(private readonly reflector: Reflector) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        let message = this.reflector.get<string>(MESSAGE_KEY, context.getHandler());
        if (!message) {
            message = 'Thao tác thành công';
        }
        return next.handle().pipe(
            map((data) => {
                if (data && (data as PageResponse<T>).pagination) {
                    return {
                        status: 'success',
                        message: message,
                        data: data.data,
                        pagination: data.pagination,
                    };
                }
                return {
                    status: 'success',
                    message: message,
                    data: data,
                };
            }),
        );
    }
}
