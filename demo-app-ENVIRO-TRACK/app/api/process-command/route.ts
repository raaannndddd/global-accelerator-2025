import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { command, currentMetrics, pollutionLevel } = body

    // Check for special catastrophic events
    const lowerCommand = command.toLowerCase()
    let isCatastrophic = false
    let catastrophicType = ''

    if (lowerCommand.includes('meteor') || lowerCommand.includes('asteroid') || lowerCommand.includes('smash')) {
      isCatastrophic = true
      catastrophicType = 'meteor'
    } else if (lowerCommand.includes('nuclear') || lowerCommand.includes('bomb') || lowerCommand.includes('war')) {
      isCatastrophic = true
      catastrophicType = 'nuclear'
    } else if (lowerCommand.includes('volcano') || lowerCommand.includes('erupt')) {
      isCatastrophic = true
      catastrophicType = 'volcano'
    }

    // Prepare the prompt for Ollama with deepseek-r1:8b
    const prompt = `
You are an environmental AI expert analyzing the impact of human actions on Earth. You must calculate realistic environmental effects and return them in JSON format.

Current Earth State:
- CO2 Level: ${currentMetrics.co2Level} ppm
- Air Toxicity: ${currentMetrics.toxicityLevel}%
- Temperature: ${currentMetrics.temperature}°C
- Human Population: ${currentMetrics.humanPopulation.toLocaleString()}
- Animal Population: ${currentMetrics.animalPopulation.toLocaleString()}
- Plant Population: ${currentMetrics.plantPopulation.toLocaleString()}
- Ocean pH: ${currentMetrics.oceanAcidity}
- Ice Cap Melting: ${currentMetrics.iceCapMelting}%
- Overall Pollution Level: ${pollutionLevel}%

User Command: "${command}"

${isCatastrophic ? `This is a CATASTROPHIC EVENT (${catastrophicType.toUpperCase()}) that will cause MASSIVE environmental destruction and population loss.` : ''}

Calculate the environmental impact of this action. Consider:
1. CO2 emissions and their effect on atmospheric levels
2. Air pollution and toxicity increases
3. Temperature changes (global warming effects)
4. Impact on human population (health, mortality)
5. Impact on animal populations (habitat loss, extinction)
6. Impact on plant populations (deforestation, growth)
7. Ocean acidification effects
8. Ice cap melting acceleration
9. Overall pollution level increase

${isCatastrophic ? `
For catastrophic events, use these guidelines:
- METEOR: Massive population loss (50-90%), extreme temperature rise, global devastation
- NUCLEAR: Catastrophic human loss (70-95%), nuclear winter effects, extreme toxicity
- VOLCANO: Significant population loss (20-40%), massive CO2 release, global cooling then warming
` : ''}

Return ONLY a JSON object with these exact fields:
{
  "impact": "Brief description of the environmental impact (2-3 sentences)",
  "effects": {
    "co2": number (CO2 change in ppm, can be positive or negative),
    "toxicity": number (toxicity change in percentage points, 0-100),
    "temperature": number (temperature change in Celsius, can be positive or negative),
    "humans": number (human population change, can be positive or negative),
    "animals": number (animal population change, can be positive or negative),
    "plants": number (plant population change, can be positive or negative),
    "oceanAcidity": number (pH change, typically negative for acidification),
    "iceMelting": number (ice melting percentage change, 0-100),
    "pollution": number (overall pollution level change, 0-100)
  }
}

Be realistic but impactful. For catastrophic events, use dramatic but scientifically plausible effects.
Return ONLY the JSON, no other text.
`

    // Call Ollama API with deepseek-r1:8b
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.MODEL || 'deepseek-r1:8b',
        prompt: prompt,
        stream: false,
      }),
    })

    if (!ollamaResponse.ok) {
      throw new Error('Failed to get AI analysis')
    }

    const ollamaData = await ollamaResponse.json()
    const aiResponse = ollamaData.response

    // Try to parse JSON from the response
    let result
    try {
      // Extract JSON from the response (it might be wrapped in markdown or have extra text)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        // Fallback if no JSON found - provide realistic default effects
        if (isCatastrophic) {
          // Catastrophic event fallbacks
          switch (catastrophicType) {
            case 'meteor':
              result = {
                impact: `A massive meteor impact has caused catastrophic global devastation, triggering mass extinctions and environmental collapse.`,
                effects: {
                  co2: 500,
                  toxicity: 80,
                  temperature: 15,
                  humans: -8000000000, // Nearly complete human extinction
                  animals: -90000000000, // 90% animal extinction
                  plants: -900000000000, // 90% plant extinction
                  oceanAcidity: -1.0,
                  iceMelting: 50,
                  pollution: 90
                }
              }
              break
            case 'nuclear':
              result = {
                impact: `Nuclear war has caused global devastation, nuclear winter, and mass extinction events across all species.`,
                effects: {
                  co2: 200,
                  toxicity: 95,
                  temperature: -10, // Nuclear winter
                  humans: -8500000000, // 95% human extinction
                  animals: -95000000000, // 95% animal extinction
                  plants: -800000000000, // 80% plant extinction
                  oceanAcidity: -0.5,
                  iceMelting: 20,
                  pollution: 95
                }
              }
              break
            case 'volcano':
              result = {
                impact: `Massive volcanic eruptions have caused global climate disruption, acid rain, and widespread environmental damage.`,
                effects: {
                  co2: 300,
                  toxicity: 60,
                  temperature: 8,
                  humans: -3000000000, // 30% human extinction
                  animals: -40000000000, // 40% animal extinction
                  plants: -300000000000, // 30% plant extinction
                  oceanAcidity: -0.8,
                  iceMelting: 30,
                  pollution: 70
                }
              }
              break
            default:
              result = {
                impact: `The command "${command}" will have catastrophic environmental consequences, causing massive population loss and environmental destruction.`,
                effects: {
                  co2: 100,
                  toxicity: 50,
                  temperature: 5,
                  humans: -2000000000,
                  animals: -20000000000,
                  plants: -200000000000,
                  oceanAcidity: -0.3,
                  iceMelting: 15,
                  pollution: 50
                }
              }
          }
        } else {
          result = {
            impact: `The command "${command}" will have significant environmental consequences, increasing pollution and accelerating climate change.`,
            effects: {
              co2: 25,
              toxicity: 8,
              temperature: 0.3,
              humans: -100000,
              animals: -500000,
              plants: -10000000,
              oceanAcidity: -0.02,
              iceMelting: 2,
              pollution: 5
            }
          }
        }
      }

      // Validate and sanitize the effects
      result.effects = {
        co2: Math.max(-200, Math.min(1000, result.effects.co2 || 0)),
        toxicity: Math.max(-20, Math.min(100, result.effects.toxicity || 0)),
        temperature: Math.max(-20, Math.min(20, result.effects.temperature || 0)),
        humans: Math.max(-9000000000, Math.min(10000000, result.effects.humans || 0)),
        animals: Math.max(-100000000000, Math.min(100000000, result.effects.animals || 0)),
        plants: Math.max(-1000000000000, Math.min(1000000000, result.effects.plants || 0)),
        oceanAcidity: Math.max(-2.0, Math.min(0.5, result.effects.oceanAcidity || 0)),
        iceMelting: Math.max(-20, Math.min(100, result.effects.iceMelting || 0)),
        pollution: Math.max(-20, Math.min(100, result.effects.pollution || 0))
      }

    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      // Fallback analysis if JSON parsing fails
      result = {
        impact: `The command "${command}" will contribute to environmental degradation and climate change.`,
        effects: {
          co2: 20,
          toxicity: 5,
          temperature: 0.2,
          humans: -50000,
          animals: -200000,
          plants: -5000000,
          oceanAcidity: -0.01,
          iceMelting: 1,
          pollution: 3
        }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Command Processing Error:', error)
    
    // Fallback response if Ollama is not available
    return NextResponse.json({
      impact: "Unable to analyze command due to AI service unavailability. Using default environmental impact assessment.",
      effects: {
        co2: 15,
        toxicity: 3,
        temperature: 0.1,
        humans: -10000,
        animals: -50000,
        plants: -1000000,
        oceanAcidity: -0.005,
        iceMelting: 0.5,
        pollution: 2
      }
    })
  }
} 