import { auth } from "@/auth"
import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await auth();

    if (session?.user?.username != null) {
        redirect("/")
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <p>Hello {session?.user?.name} !</p>
                <form className="flex flex-col gap-2"
                    action={async (formData: FormData) => {
                        "use server"

                        const u = formData.get("username") as string
                        await db.update(users).set({ username: u })
                            .where(eq(users.email, session?.user?.email as string))

                        redirect("/")
                    }}
                >
                    <input type="text" name="username" />
                    <button type="submit">Set Username</button>
                </form>
            </div>
        </main>
    );
}
