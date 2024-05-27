import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function Home() {
    const session = await auth();

    if (session == null || session.user.role != "admin") {
        redirect("/")
    }

    return (
        <main className="flex min-h-screen flex-col items-center py-20 space-y-10">
            <div>
                <p>Hello {session?.user?.name} !</p>
            </div>
        </main>
    );
}
