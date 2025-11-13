import { SetMetadata } from '@nestjs/common';

export const MESSAGE_KEY = 'message';

/**
 * Đặt message mặc định cho route
 */
export const Message = (message: string) => SetMetadata(MESSAGE_KEY, message);
