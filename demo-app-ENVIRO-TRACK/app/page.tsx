'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Send, RotateCcw, Play, Pause, Brain, Users, Thermometer, AlertTriangle, Loader2 } from 'lucide-react'

// Dynamically import the 3D components to avoid SSR issues
const Globe = dynamic(() => import('../components/Globe'), { ssr: false })
const MetricsPanel = dynamic(() => import('../components/MetricsPanel'), { ssr: false })

interface EarthMetrics {
  co2Level: number
  toxicityLevel: number
  temperature: number
  humanPopulation: number
  animalPopulation: number
  plantPopulation: number
  oceanAcidity: number
  iceCapMelting: number
}

interface AICommand {
  command: string
  impact: string
  effects: any
  timestamp: Date
}

const exampleCommands = [
  "Add 1 million V8 trucks to the world",
  "Build 1000 coal power plants",
  "Cut down the Amazon rainforest",
  "Smash a meteor into Earth",
  "Start a nuclear war",
  "Release 50 million tons of CO2",
  "Build 10,000 factories in China",
  "Erupt all volcanoes simultaneously",
  "Dump nuclear waste in the ocean",
  "Burn all fossil fuel reserves",
  "Destroy all coral reefs",
  "Release methane from permafrost",
  "Spray aerosols into the atmosphere",
  "Melt all polar ice caps",
  "Poison all freshwater sources"
]

export default function Home() {
  const [metrics, setMetrics] = useState<EarthMetrics>({
    co2Level: 415, // Starting CO2 level (ppm)
    toxicityLevel: 5, // Starting toxicity level (1-100)
    temperature: 30, // Starting temperature (°C) - hotter baseline
    humanPopulation: 9000000000, // 9 billion humans
    animalPopulation: 100000000000, // 100 billion animals
    plantPopulation: 1000000000000,
    oceanAcidity: 8.1, // pH level
    iceCapMelting: 10, // Percentage melted
  })

  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [pollutionLevel, setPollutionLevel] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [commandHistory, setCommandHistory] = useState<AICommand[]>([])
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('')
  const [aiThinkingLog, setAiThinkingLog] = useState<string[]>([])
  const [specialEvent, setSpecialEvent] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // AI thinking process simulation
  const thinkingSteps = [
    "Analyzing environmental impact...",
    "Calculating CO2 emissions...",
    "Estimating population effects...",
    "Computing temperature changes...",
    "Assessing ocean acidification...",
    "Evaluating biodiversity loss...",
    "Projecting climate consequences...",
    "Finalizing impact assessment..."
  ]

  const processUserCommand = async (command: string) => {
    if (!command.trim() || isProcessing) return

    setIsProcessing(true)
    setCurrentAnalysis('AI is analyzing your command...')
    setSpecialEvent(null)

    // Check for special catastrophic events
    const lowerCommand = command.toLowerCase()
    if (lowerCommand.includes('meteor') || lowerCommand.includes('asteroid') || lowerCommand.includes('smash')) {
      setSpecialEvent('meteor')
    } else if (lowerCommand.includes('nuclear') || lowerCommand.includes('bomb')) {
      setSpecialEvent('nuclear')
    } else if (lowerCommand.includes('volcano') || lowerCommand.includes('erupt')) {
      setSpecialEvent('volcano')
    }

    // Simulate AI thinking process
    const thinkingLog: string[] = []
    for (let i = 0; i < thinkingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
      thinkingLog.push(thinkingSteps[i])
      setAiThinkingLog([...thinkingLog])
    }

    try {
      const response = await fetch('/api/process-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          currentMetrics: metrics,
          pollutionLevel
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Apply the calculated effects to the metrics
        setMetrics(prev => ({
          ...prev,
          co2Level: Math.max(0, Math.min(prev.co2Level + result.effects.co2, 2000)),
          toxicityLevel: Math.max(0, Math.min(prev.toxicityLevel + result.effects.toxicity, 100)),
          temperature: Math.max(-50, Math.min(prev.temperature + result.effects.temperature, 50)),
          humanPopulation: Math.max(0, prev.humanPopulation + result.effects.humans),
          animalPopulation: Math.max(0, prev.animalPopulation + result.effects.animals),
          plantPopulation: Math.max(0, prev.plantPopulation + result.effects.plants),
          oceanAcidity: Math.max(6.0, Math.min(prev.oceanAcidity + result.effects.oceanAcidity, 9.0)),
          iceCapMelting: Math.max(0, Math.min(prev.iceCapMelting + result.effects.iceMelting, 100)),
        }))

        // Update pollution level based on overall impact
        const newPollutionLevel = Math.max(0, Math.min(pollutionLevel + result.effects.pollution, 100))
        setPollutionLevel(newPollutionLevel)

        // Add to command history
        const newCommand: AICommand = {
          command,
          impact: result.impact,
          effects: result.effects,
          timestamp: new Date()
        }
        setCommandHistory(prev => [newCommand, ...prev.slice(0, 9)]) // Keep last 10 commands

        setCurrentAnalysis(result.impact)
        setUserInput('')
      }
    } catch (error) {
      console.error('Failed to process command:', error)
      setCurrentAnalysis('Failed to process command. Please try again.')
    } finally {
      setIsProcessing(false)
      setAiThinkingLog([])
      // Clear special event after a delay
      setTimeout(() => setSpecialEvent(null), 5000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isProcessing && userInput.trim()) {
      processUserCommand(userInput.trim())
    }
  }

  const handleExampleClick = (example: string) => {
    if (isProcessing) return
    setUserInput(example)
    // Auto-submit after a short delay
    setTimeout(() => {
      processUserCommand(example)
    }, 100)
  }

  const resetEarth = () => {
    setMetrics({
      co2Level: 415,
      toxicityLevel: 5,
      temperature: 30,
      humanPopulation: 9000000000,
      animalPopulation: 100000000000,
      plantPopulation: 1000000000000,
      oceanAcidity: 8.1,
      iceCapMelting: 10,
    })
    setPollutionLevel(0)
    setIsSimulationRunning(false)
    setCommandHistory([])
    setCurrentAnalysis('')
    setSpecialEvent(null)
    setAiThinkingLog([])
    setIsProcessing(false)
  }

  // Auto-simulation loop for continuous degradation
  useEffect(() => {
    if (!isSimulationRunning) return

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        co2Level: Math.min(prev.co2Level + 0.5, 2000),
        toxicityLevel: Math.min(prev.toxicityLevel + 0.2, 100),
        temperature: Math.min(prev.temperature + 0.05, 50),
        humanPopulation: Math.max(prev.humanPopulation - 1000, 0),
        animalPopulation: Math.max(prev.animalPopulation - 5000, 0),
        plantPopulation: Math.max(prev.plantPopulation - 50000, 0),
        oceanAcidity: Math.max(prev.oceanAcidity - 0.005, 6.0),
        iceCapMelting: Math.min(prev.iceCapMelting + 0.2, 100),
      }))
    }, 2000) // Slower degradation

    return () => clearInterval(interval)
  }, [isSimulationRunning])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="globe-container">
      {/* 3D Globe */}
      <Globe 
        pollutionLevel={pollutionLevel} 
        metrics={metrics} 
        specialEvent={specialEvent}
      />
      
      {/* Pollution Overlay */}
      <div className="pollution-overlay">
        {pollutionLevel > 0 && (
          <div 
            className="absolute inset-0 bg-red-500 opacity-20"
            style={{ opacity: pollutionLevel / 100 }}
          />
        )}
      </div>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20">
        <div className="metrics-panel rounded-lg p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">AI Earth Controller</h2>
          
          {/* Simulation Controls */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
            >
              {isSimulationRunning ? <Pause size={16} /> : <Play size={16} />}
              {isSimulationRunning ? 'Pause' : 'Start'} Auto-Simulation
            </button>
            <button
              onClick={resetEarth}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              <RotateCcw size={16} />
              Reset Earth
            </button>
          </div>

          {/* Command Input */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g., 'add 1 million V8 trucks to the world'"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !userInput.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded flex items-center gap-2"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                Send
              </button>
            </div>
          </form>

          {/* Example Commands */}
          <div className="text-xs text-gray-400">
            <p className="mb-2">Click any example to try:</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {exampleCommands.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  disabled={isProcessing}
                  className="block w-full text-left hover:text-white hover:bg-gray-700 px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  • "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Panel */}
      <div className="absolute top-4 right-4 z-20">
        <MetricsPanel metrics={metrics} pollutionLevel={pollutionLevel} />
      </div>

      {/* AI Analysis Panel */}
      {currentAnalysis && (
        <div className="absolute bottom-4 left-4 z-20">
          <div className="metrics-panel rounded-lg p-4 max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold">AI Analysis</h3>
            </div>
            <div className="text-sm text-gray-300">
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4 text-purple-400" />
                  {currentAnalysis}
                </div>
              ) : (
                <p>{currentAnalysis}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Thinking Log */}
      {aiThinkingLog.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="metrics-panel rounded-lg p-4 max-w-lg opacity-90">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-semibold">AI Thinking Process</h4>
            </div>
            <div className="space-y-1 text-xs text-gray-300">
              {aiThinkingLog.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Command History */}
      {commandHistory.length > 0 && (
        <div className="absolute bottom-4 right-4 z-20">
          <div className="metrics-panel rounded-lg p-4 max-w-sm max-h-64 overflow-y-auto">
            <h3 className="text-lg font-bold mb-3">Recent Commands</h3>
            <div className="space-y-2 text-xs">
              {commandHistory.map((cmd, index) => (
                <div key={index} className="border-l-2 border-purple-400 pl-2">
                  <p className="font-semibold text-white">"{cmd.command}"</p>
                  <p className="text-gray-400 mt-1">{cmd.impact}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {cmd.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <h1 className="text-4xl font-bold text-center bg-black bg-opacity-50 px-6 py-3 rounded-lg">
          🌍 Dead-Earth Project
        </h1>
        <p className="text-center text-gray-300 mt-2 bg-black bg-opacity-50 px-4 py-2 rounded">
          AI-Controlled Climate Change Simulation
        </p>
      </div>
    </div>
  )
} 