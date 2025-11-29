import { Moon, Sun, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navigation() {
    const [isDark, setIsDark] = useState(false)
    const [showAbout, setShowAbout] = useState(false)

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    return (
        <>
            <nav className="sticky top-0 z-50 glass-blur border-b border-border/50">
                <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <svg
                            className="w-6 h-6 sm:w-8 sm:h-8"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                                </linearGradient>
                                <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                                </linearGradient>
                                <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                            <circle cx="10" cy="10" r="8" fill="url(#grad1)" opacity="0.8" />
                            <circle cx="22" cy="10" r="8" fill="url(#grad2)" opacity="0.8" />
                            <circle cx="16" cy="20" r="8" fill="url(#grad3)" opacity="0.8" />
                        </svg>
                        <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Dientaura
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setShowAbout(!showAbout)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-muted smooth-transition hover-lift"
                            title="About"
                        >
                            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-muted smooth-transition hover-lift"
                            title={isDark ? "Light mode" : "Dark mode"}
                        >
                            {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                        <a
                            href="https://x.com/K_artikkkk"
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 sm:p-2 sm:px-3 rounded-lg hover:bg-muted smooth-transition hover-lift flex items-center gap-2 text-sm font-medium"
                            title="Follow on X"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span className="hidden sm:inline">@K_artikkkk</span>
                        </a>
                    </div>
                </div>
            </nav>

            {showAbout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowAbout(false)}>
                    <div className="glass-blur rounded-2xl p-6 sm:p-8 max-w-md mx-4 shadow-2xl border border-border" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">About Dientaura</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                            Dientaura is a modern, minimalist gradient maker designed to help you create beautiful gradients effortlessly.
                            Whether you need linear, radial, conic, or mesh gradients, Dientaura provides an intuitive interface with real-time preview.
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                            Built with React and Tailwind CSS, focusing on user experience and performance.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <a
                                href="https://x.com/K_artikkkk"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-600 smooth-transition font-medium"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                @K_artikkkk
                            </a>
                            <button
                                onClick={() => setShowAbout(false)}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:scale-105 smooth-transition w-full sm:w-auto"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
