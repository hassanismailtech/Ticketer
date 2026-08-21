import * as PrismaClientPackage from "@prisma/client";

const runtimeClient =
  (PrismaClientPackage as any).PrismaClient ??
  (PrismaClientPackage as any).default ??
  PrismaClientPackage;

export const PrismaClient: any = runtimeClient;
