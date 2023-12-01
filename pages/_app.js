import "@/styles/globals.css";
import { SessionProvider, getSession, useSession } from "next-auth/react";
import { useEffect } from "react";
import "flowbite";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      window.location.href = "/";
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
