import type { Metadata } from "next";
import "./globals.css";
import { URLSyncProvider } from "@/components/URLSyncProvider";

export const metadata: Metadata = {
    title: "Currency Swap",
    description: "A modern currency swap website",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <URLSyncProvider>
                    {children}
                </URLSyncProvider>
            </body>
        </html>
    );
}
