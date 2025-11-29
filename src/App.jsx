import { useState } from 'react'
import Navigation from './components/Navigation'
import ControlPanel from './components/ControlPanel'
import GradientPreview from './components/GradientPreview'

function App() {
    const [gradientType, setGradientType] = useState('linear')
    const [angle, setAngle] = useState(90)
    const [radialPosition, setRadialPosition] = useState({ x: 50, y: 50 })
    const [colorStops, setColorStops] = useState([
        { id: 1, color: '#4f46e5', position: 0 },
        { id: 2, color: '#06b6d4', position: 100 }
    ])
    const [meshNodes, setMeshNodes] = useState([
        { id: 1, x: 20, y: 20, color: '#4f46e5' },
        { id: 2, x: 80, y: 80, color: '#06b6d4' },
        { id: 3, x: 20, y: 80, color: '#ec4899' },
        { id: 4, x: 80, y: 20, color: '#8b5cf6' }
    ])

    const addColorStop = () => {
        const newId = Math.max(...colorStops.map(s => s.id), 0) + 1
        setColorStops([...colorStops, { id: newId, color: '#ffffff', position: 50 }])
    }

    const removeColorStop = (id) => {
        if (colorStops.length > 2) {
            setColorStops(colorStops.filter(s => s.id !== id))
        }
    }

    const updateColorStop = (id, updates) => {
        setColorStops(colorStops.map(s => s.id === id ? { ...s, ...updates } : s))
    }

    const randomizeGradient = () => {
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
        setColorStops(colorStops.map(s => ({ ...s, color: randomColor() })))
        setMeshNodes(meshNodes.map(n => ({ ...n, color: randomColor() })))
        setAngle(Math.floor(Math.random() * 360))
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <Navigation />

            <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
                {/* Mobile: Sticky Preview on Top */}
                <div className="lg:hidden sticky top-14 z-40 bg-background pb-4">
                    <GradientPreview
                        gradientType={gradientType}
                        colorStops={colorStops}
                        angle={angle}
                        radialPosition={radialPosition}
                        meshNodes={meshNodes}
                        setMeshNodes={setMeshNodes}
                    />
                </div>

                {/* Desktop: Side-by-side layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                        <ControlPanel
                            gradientType={gradientType}
                            setGradientType={setGradientType}
                            colorStops={colorStops}
                            addColorStop={addColorStop}
                            removeColorStop={removeColorStop}
                            updateColorStop={updateColorStop}
                            angle={angle}
                            setAngle={setAngle}
                            radialPosition={radialPosition}
                            setRadialPosition={setRadialPosition}
                            meshNodes={meshNodes}
                            setMeshNodes={setMeshNodes}
                            randomizeGradient={randomizeGradient}
                        />
                    </div>

                    {/* Desktop: Preview */}
                    <div className="hidden lg:block lg:col-span-8 space-y-4 sm:space-y-6">
                        <GradientPreview
                            gradientType={gradientType}
                            colorStops={colorStops}
                            angle={angle}
                            radialPosition={radialPosition}
                            meshNodes={meshNodes}
                            setMeshNodes={setMeshNodes}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App
