import { AccountStatus } from '@hms-backend/constants';
import { Account } from '../entities/account.entity';

export function enumToArray<T extends Record<string, string>>(
  enumObj: T
): { label: string; value: string }[] {
  return Object.entries(enumObj).map(([key, value]) => ({
    label: capitalizeFirstLetter(key.toLowerCase()),
    value,
  }));
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const getAccountStatus = (account: Account) => {
  if (account.deletedAt) return AccountStatus.DELETED;
  return AccountStatus.ACTIVE;
};
