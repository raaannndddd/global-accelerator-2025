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

interface EarthProps extends GlobeProps {
  isAutoRotating: boolean
}

// Major population centers with lat/lon coordinates (using exact datacenter locations)
const MAJOR_CITIES = [
  // North America
  { lat: 40.7128, lon: -74.0060, name: 'New York' },
  { lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
  { lat: 45.5234, lon: -122.6762, name: 'Portland' },
  { lat: 45.5017, lon: -73.5673, name: 'Montreal' },
  { lat: 41.8781, lon: -87.6298, name: 'Chicago' },
  { lat: 33.4484, lon: -112.0740, name: 'Phoenix' },
  { lat: 33.7490, lon: -84.3880, name: 'Atlanta' },
  { lat: 43.6532, lon: -79.3832, name: 'Toronto' },
  
  // South America
  { lat: -23.5505, lon: -46.6333, name: 'São Paulo' },
  
  // Europe
  { lat: 53.3498, lon: -6.2603, name: 'Dublin' },
  { lat: 51.5074, lon: -0.1278, name: 'London' },
  { lat: 50.1109, lon: 8.6821, name: 'Frankfurt' },
  { lat: 45.4642, lon: 9.1900, name: 'Milan' },
  { lat: 48.8566, lon: 2.3522, name: 'Paris' },
  { lat: 59.3293, lon: 18.0686, name: 'Stockholm' },
  { lat: 55.6761, lon: 12.5683, name: 'Copenhagen' },
  { lat: 47.3769, lon: 8.5417, name: 'Zurich' },
  { lat: 43.6047, lon: 1.4442, name: 'Toulouse' },
  { lat: 46.2044, lon: 6.1432, name: 'Geneva' },
  
  // Asia
  { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
  { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
  { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
  { lat: 37.5665, lon: 126.9780, name: 'Seoul' },
  { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
  { lat: 22.3193, lon: 114.1694, name: 'Hong Kong' },
  { lat: 24.9056, lon: 67.0822, name: 'Karachi' },
  { lat: 31.2304, lon: 121.4737, name: 'Shanghai' },
  { lat: 34.6937, lon: 135.5023, name: 'Osaka' },
  { lat: 35.1796, lon: 129.0756, name: 'Busan' },
  { lat: 18.5204, lon: 73.8567, name: 'Pune' },
  { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
  { lat: 24.4539, lon: 54.3773, name: 'Abu Dhabi' },
  
  // Australia/Oceania
  { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
  { lat: -37.8136, lon: 144.9631, name: 'Melbourne' },
  { lat: -40.9006, lon: 174.8860, name: 'Wellington' },
  
  // Africa
  { lat: -33.9249, lon: 18.4241, name: 'Cape Town' },
]

// Major forest/plant regions (using nearby coordinates)
const FOREST_REGIONS = [
  // Amazon Rainforest
  { lat: -3.4653, lon: -58.3804, name: 'Amazon Basin' },
  { lat: -2.5297, lon: -60.0233, name: 'Amazon Forest' },
  { lat: -1.4554, lon: -48.4898, name: 'Amazon Delta' },
  
  // Congo Rainforest
  { lat: 0.2280, lon: 15.8277, name: 'Congo Basin' },
  { lat: -0.2280, lon: 15.8277, name: 'Congo Forest' },
  
  // Southeast Asian Forests
  { lat: 1.3521, lon: 103.8198, name: 'Southeast Asia Forest' },
  { lat: 13.7563, lon: 100.5018, name: 'Thailand Forest' },
  { lat: 14.5995, lon: 120.9842, name: 'Philippines Forest' },
  
  // North American Forests
  { lat: 45.5017, lon: -73.5673, name: 'Canadian Forest' },
  { lat: 44.0582, lon: -121.3153, name: 'Pacific Northwest Forest' },
  { lat: 35.7796, lon: -78.6382, name: 'Appalachian Forest' },
  
  // European Forests
  { lat: 52.5200, lon: 13.4050, name: 'European Forest' },
  { lat: 55.7558, lon: 37.6176, name: 'Russian Taiga' },
  
  // Asian Forests
  { lat: 35.6762, lon: 139.6503, name: 'Japanese Forest' },
  { lat: 31.2304, lon: 121.4737, name: 'Chinese Forest' },
  { lat: 19.0760, lon: 72.8777, name: 'Indian Forest' },
]

// Land-based coordinates for better distribution (using verified land coordinates)
const LAND_COORDINATES = [
  // North America
  { lat: 45.0, lon: -100.0 }, { lat: 35.0, lon: -90.0 }, { lat: 40.0, lon: -80.0 },
  { lat: 30.0, lon: -85.0 }, { lat: 25.0, lon: -100.0 }, { lat: 50.0, lon: -120.0 },
  
  // South America
  { lat: -10.0, lon: -60.0 }, { lat: -20.0, lon: -50.0 }, { lat: -30.0, lon: -60.0 },
  { lat: -15.0, lon: -70.0 }, { lat: -25.0, lon: -55.0 }, { lat: -5.0, lon: -80.0 },
  
  // Europe
  { lat: 50.0, lon: 10.0 }, { lat: 45.0, lon: 15.0 }, { lat: 55.0, lon: 20.0 },
  { lat: 40.0, lon: 5.0 }, { lat: 60.0, lon: 25.0 }, { lat: 35.0, lon: 0.0 },
  
  // Asia
  { lat: 35.0, lon: 100.0 }, { lat: 25.0, lon: 110.0 }, { lat: 45.0, lon: 90.0 },
  { lat: 20.0, lon: 80.0 }, { lat: 30.0, lon: 120.0 }, { lat: 40.0, lon: 130.0 },
  
  // Africa
  { lat: 10.0, lon: 20.0 }, { lat: -10.0, lon: 30.0 }, { lat: 5.0, lon: 10.0 },
  { lat: -20.0, lon: 25.0 }, { lat: 15.0, lon: 5.0 }, { lat: 0.0, lon: 15.0 },
  
  // Australia
  { lat: -25.0, lon: 135.0 }, { lat: -30.0, lon: 145.0 }, { lat: -20.0, lon: 125.0 },
  { lat: -35.0, lon: 150.0 }, { lat: -15.0, lon: 130.0 }, { lat: -40.0, lon: 140.0 },
]

function Earth({ pollutionLevel, metrics, specialEvent, isAutoRotating }: EarthProps) {
  const earthRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const [meteorPosition, setMeteorPosition] = useState<[number, number, number]>([0, 20, 0])
  const [explosionActive, setExplosionActive] = useState(false)

  // Load better Earth textures
  const earthTextures = useMemo(() => {
    const textureLoader = new THREE.TextureLoader()
    return {
      colorMap: textureLoader.load('/global-datacenter-visualization/src/00_earthmap1k.jpg'),
      bumpMap: textureLoader.load('/global-datacenter-visualization/src/01_earthbump1k.jpg'),
      specularMap: textureLoader.load('/global-datacenter-visualization/src/02_earthspec1k.jpg'),
      lightsMap: textureLoader.load('/global-datacenter-visualization/src/03_earthlights1k.jpg')
    }
  }, [])

  // Convert lat/lon to 3D position on Earth surface (exact copy from global-datacenter-visualization)
  const latLonToVector3 = (lat: number, lon: number, radius: number = 5.01) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const z = -radius * Math.sin(phi) * Math.sin(theta)
    const y = radius * Math.cos(phi)
    return new THREE.Vector3(x, y, z)
  }

  // Calculate population dots based on actual metrics - EXACTLY like global-datacenter-visualization
  const getPopulationDots = useMemo(() => {
    // Humans: Show dots at major cities, number based on population - NO RANDOM OFFSETS
    const humanDotCount = Math.min(Math.floor(metrics.humanPopulation / 500000000), MAJOR_CITIES.length) // Max based on available cities
    const humanDots = MAJOR_CITIES.slice(0, humanDotCount).map(city => ({
      position: latLonToVector3(city.lat, city.lon, 5.01),
      color: 0xFFC0CB, // Piggy pink for humans
      size: 0.03
    }))

    // Animals: Show dots at major cities (like datacenters) - NO RANDOM OFFSETS
    const animalDotCount = Math.min(Math.floor(metrics.animalPopulation / 2000000000), MAJOR_CITIES.length)
    const animalDots = MAJOR_CITIES.slice(0, animalDotCount).map(city => ({
      position: latLonToVector3(city.lat, city.lon, 5.01),
      color: 0xD2691E, // Caramel color for animals
      size: 0.02
    }))

    // Plants: Show dots at forest regions - NO RANDOM OFFSETS
    const plantDotCount = Math.min(Math.floor(metrics.plantPopulation / 20000000000), FOREST_REGIONS.length)
    const plantDots = FOREST_REGIONS.slice(0, plantDotCount).map(forest => ({
      position: latLonToVector3(forest.lat, forest.lon, 5.01),
      color: 0x228B22, // Green for plants
      size: 0.015
    }))

    return { humanDots, animalDots, plantDots }
  }, [metrics.humanPopulation, metrics.animalPopulation, metrics.plantPopulation])

  useFrame(() => {
    if (earthRef.current && isAutoRotating) {
      earthRef.current.rotation.y += 0.003
    }
    if (atmosphereRef.current && isAutoRotating) {
      atmosphereRef.current.rotation.y += 0.002
    }

    if (specialEvent === 'meteor' && meteorPosition[1] > -5) {
      setMeteorPosition(prev => [prev[0], prev[1] - 0.5, prev[2]])
      if (meteorPosition[1] <= -5 && !explosionActive) {
        setExplosionActive(true)
      }
    }
  })

  useEffect(() => {
    if (specialEvent !== 'meteor') {
      setMeteorPosition([0, 20, 0])
      setExplosionActive(false)
    }
  }, [specialEvent])

  const getAtmosphereColor = () => {
    const baseColor = new THREE.Color(0x87CEEB)
    const toxicColor = new THREE.Color(0x32CD32)
    const pollutionFactor = metrics.toxicityLevel / 100
    
    const finalColor = new THREE.Color()
    finalColor.lerp(baseColor, 1 - pollutionFactor)
    finalColor.lerp(toxicColor, pollutionFactor)
    
    return finalColor
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
      
      {/* Earth with proper textures and population dots as children */}
      <mesh ref={earthRef}>
        <icosahedronGeometry args={[5, 16]} />
        <meshStandardMaterial 
          map={earthTextures.colorMap}
          bumpMap={earthTextures.bumpMap}
          bumpScale={0.1}
          roughness={0.8}
          metalness={0.1}
        />

        {/* Population dots as children of Earth mesh - they will rotate with the Earth */}
        <group>
          {/* Human population dots - fixed to Earth surface */}
          {getPopulationDots.humanDots.map((dot, i) => (
            <mesh key={`human-${i}`} position={dot.position}>
              <sphereGeometry args={[dot.size, 4, 4]} />
              <meshBasicMaterial color={dot.color} />
            </mesh>
          ))}

          {/* Animal population dots - fixed to Earth surface */}
          {getPopulationDots.animalDots.map((dot, i) => (
            <mesh key={`animal-${i}`} position={dot.position}>
              <sphereGeometry args={[dot.size, 4, 4]} />
              <meshBasicMaterial color={dot.color} />
            </mesh>
          ))}

          {/* Plant population dots - fixed to Earth surface */}
          {getPopulationDots.plantDots.map((dot, i) => (
            <mesh key={`plant-${i}`} position={dot.position}>
              <sphereGeometry args={[dot.size, 4, 4]} />
              <meshBasicMaterial color={dot.color} />
            </mesh>
          ))}
        </group>
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
          <mesh>
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
          {Array.from({ length: 30 }, (_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 10,
              Math.random() * 8,
              (Math.random() - 0.5) * 10
            ]}>
              <sphereGeometry args={[0.2, 4, 4]} />
              <meshStandardMaterial 
                color={0xFF4500}
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
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        
        <Earth 
          pollutionLevel={pollutionLevel} 
          metrics={metrics} 
          specialEvent={specialEvent} 
          isAutoRotating={isAutoRotating} 
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          onStart={() => setIsAutoRotating(false)}
          onEnd={() => setIsAutoRotating(true)}
        />
      </Canvas>
    </div>
  )
}