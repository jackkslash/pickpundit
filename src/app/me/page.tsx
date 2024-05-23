import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await auth();

    if (session == null) {
        redirect("/")
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <p>Hello {session?.user?.name} !</p>
                <form
                    action={async () => {
                        "use server"
                        await signOut()
                    }}
                >
                    <button type="submit">Sign Out</button>
                </form>
            </div>
            <pre>
                {JSON.stringify(session, null, 2)}
            </pre>
        </main>
    );
}
