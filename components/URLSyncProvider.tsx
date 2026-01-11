"use client";

import { useURLSync } from "@/hooks/useURLSync";
import { Suspense } from "react";

/**
 * URLSyncProvider Component
 * 
 * Handles synchronization between Zustand store and URL query parameters.
 */
function URLSyncInner({ children }: { children: React.ReactNode; }) {
    useURLSync();
    return <>{children}</>;
}

export function URLSyncProvider({ children }: { children: React.ReactNode; }) {
    return (
        <Suspense fallback={children}>
            <URLSyncInner>
                {children}
            </URLSyncInner>
        </Suspense>
    );
}
