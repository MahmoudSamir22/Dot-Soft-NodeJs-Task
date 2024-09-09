import seedNationality from "./nationality.seeding";
import seedAirport from "./airpot.seeding";
import seedAirway from "./airway-companies.seeding";
import seedSysAdmins from "./sysAdmin.seeding";

export default async function seeding () {
    await seedNationality();
    await seedAirport();
    await seedAirway();
    await seedSysAdmins();
}