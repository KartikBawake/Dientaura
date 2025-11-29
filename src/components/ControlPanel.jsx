import { useState, useCallback, useRef } from 'react'
import { Plus, Trash2, Shuffle } from 'lucide-react'

export default function ControlPanel({
    gradientType,
    setGradientType,
    colorStops,
    addColorStop,
    removeColorStop,
    updateColorStop,
    angle,
    setAngle,
    radialPosition,
    setRadialPosition,
    meshNodes,
    setMeshNodes,
    randomizeGradient
}) {
    const [colorFormat, setColorFormat] = useState('hex')
    const colorUpdateTimeout = useRef(null)

    const gradientTypes = [
        { id: 'linear', name: 'Linear' },
        { id: 'radial', name: 'Radial' },
        { id: 'conic', name: 'Conic' },
        { id: 'mesh', name: 'Mesh' }
    ]

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }

    const hexToHsl = (hex) => {
        const rgb = hexToRgb(hex)
        if (!rgb) return null

        const r = rgb.r / 255
        const g = rgb.g / 255
        const b = rgb.b / 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2

        if (max === min) {
            h = s = 0
        } else {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
                case g: h = ((b - r) / d + 2) / 6; break
                case b: h = ((r - g) / d + 4) / 6; break
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        }
    }

    const rgbToHex = (r, g, b) => {
        const toHex = (n) => {
            const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    const hslToHex = (h, s, l) => {
        h = h / 360
        s = s / 100
        l = l / 100

        let r, g, b
        if (s === 0) {
            r = g = b = l
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1
                if (t > 1) t -= 1
                if (t < 1 / 6) return p + (q - p) * 6 * t
                if (t < 1 / 2) return q
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
                return p
            }
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q
            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }

        return rgbToHex(r * 255, g * 255, b * 255)
    }

    const formatColor = (hex) => {
        switch (colorFormat) {
            case 'rgb':
                const rgb = hexToRgb(hex)
                return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : hex
            case 'hsl':
                const hsl = hexToHsl(hex)
                return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : hex
            default:
                return hex
        }
    }

    const handleColorChange = useCallback((id, color) => {
        if (colorUpdateTimeout.current) {
            cancelAnimationFrame(colorUpdateTimeout.current)
        }
        colorUpdateTimeout.current = requestAnimationFrame(() => {
            updateColorStop(id, { color })
        })
    }, [updateColorStop])

    return (
        <div className="glass-blur rounded-2xl p-6 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Configuration</h2>
                <button
                    onClick={randomizeGradient}
                    className="p-2 rounded-lg hover:bg-muted smooth-transition hover-lift group"
                    title="Randomize gradient"
                >
                    <Shuffle className="w-4 h-4 group-hover:rotate-180 smooth-transition" />
                </button>
            </div>

            <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Gradient Type</label>
                <div className="grid grid-cols-2 gap-2 mt-3">
                    {gradientTypes.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setGradientType(type.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium smooth-transition border-2 transform hover:scale-105 ${gradientType === type.id
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/50'
                                : 'bg-muted hover:bg-muted/80 border-border hover:border-primary/50 hover:shadow-md'
                                }`}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>
            </div>

            {(gradientType === 'linear' || gradientType === 'conic') && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                        Angle: {angle}°
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={angle}
                        onChange={(e) => setAngle(Number(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                </div>
            )}

            {(gradientType === 'radial' || gradientType === 'conic') && (
                <div className="space-y-3">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Position X: {radialPosition.x}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={radialPosition.x}
                            onChange={(e) => setRadialPosition({ ...radialPosition, x: Number(e.target.value) })}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Position Y: {radialPosition.y}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={radialPosition.y}
                            onChange={(e) => setRadialPosition({ ...radialPosition, y: Number(e.target.value) })}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>
                </div>
            )}

            {gradientType !== 'mesh' && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">Color Stops</label>
                        <div className="flex gap-2">
                            <select
                                value={colorFormat}
                                onChange={(e) => setColorFormat(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg bg-muted border border-border hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary smooth-transition cursor-pointer"
                            >
                                <option value="hex">HEX</option>
                                <option value="rgb">RGB</option>
                                <option value="hsl">HSL</option>
                            </select>
                            <button
                                onClick={addColorStop}
                                className="p-1.5 rounded-lg hover:bg-muted smooth-transition hover-lift"
                                title="Add color stop"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {colorStops.map((stop) => (
                            <div
                                key={stop.id}
                                className="p-3 rounded-lg bg-muted/50 space-y-2 group hover:bg-muted smooth-transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={stop.color}
                                            onChange={(e) => handleColorChange(stop.id, e.target.value)}
                                            className="w-12 h-12 rounded-lg cursor-pointer border-0 smooth-transition outline-none"
                                            style={{ backgroundColor: stop.color }}
                                        />
                                    </div>

                                    {colorFormat === 'hex' && (
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={stop.color.toUpperCase()}
                                                onChange={(e) => {
                                                    const value = e.target.value
                                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                        updateColorStop(stop.id, { color: value })
                                                    }
                                                }}
                                                className="w-full px-3 py-2 text-sm bg-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary smooth-transition"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    )}

                                    {colorFormat === 'rgb' && (() => {
                                        const rgb = hexToRgb(stop.color) || { r: 0, g: 0, b: 0 }
                                        return (
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <div>
                                                    <label className="text-xs text-muted-foreground block mb-1">R</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="255"
                                                        value={rgb.r}
                                                        onChange={(e) => {
                                                            const r = Math.max(0, Math.min(255, parseInt(e.target.value) || 0))
                                                            const newHex = rgbToHex(r, rgb.g, rgb.b)
                                                            updateColorStop(stop.id, { color: newHex })
                                                        }}
                                                        className="w-full px-2 py-1.5 text-sm bg-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary smooth-transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted-foreground block mb-1">G</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="255"
                                                        value={rgb.g}
                                                        onChange={(e) => {
                                                            const g = Math.max(0, Math.min(255, parseInt(e.target.value) || 0))
                                                            const newHex = rgbToHex(rgb.r, g, rgb.b)
                                                            updateColorStop(stop.id, { color: newHex })
                                                        }}
                                                        className="w-full px-2 py-1.5 text-sm bg-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary smooth-transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted-foreground block mb-1">B</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="255"
                                                        value={rgb.b}
                                                        onChange={(e) => {
                                                            const b = Math.max(0, Math.min(255, parseInt(e.target.value) || 0))
                                                            const newHex = rgbToHex(rgb.r, rgb.g, b)
                                                            updateColorStop(stop.id, { color: newHex })
                                                        }}
                                                        className="w-full px-2 py-1.5 text-sm bg-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary smooth-transition"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })()}

                                    {colorFormat === 'hsl' && (() => {
                                        const hsl = hexToHsl(stop.color) || { h: 0, s: 0, l: 0 }
                                        return (
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <div>
                                                    <label className="text-xs text-muted-foreground block mb-1">H</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="360"
                                                        value={hsl.h}
                                                        onChange={(e) => {
                                                            const h = Math.max(0, Math.min(360, parseInt(e.target.value) || 0))
                                                            const newHex = hslToHex(h, hsl.s, hsl.l)
                                                            updateColorStop(stop.id, { color: newHex })
                                                        }}
                                                        className="w-full px-2 py-1.5 text-sm bg-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary smooth-transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted-foreground block mb-1">S</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={hsl.s}
                                                        onChange={(e) => {
                                                            const s = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                                                            const newHex = hslToHex(hsl.h, s, hsl.l)
                                                            updateColorStop(stop.id, { color: newHex })
                                                        }}
                                                        className="w-full px-2 py-1.5 text-sm bg-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary smooth-transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted-foreground block mb-1">L</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={hsl.l}
                                                        onChange={(e) => {
                                                            const l = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                                                            const newHex = hslToHex(hsl.h, hsl.s, l)
                                                            updateColorStop(stop.id, { color: newHex })
                                                        }}
                                                        className="w-full px-2 py-1.5 text-sm bg-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary smooth-transition"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })()}

                                    {colorStops.length > 2 && (
                                        <button
                                            onClick={() => removeColorStop(stop.id)}
                                            className="p-2 rounded-lg hover:bg-background smooth-transition opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={stop.position}
                                    onChange={(e) => updateColorStop(stop.id, { position: Number(e.target.value) })}
                                    className="w-full h-1 bg-background rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {gradientType === 'mesh' && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">Mesh Nodes</label>
                        <button
                            onClick={() => {
                                const newNode = {
                                    id: Date.now(),
                                    x: 50,
                                    y: 50,
                                    color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
                                }
                                setMeshNodes([...meshNodes, newNode])
                            }}
                            className="p-1 rounded-lg hover:bg-muted smooth-transition hover-lift"
                            title="Add mesh node"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {meshNodes.map((node) => (
                            <div
                                key={node.id}
                                className="p-3 rounded-lg bg-muted/50 group hover:bg-muted smooth-transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={node.color}
                                            onChange={(e) => {
                                                setMeshNodes(meshNodes.map(n =>
                                                    n.id === node.id ? { ...n, color: e.target.value } : n
                                                ))
                                            }}
                                            className="w-12 h-12 rounded-lg cursor-pointer border-0 smooth-transition outline-none"
                                            style={{ backgroundColor: node.color }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{node.color.toUpperCase()}</p>
                                        <p className="text-xs text-muted-foreground">Drag in preview to position</p>
                                    </div>
                                    {meshNodes.length > 2 && (
                                        <button
                                            onClick={() => setMeshNodes(meshNodes.filter(n => n.id !== node.id))}
                                            className="p-2 rounded-lg hover:bg-background smooth-transition opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
