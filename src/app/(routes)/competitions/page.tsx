import { SubmitComp } from "@/app/actions/actions";
import Competitions from "@/app/components/Competitions";
import CompForm from "@/app/components/CompForm";
import { auth } from "@/auth";
import db from "@/db";
import { competitions } from "@/db/schema";

export default async function Comps() {
    const dataComps = await db.select().from(competitions)
    const session = await auth();
    return (
        <div className="flex min-h-screen flex-col items-center py-6 space-y-10">
            <Competitions comps={dataComps} />
            <br />
            {session?.user?.role === 'admin' && (
                <CompForm SubmitComp={SubmitComp} />
            )}
        </div>
    )
}