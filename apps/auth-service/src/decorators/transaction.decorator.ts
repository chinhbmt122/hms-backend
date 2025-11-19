// import { PrismaClient } from '@prisma/client'

// export function Transaction() {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value

//     descriptor.value = async function (...args: any[]) {
//       const prisma: PrismaClient = this.prisma
//       if (!prisma) {
//         throw new Error('Prisma client not found on class instance')
//       }

//       // Nếu đã trong transaction thì dùng lại tx hiện tại
//       if (prisma instanceof PrismaClient) {
//         return prisma.$transaction(async (tx) => {
//           const oldPrisma = this.prisma
//           this.prisma = tx
//           try {
//             return await originalMethod.apply(this, args)
//           } finally {
//             this.prisma = oldPrisma
//           }
//         })
//       } else {
//         // Đang trong transaction, gọi luôn
//         return originalMethod.apply(this, args)
//       }
//     }

//     return descriptor
//   }
// }
