// decorators/searchable.decorator.ts
import 'reflect-metadata';

export const SEARCHABLE_KEY = 'searchable:fields';
export const SEARCHABLE_TYPES_KEY = 'searchable:types';

export function Searchable(type: 'string' | 'number' = 'string') {
  return (target: any, propertyKey: string) => {
    // Lấy danh sách field hiện tại (mảng string)
    const fields: string[] = Reflect.getMetadata(SEARCHABLE_KEY, target) || [];
    // Lấy map kiểu hiện tại (object { fieldName: type })
    const types: Record<string, 'string' | 'number'> =
      Reflect.getMetadata(SEARCHABLE_TYPES_KEY, target) || {};

    // Nếu field chưa có thì thêm vào danh sách
    if (!fields.includes(propertyKey)) {
      Reflect.defineMetadata(SEARCHABLE_KEY, [...fields, propertyKey], target);
    }
    // Lưu kiểu cho field
    types[propertyKey] = type;
    Reflect.defineMetadata(SEARCHABLE_TYPES_KEY, types, target);
  };
}

// Lấy danh sách field
export function getSearchableFields(dto: any): string[] {
  return Reflect.getMetadata(SEARCHABLE_KEY, dto.prototype) || [];
}

// Lấy map kiểu của các field
export function getSearchableFieldTypes(
  dto: any,
): Record<string, 'string' | 'number'> {
  return Reflect.getMetadata(SEARCHABLE_TYPES_KEY, dto.prototype) || {};
}
