import { auth, signIn, signOut } from "@/auth"

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session != null ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <p>Hello {session.user?.username} !</p>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button type="submit">Sign Out</button>
          </form>
          <a href="/me">Me</a>
        </div>
      ) : (
        <form
          action={async () => {
            "use server"
            await signIn("google")
          }}
        >
          <button type="submit">Signin with Google</button>
        </form>
      )}
    </main>
  );
}
