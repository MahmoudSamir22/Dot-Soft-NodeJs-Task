import airports from "../data/airport.json";
import prisma from "../client";

export default async function seedNationality() {
  const existedAirports = await prisma.air_Port.findFirst();
  if (!existedAirports) {
    await prisma.air_Port.createMany({
      data: airports,
    });
  }
}
