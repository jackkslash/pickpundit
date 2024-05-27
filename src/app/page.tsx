import { auth, signIn, signOut } from "@/auth"

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Hello {session?.user?.username} !</p>

    </main>
  );
}
