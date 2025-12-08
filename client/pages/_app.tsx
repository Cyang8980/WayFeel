import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { WayfeelApolloProvider } from "@/components/ApolloProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <WayfeelApolloProvider>
      <div className="min-h-screen bg-gray-100 text-black">
        <Component {...pageProps} />
      </div>
      </WayfeelApolloProvider>
    </ClerkProvider>
  );
}
