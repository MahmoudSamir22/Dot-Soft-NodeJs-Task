import bcrypt from "bcrypt";
import sysAdmins from "../data/system-admin-acounts.json";
import prisma from "../client";
import { Roles } from "../../src/enum/user.enums";

export default async function seedNationality() {
  const existedSystemAdmins = await prisma.user.findFirst({
    where: {
      email: { in: sysAdmins.map((sysAdmin) => sysAdmin.email) },
    },
  });
  if (!existedSystemAdmins) {
    await prisma.user.createMany({
      data: await Promise.all(
        sysAdmins.map(async (sysAdmin) => ({
          ...sysAdmin,
          password: await bcrypt.hash(sysAdmin.password, 8),
          role: Roles.SYSTEM_ADMIN,
          first_login: false,
        }))
      ),
    });
  }
}
