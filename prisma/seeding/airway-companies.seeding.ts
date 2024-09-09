import airway_companies from "../data/airway-companies.json";
import prisma from "../client";

export default async function seedNationality() {
  const existedNationalities = await prisma.airway_Company.findFirst();
  if (!existedNationalities) {
    await prisma.airway_Company.createMany({
      data: airway_companies,
    });
  }
}
