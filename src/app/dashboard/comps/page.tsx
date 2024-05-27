import { SubmitComp } from "@/app/actions/actions";
import Competitions from "@/app/components/Competitions";
import SubmitCompForm from "@/app/components/SubmitCompForm";
import db from "@/db";
import { competitions } from "@/db/schema";

export default async function Comps() {
    const dataComps = await db.select().from(competitions)
    return (
        <div className="flex min-h-screen flex-col items-center py-6 space-y-10">
            <Competitions comps={dataComps} />
            <br />
            <SubmitCompForm SubmitComp={SubmitComp} />
        </div>
    )
}