import seedNationality from "./nationality.seeding";

export default async function seeding () {
    await seedNationality();
}