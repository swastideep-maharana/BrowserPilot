"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Loader2 } from "lucide-react"

export function SessionReplay({ sessionId }: { sessionId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let hls: Hls | null = null

    const checkReplay = async () => {
      try {
        const res = await fetch(`/api/replays/${sessionId}`)
        if (res.status === 202) {
          // Not ready yet, poll again in 2 seconds
          timeoutId = setTimeout(checkReplay, 2000)
          return
        }

        if (!res.ok) {
          throw new Error("Failed to fetch replay")
        }

        const data = await res.json()
        
        // Browserbase ReplayRetrieveResponse shape: { pageCount, pages: [{ url: string, ... }] }
        if (!data.pages || data.pages.length === 0) {
          throw new Error("No replay pages found")
        }

        const playlistUrl = data.pages[0].url

        setIsReady(true)

        if (videoRef.current) {
          if (Hls.isSupported()) {
            hls = new Hls()
            hls.loadSource(playlistUrl)
            hls.attachMedia(videoRef.current)
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current?.play().catch(() => {
                // Auto-play might be blocked by browser policy
              })
            })
          } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari built-in support
            videoRef.current.src = playlistUrl
            videoRef.current.addEventListener("loadedmetadata", () => {
              videoRef.current?.play().catch(() => {})
            })
          }
        }
      } catch (err: any) {
        setError(err.message)
      }
    }

    checkReplay()

    return () => {
      clearTimeout(timeoutId)
      if (hls) {
        hls.destroy()
      }
    }
  }, [sessionId])

  if (error) {
    return <div className="flex h-full items-center justify-center text-sm text-destructive">{error}</div>
  }

  return (
    <div className="relative flex h-full w-full flex-col bg-black">
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
          <Loader2 className="size-8 animate-spin" />
          <p className="text-sm">Waiting for recording to process...</p>
        </div>
      )}
      <video 
        ref={videoRef} 
        controls 
        className="h-full w-full object-contain"
        playsInline
        muted // Muted to allow autoplay in most browsers
      />
    </div>
  )
}
