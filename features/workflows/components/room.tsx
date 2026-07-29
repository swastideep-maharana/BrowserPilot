"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ roomId, children }: { roomId: string, children: ReactNode }) {
    return (
        <LiveblocksProvider
            throttle={16}
            publicApiKey={"pk_dev_llL6pFpwIFjFnP8KNFGBD4ahRdLLpoqO6bJVAdejvkuVdZNHZILi5rGgPP0dqCbY"}>
            <RoomProvider id={roomId}>
                <ClientSideSuspense fallback={<div>Loading…</div>}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}