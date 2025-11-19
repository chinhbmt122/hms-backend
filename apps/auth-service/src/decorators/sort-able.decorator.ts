// decorators/sortable.decorator.ts
import 'reflect-metadata'

export const SORTABLE_KEY = 'sortable:fields'

export function Sortable() {
  return (target: any, propertyKey: string) => {
    const fields: string[] = Reflect.getMetadata(SORTABLE_KEY, target) || []
    Reflect.defineMetadata(SORTABLE_KEY, [...new Set([...fields, propertyKey])], target)
  }
}

export function getSortableFields(dto: any): string[] {
  return Reflect.getMetadata(SORTABLE_KEY, dto.prototype) || []
}
