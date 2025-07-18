'use client'

import { useState, useEffect } from 'react'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Users, 
  PawPrint, 
  Leaf, 
  Waves, 
  Mountain,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface MetricsPanelProps {
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
  pollutionLevel: number
}

export default function MetricsPanel({ metrics, pollutionLevel }: MetricsPanelProps) {
  const [isVisible, setIsVisible] = useState(true)

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(1)
  }

  const getStatusColor = (value: number, thresholds: { good: number; warning: number; danger: number }) => {
    if (value <= thresholds.good) return 'text-green-400'
    if (value <= thresholds.warning) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number; danger: number }) => {
    if (value <= thresholds.good) return <TrendingDown className="w-4 h-4 text-green-400" />
    if (value <= thresholds.warning) return <AlertTriangle className="w-4 h-4 text-yellow-400" />
    return <TrendingUp className="w-4 h-4 text-red-400" />
  }

  return (
    <div className="metrics-panel rounded-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Earth Metrics</h2>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-gray-400 hover:text-white"
        >
          {isVisible ? '−' : '+'}
        </button>
      </div>

      {isVisible && (
        <div className="space-y-4">
          {/* CO2 Levels */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-400" />
              <span>CO₂ Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={getStatusColor(metrics.co2Level, { good: 450, warning: 600, danger: 800 })}>
                {metrics.co2Level} ppm
              </span>
              {getStatusIcon(metrics.co2Level, { good: 450, warning: 600, danger: 800 })}
            </div>
          </div>

          {/* Toxicity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span>Air Toxicity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={getStatusColor(metrics.toxicityLevel, { good: 20, warning: 50, danger: 80 })}>
                {metrics.toxicityLevel.toFixed(1)}%
              </span>
              {getStatusIcon(metrics.toxicityLevel, { good: 20, warning: 50, danger: 80 })}
            </div>
          </div>

          {/* Temperature */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-400" />
              <span>Temperature</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={getStatusColor(metrics.temperature, { good: 16, warning: 20, danger: 24 })}>
                {metrics.temperature.toFixed(1)}°C
              </span>
              {getStatusIcon(metrics.temperature, { good: 16, warning: 20, danger: 24 })}
            </div>
          </div>

          {/* Populations */}
          <div className="border-t border-gray-600 pt-2">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Population</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Humans</span>
                </div>
                <span className="text-green-400">{formatNumber(metrics.humanPopulation)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-orange-400" />
                  <span>Animals</span>
                </div>
                <span className="text-orange-400">{formatNumber(metrics.animalPopulation)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-400" />
                  <span>Plants</span>
                </div>
                <span className="text-green-400">{formatNumber(metrics.plantPopulation)}</span>
              </div>
            </div>
          </div>

          {/* Environmental */}
          <div className="border-t border-gray-600 pt-2">
            <h3 className="text-sm font-semibold mb-2 text-gray-300">Environment</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-blue-400" />
                  <span>Ocean pH</span>
                </div>
                <span className={getStatusColor(metrics.oceanAcidity, { good: 8.0, warning: 7.8, danger: 7.5 })}>
                  {metrics.oceanAcidity.toFixed(2)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-blue-400" />
                  <span>Ice Melting</span>
                </div>
                <span className={getStatusColor(metrics.iceCapMelting, { good: 20, warning: 50, danger: 80 })}>
                  {metrics.iceCapMelting.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Pollution Level */}
          <div className="border-t border-gray-600 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Pollution Level</span>
              <span className={`text-sm font-bold ${pollutionLevel > 50 ? 'text-red-400' : pollutionLevel > 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                {pollutionLevel.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  pollutionLevel > 50 ? 'bg-red-500' : pollutionLevel > 20 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${pollutionLevel}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 