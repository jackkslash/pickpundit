import db from "@/db";
import { competitions, fixtures, teams } from "@/db/schema";
import { max, sql, eq, gt } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import Link from "next/link";

export default async function Home() {

  const dataComps = await db.select().from(competitions)
    .where(eq(competitions.active, true))
    .orderBy(competitions.id)

  return (
    <main className="flex flex-col justify-between p-24">
      {dataComps.map((comp: any) => (
        <div key={comp.id}>
          <Link href={`/${comp.id}`}>{comp.formalName}</Link>
          <h2>{comp.informalName}</h2>
          <p>{comp.code}</p>
          <p>{comp.type}</p>
          <p>{comp.emblem}</p>
          <p>{comp.currentMatchday}</p>
        </div>
      ))}
    </main>
  );
}
