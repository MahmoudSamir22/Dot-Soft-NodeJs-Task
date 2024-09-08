import nationalities from "../data/nationality.json";
import prisma from "../client";

export default async function seedNationality() {
  const existedNationalities = await prisma.nationality.findFirst();
  if (!existedNationalities) {
    await prisma.nationality.createMany({
      data: nationalities,
    });
  }
}
