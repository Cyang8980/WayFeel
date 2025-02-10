import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <div className="min-h-screen bg-gray-100 text-black">
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
}
