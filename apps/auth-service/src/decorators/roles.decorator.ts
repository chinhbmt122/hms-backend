import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/role';

export const Roles = (...role: Role[]) => SetMetadata('ROLE', role);
