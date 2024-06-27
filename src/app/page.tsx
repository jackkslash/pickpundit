import { auth } from "@/auth";
import db from "@/db";
import { competitions } from "@/db/schema";
import Competitions from "./components/Competitions";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const dataComps = await db.select().from(competitions)
    .orderBy(competitions.id)

  const dataCompsFiltered = dataComps.filter((comp: any) => comp.active == true)
  return (
    <main>
      <Competitions comps={dataCompsFiltered} />
    </main>
  );
}
