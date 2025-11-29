import { useRef, useEffect, useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'

export default function GradientPreview({ gradientType, colorStops, angle, radialPosition, meshNodes, setMeshNodes }) {
    const canvasRef = useRef(null)
    const [copied, setCopied] = useState(false)
    const [draggingNode, setDraggingNode] = useState(null)
    const previewRef = useRef(null)
    const rafId = useRef(null)

    const handleNodeMouseDown = (nodeId, e) => {
        e.stopPropagation()
        setDraggingNode(nodeId)
    }

    const handleMouseMove = useCallback((e) => {
        if (!draggingNode || !previewRef.current) return

        // Cancel any pending animation frame
        if (rafId.current) {
            cancelAnimationFrame(rafId.current)
        }

        // Schedule update on next frame
        rafId.current = requestAnimationFrame(() => {
            const rect = previewRef.current.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100

            const clampedX = Math.max(0, Math.min(100, x))
            const clampedY = Math.max(0, Math.min(100, y))

            setMeshNodes(prevNodes => prevNodes.map(n =>
                n.id === draggingNode ? { ...n, x: clampedX, y: clampedY } : n
            ))
        })
    }, [draggingNode, setMeshNodes])

    const handleMouseUp = useCallback(() => {
        setDraggingNode(null)
        if (rafId.current) {
            cancelAnimationFrame(rafId.current)
        }
    }, [])

    useEffect(() => {
        if (draggingNode) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
                if (rafId.current) {
                    cancelAnimationFrame(rafId.current)
                }
            }
        }
    }, [draggingNode, handleMouseMove, handleMouseUp])

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 }
    }

    const generateMeshGradient = () => {
        const gradients = meshNodes.map((node) =>
            `radial-gradient(circle at ${node.x}% ${node.y}%, ${node.color} 0%, transparent 50%)`
        ).join(', ')
        return gradients
    }

    const generateGradientCSS = () => {
        const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)
        const stopsString = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ')

        switch (gradientType) {
            case 'linear':
                return `linear-gradient(${angle}deg, ${stopsString})`
            case 'radial':
                return `radial-gradient(circle at ${radialPosition.x}% ${radialPosition.y}%, ${stopsString})`
            case 'conic':
                return `conic-gradient(from ${angle}deg at ${radialPosition.x}% ${radialPosition.y}%, ${stopsString})`
            case 'mesh':
                return generateMeshGradient()
            default:
                return `linear-gradient(${angle}deg, ${stopsString})`
        }
    }

    useEffect(() => {
        if (gradientType === 'mesh' && canvasRef.current) {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')
            const width = canvas.width
            const height = canvas.height

            ctx.clearRect(0, 0, width, height)

            const imageData = ctx.createImageData(width, height)
            const data = imageData.data

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0, totalWeight = 0

                    meshNodes.forEach(node => {
                        const dx = (x / width * 100) - node.x
                        const dy = (y / height * 100) - node.y
                        const distance = Math.sqrt(dx * dx + dy * dy)
                        const weight = 1 / (1 + distance * distance / 500)

                        const color = hexToRgb(node.color)
                        r += color.r * weight
                        g += color.g * weight
                        b += color.b * weight
                        totalWeight += weight
                    })

                    const idx = (y * width + x) * 4
                    data[idx] = r / totalWeight
                    data[idx + 1] = g / totalWeight
                    data[idx + 2] = b / totalWeight
                    data[idx + 3] = 255
                }
            }

            ctx.putImageData(imageData, 0, 0)
        }
    }, [gradientType, meshNodes])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateGradientCSS())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="glass-blur rounded-2xl p-8 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>

            <div
                ref={previewRef}
                className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-border/50"
                style={{ cursor: draggingNode ? 'grabbing' : 'default' }}
            >
                {gradientType === 'mesh' ? (
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={450}
                        className="w-full h-full"
                    />
                ) : (
                    <div
                        className="w-full h-full smooth-transition"
                        style={{ background: generateGradientCSS() }}
                    />
                )}

                {gradientType === 'mesh' && (
                    <div className="absolute inset-0 pointer-events-none">
                        {meshNodes.map(node => (
                            <div
                                key={node.id}
                                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                                className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-3 border-white shadow-xl smooth-transition pointer-events-auto ${draggingNode === node.id ? 'scale-150 cursor-grabbing' : 'hover:scale-125 cursor-grab'
                                    }`}
                                style={{
                                    left: `${node.x}%`,
                                    top: `${node.y}%`,
                                    backgroundColor: node.color,
                                    boxShadow: draggingNode === node.id
                                        ? `0 0 20px ${node.color}, 0 10px 30px rgba(0,0,0,0.3)`
                                        : `0 4px 10px rgba(0,0,0,0.2)`
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={copyToClipboard}
                        className="p-2 rounded-lg glass-blur hover:bg-muted smooth-transition hover-lift"
                        title="Copy CSS code"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-500 animate-scale-in" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
