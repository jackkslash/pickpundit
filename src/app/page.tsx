import { auth, signIn, signOut } from "@/auth"

export default async function Home() {
  const session = await auth();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session != null ? (
        <div>
          <p>Hello {session.user?.name} !</p>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <button type="submit">Sign Out</button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server"
            await signIn("reddit")
          }}
        >
          <button type="submit">Signin with Google</button>
        </form>
      )}
      <pre>
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}
