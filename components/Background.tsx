'use client'

import React from 'react'

export default function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2f1a] to-transparent opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(66,255,0,0.03),rgba(66,255,0,0)_50%)] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iMi41IiBoZWlnaHQ9IjIuNSIgeD0iMCIgeT0iMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTSAwIDAgTCAyIDAgTCAyIDIgTCAwIDIiIGZpbGw9IiMxMTExMTEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcCkiLz48L3N2Zz4=')] opacity-30 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none" />
      <div className="relative z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#42ff00]/20 animate-glitch"></div>
        {children}
      </div>
      <style jsx global>{`
        @keyframes glitch {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          27% {
            transform: translateX(-5px);
            opacity: 0.7;
          }
          28% {
            transform: translateX(5px);
            opacity: 0.7;
          }
          29% {
            transform: translateX(-5px);
            opacity: 0.7;
          }
          30% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-glitch {
          animation: glitch 4s infinite;
        }
      `}</style>
    </div>
  )
} 