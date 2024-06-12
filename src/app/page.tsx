import { auth } from "@/auth";
import db from "@/db";
import { competitions } from "@/db/schema";
import Competions from "./components/Competitions";

export default async function Home() {
  const session = await auth();

  const dataComps = await db.select().from(competitions)
    .orderBy(competitions.id)

  const dataCompsFiltered = dataComps.filter((comp: any) => comp.active == true)

  if (session?.user.role == "admin") {
    return (
      <main className="flex flex-col justify-between p-24">
        <Competions comps={dataComps} />
      </main>
    );
  }

  return (
    <main className="flex flex-col justify-between p-24">
      <Competions comps={dataCompsFiltered} />
    </main>
  );
}
