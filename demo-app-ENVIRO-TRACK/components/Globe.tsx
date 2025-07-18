'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface GlobeProps {
  pollutionLevel: number
  metrics: {
    co2Level: number
    toxicityLevel: number
    temperature: number
    humanPopulation: number
    animalPopulation: number
    plantPopulation: number
    oceanAcidity: number
    iceCapMelting: number
  }
  specialEvent?: string | null
}

function Earth({ pollutionLevel, metrics, specialEvent }: GlobeProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const [meteorPosition, setMeteorPosition] = useState<[number, number, number]>([0, 20, 0])
  const [explosionActive, setExplosionActive] = useState(false)
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  // Create Earth texture programmatically
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Fill with ocean blue
    ctx.fillStyle = '#006994'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw continents using simplified shapes
    const drawContinent = (path: number[][], color: string) => {
      ctx.beginPath()
      ctx.moveTo(path[0][0], path[0][1])
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0], path[i][1])
      }
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }
    
    // North America - simplified but recognizable
    drawContinent([
      [200, 120], [280, 100], [350, 110], [400, 130], [420, 160],
      [400, 190], [380, 210], [350, 220], [320, 210], [300, 190],
      [280, 170], [260, 150], [240, 130], [220, 120], [200, 120]
    ], '#90EE90')
    
    // South America - simplified but recognizable
    drawContinent([
      [280, 220], [300, 240], [320, 260], [340, 280], [360, 300],
      [380, 320], [400, 340], [420, 360], [400, 380], [380, 400],
      [360, 420], [340, 440], [320, 460], [300, 470], [280, 460],
      [260, 440], [240, 420], [220, 400], [240, 380], [260, 360],
      [280, 340], [300, 320], [320, 300], [300, 280], [280, 260]
    ], '#228B22')
    
    // Europe - simplified
    drawContinent([
      [480, 160], [500, 140], [520, 130], [540, 140], [560, 160],
      [580, 180], [560, 200], [540, 210], [520, 200], [500, 180],
      [480, 160]
    ], '#90EE90')
    
    // Africa - simplified but recognizable
    drawContinent([
      [480, 220], [500, 240], [520, 260], [540, 280], [560, 300],
      [580, 320], [600, 340], [620, 360], [640, 380], [660, 400],
      [680, 420], [700, 440], [720, 460], [700, 480], [680, 460],
      [660, 440], [640, 420], [620, 400], [600, 380], [580, 360],
      [560, 340], [540, 320], [520, 300], [500, 280], [480, 260]
    ], '#DAA520')
    
    // Asia - simplified but recognizable
    drawContinent([
      [700, 120], [720, 100], [740, 90], [760, 100], [780, 120],
      [800, 140], [820, 160], [840, 180], [860, 200], [880, 220],
      [900, 240], [920, 260], [940, 280], [960, 300], [980, 320],
      [960, 340], [940, 360], [920, 380], [900, 400], [880, 420],
      [860, 440], [840, 460], [820, 480], [800, 500], [780, 480],
      [760, 460], [740, 440], [720, 420], [700, 400], [680, 380],
      [660, 360], [640, 340], [620, 320], [600, 300], [580, 280],
      [560, 260], [540, 240], [520, 220], [500, 200], [480, 180],
      [500, 160], [520, 140], [540, 120], [560, 110], [580, 120],
      [600, 140], [620, 160], [640, 180], [660, 200], [680, 220],
      [700, 240], [720, 260], [740, 280], [760, 300], [780, 320],
      [800, 340], [820, 360], [840, 380], [860, 400], [880, 420],
      [900, 440], [920, 460], [940, 480], [920, 460], [900, 440],
      [880, 420], [860, 400], [840, 380], [820, 360], [800, 340],
      [780, 320], [760, 300], [740, 280], [720, 260], [700, 240]
    ], '#90EE90')
    
    // Australia - simplified
    drawContinent([
      [900, 320], [920, 300], [940, 290], [960, 300], [980, 320],
      [1000, 340], [980, 360], [960, 380], [940, 400], [920, 420],
      [900, 440], [880, 420], [860, 400], [840, 380], [820, 360],
      [800, 340], [820, 320], [840, 300], [860, 290], [880, 300],
      [900, 320]
    ], '#DAA520')
    
    // Polar ice caps
    // North Pole
    ctx.beginPath()
    ctx.arc(512, 50, 60, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    
    // South Pole
    ctx.beginPath()
    ctx.arc(512, 462, 50, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()
    
    // Apply desertification based on temperature
    if (metrics.temperature > 35) {
      const desertFactor = Math.min(1, (metrics.temperature - 35) / 15)
      ctx.globalAlpha = desertFactor * 0.3
      ctx.fillStyle = '#D2B48C'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
    }
    
    // Apply pollution overlay
    if (pollutionLevel > 0) {
      const pollutionFactor = pollutionLevel / 100
      ctx.globalAlpha = pollutionFactor * 0.4
      ctx.fillStyle = '#8B0000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [pollutionLevel, metrics.temperature])

  // Create bump map for terrain
  const bumpMap = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Create noise for terrain
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255
      data[i] = noise     // R
      data[i + 1] = noise // G
      data[i + 2] = noise // B
      data[i + 3] = 255   // A
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }, [])

  useFrame(() => {
    if (earthRef.current && isAutoRotating) {
      earthRef.current.rotation.y += 0.003
    }
    if (atmosphereRef.current && isAutoRotating) {
      atmosphereRef.current.rotation.y += 0.002
    }

    // Meteor animation
    if (specialEvent === 'meteor' && meteorPosition[1] > -5) {
      setMeteorPosition(prev => [prev[0], prev[1] - 0.5, prev[2]])
      if (meteorPosition[1] <= -5 && !explosionActive) {
        setExplosionActive(true)
      }
    }
  })

  // Reset meteor when special event changes
  useEffect(() => {
    if (specialEvent !== 'meteor') {
      setMeteorPosition([0, 20, 0])
      setExplosionActive(false)
    }
  }, [specialEvent])

  // Calculate atmosphere color
  const getAtmosphereColor = () => {
    const baseColor = new THREE.Color(0x87CEEB) // Sky blue
    const toxicColor = new THREE.Color(0x32CD32) // Lime green
    const pollutionFactor = metrics.toxicityLevel / 100
    
    const finalColor = new THREE.Color()
    finalColor.lerp(baseColor, 1 - pollutionFactor)
    finalColor.lerp(toxicColor, pollutionFactor)
    
    return finalColor
  }

  // Calculate population density for dots
  const getPopulationDots = (type: 'humans' | 'animals') => {
    const population = type === 'humans' ? metrics.humanPopulation : metrics.animalPopulation
    const maxDots = type === 'humans' ? 200 : 400
    const dotCount = Math.min(Math.floor(population / 50000000), maxDots)
    
    return Array.from({ length: dotCount }, (_, i) => {
      const lat = (Math.random() - 0.5) * Math.PI * 0.8
      const lon = Math.random() * Math.PI * 2
      const radius = 5.05 + Math.random() * 0.1
      
      return {
        position: [
          radius * Math.cos(lat) * Math.cos(lon),
          radius * Math.sin(lat),
          radius * Math.cos(lat) * Math.sin(lon)
        ],
        color: type === 'humans' ? 0x4169E1 : 0x228B22,
        size: type === 'humans' ? 0.02 : 0.015
      }
    })
  }

  return (
    <>
      {/* Stars background */}
      <group>
        {Array.from({ length: 2000 }, (_, i) => (
          <mesh key={i} position={[
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300
          ]}>
            <sphereGeometry args={[0.05, 4, 4]} />
            <meshBasicMaterial color={0xffffff} />
          </mesh>
        ))}
      </group>
      
      {/* Earth with proper texture mapping */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[5, 128, 128]} />
        <meshStandardMaterial 
          map={earthTexture}
          bumpMap={bumpMap}
          bumpScale={0.1}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Ocean pollution overlay */}
      {metrics.oceanAcidity < 8.0 && (
        <mesh>
          <sphereGeometry args={[5.02, 64, 64]} />
          <meshStandardMaterial 
            color={0x8B0000}
            transparent
            opacity={0.3 * (1 - metrics.oceanAcidity / 8.0)}
            side={THREE.FrontSide}
          />
        </mesh>
      )}
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[5.3, 64, 64]} />
        <meshStandardMaterial 
          color={getAtmosphereColor()}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Human population dots */}
      {getPopulationDots('humans').map((dot, i) => (
        <mesh key={`human-${i}`} position={dot.position as [number, number, number]}>
          <sphereGeometry args={[dot.size, 4, 4]} />
          <meshBasicMaterial color={dot.color} />
        </mesh>
      ))}

      {/* Animal population dots */}
      {getPopulationDots('animals').map((dot, i) => (
        <mesh key={`animal-${i}`} position={dot.position as [number, number, number]}>
          <sphereGeometry args={[dot.size, 4, 4]} />
          <meshBasicMaterial color={dot.color} />
        </mesh>
      ))}
      
      {/* Pollution particles */}
      {pollutionLevel > 0 && (
        <group>
          {Array.from({ length: Math.floor(pollutionLevel / 15) }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 12,
              (Math.random() - 0.5) * 12,
              (Math.random() - 0.5) * 12
            ]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial 
                color={0x8B0000}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Temperature heat waves */}
      {metrics.temperature > 35 && (
        <group>
          {Array.from({ length: 15 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 15
            ]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial 
                color={0xFF4500}
                transparent
                opacity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Meteor */}
      {specialEvent === 'meteor' && (
        <mesh position={meteorPosition}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color={0x696969} />
          {/* Meteor trail */}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 1.6, 4]} />
            <meshStandardMaterial color={0xFF6347} />
          </mesh>
        </mesh>
      )}

      {/* Explosion effect */}
      {explosionActive && (
        <group>
          {Array.from({ length: 40 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8
            ]}>
              <sphereGeometry args={[0.15, 4, 4]} />
              <meshStandardMaterial 
                color={0xFF4500}
                transparent
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Nuclear explosion */}
      {specialEvent === 'nuclear' && (
        <group>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[6, 16, 16]} />
            <meshStandardMaterial 
              color={0xFFD700}
              transparent
              opacity={0.4}
            />
          </mesh>
          {Array.from({ length: 80 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 16,
              (Math.random() - 0.5) * 16,
              (Math.random() - 0.5) * 16
            ]}>
              <sphereGeometry args={[0.25, 4, 4]} />
              <meshStandardMaterial 
                color={0xFF4500}
                transparent
                opacity={0.5}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Volcanic eruption */}
      {specialEvent === 'volcano' && (
        <group>
          {Array.from({ length: 25 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 6,
              Math.random() * 8,
              (Math.random() - 0.5) * 6
            ]}>
              <sphereGeometry args={[0.15, 4, 4]} />
              <meshStandardMaterial 
                color={0x8B0000}
                transparent
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  )
}

export default function Globe({ pollutionLevel, metrics, specialEvent }: GlobeProps) {
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        {/* Proper lighting without glow effect */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        
        <Earth pollutionLevel={pollutionLevel} metrics={metrics} specialEvent={specialEvent} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={25}
          onStart={() => setIsAutoRotating(false)}
          onEnd={() => setIsAutoRotating(true)}
        />
      </Canvas>
    </div>
  )
} 