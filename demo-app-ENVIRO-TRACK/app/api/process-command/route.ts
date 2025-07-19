import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { command, currentMetrics, pollutionLevel, model = 'deepseek-r1:8b' } = await request.json()

    // Check for catastrophic events
    const lowerCommand = command.toLowerCase()
    let specialEvent = null
    let isCatastrophic = false
    let catastrophicType = ''

    if (lowerCommand.includes('meteor') || lowerCommand.includes('asteroid') || lowerCommand.includes('smash')) {
      specialEvent = 'meteor'
      isCatastrophic = true
      catastrophicType = 'meteor'
    } else if (lowerCommand.includes('nuclear') || lowerCommand.includes('bomb') || lowerCommand.includes('war')) {
      specialEvent = 'nuclear'
      isCatastrophic = true
      catastrophicType = 'nuclear'
    } else if (lowerCommand.includes('volcano') || lowerCommand.includes('erupt')) {
      specialEvent = 'volcano'
      isCatastrophic = true
      catastrophicType = 'volcano'
    }

    // Adjust prompt based on model
    const isQwen = model.includes('qwen')
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

${isQwen ? 'Return a valid JSON object with this structure:' : 'Return ONLY a valid JSON object with this exact structure:'}
{
  "analysis": "Detailed explanation of environmental impact",
  "metrics": {
    "co2Level": number,
    "toxicityLevel": number,
    "temperature": number,
    "humanPopulation": number,
    "animalPopulation": number,
    "plantPopulation": number,
    "oceanAcidity": number,
    "iceCapMelting": number
  },
  "pollutionLevel": number,
  "specialEvent": "${specialEvent || null}"
}

Ensure all numbers are realistic and within reasonable ranges. CO2: 0-2000 ppm, Toxicity: 0-100%, Temperature: -50 to 50°C, Populations: positive numbers, Ocean pH: 6.0-9.0, Ice Melting: 0-100%, Pollution: 0-100%.
${isQwen ? 'Return only the JSON, no other text.' : ''}
`

    // Call Ollama with the selected model
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false
      }),
    })

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama request failed: ${ollamaResponse.statusText}`)
    }

    const ollamaData = await ollamaResponse.json()
    let responseText = ollamaData.response

    // Try to extract JSON from the response with multiple strategies
    let parsedResponse = null
    
    // Strategy 1: Look for JSON object
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        parsedResponse = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        console.log('JSON parse failed for matched content:', jsonMatch[0])
      }
    }
    
    // Strategy 2: If no JSON found, try to parse the entire response
    if (!parsedResponse) {
      try {
        parsedResponse = JSON.parse(responseText.trim())
      } catch (parseError) {
        console.log('Full response parse failed:', responseText)
      }
    }
    
    // Strategy 3: Handle Qwen's think tags and extract JSON from within
    if (!parsedResponse && responseText.includes('<think>')) {
      // Remove think tags and try to find JSON
      const cleanText = responseText.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
      const cleanJsonMatch = cleanText.match(/\{[\s\S]*\}/)
      if (cleanJsonMatch) {
        try {
          parsedResponse = JSON.parse(cleanJsonMatch[0])
        } catch (parseError) {
          console.log('JSON parse failed for cleaned content:', cleanJsonMatch[0])
        }
      }
    }
    
    // Strategy 4: If still no JSON, create a fallback response
    if (!parsedResponse) {
      console.log('Creating fallback response for:', responseText)
      parsedResponse = {
        analysis: `The command "${command}" will have environmental consequences. ${responseText.substring(0, 200)}...`,
        metrics: {
          co2Level: Math.min(currentMetrics.co2Level + 20, 2000),
          toxicityLevel: Math.min(currentMetrics.toxicityLevel + 5, 100),
          temperature: Math.min(currentMetrics.temperature + 0.5, 50),
          humanPopulation: Math.max(currentMetrics.humanPopulation - 1000000, 0),
          animalPopulation: Math.max(currentMetrics.animalPopulation - 5000000, 0),
          plantPopulation: Math.max(currentMetrics.plantPopulation - 10000000, 0),
          oceanAcidity: Math.max(currentMetrics.oceanAcidity - 0.01, 6.0),
          iceCapMelting: Math.min(currentMetrics.iceCapMelting + 1, 100),
        },
        pollutionLevel: Math.min(pollutionLevel + 3, 100),
        specialEvent: specialEvent
      }
    }

    // Validate and sanitize the response
    const validatedMetrics = {
      co2Level: Math.max(0, Math.min(parsedResponse.metrics?.co2Level || currentMetrics.co2Level, 2000)),
      toxicityLevel: Math.max(0, Math.min(parsedResponse.metrics?.toxicityLevel || currentMetrics.toxicityLevel, 100)),
      temperature: Math.max(-50, Math.min(parsedResponse.metrics?.temperature || currentMetrics.temperature, 50)),
      humanPopulation: Math.max(0, parsedResponse.metrics?.humanPopulation || currentMetrics.humanPopulation),
      animalPopulation: Math.max(0, parsedResponse.metrics?.animalPopulation || currentMetrics.animalPopulation),
      plantPopulation: Math.max(0, parsedResponse.metrics?.plantPopulation || currentMetrics.plantPopulation),
      oceanAcidity: Math.max(6.0, Math.min(parsedResponse.metrics?.oceanAcidity || currentMetrics.oceanAcidity, 9.0)),
      iceCapMelting: Math.max(0, Math.min(parsedResponse.metrics?.iceCapMelting || currentMetrics.iceCapMelting, 100)),
    }

    const validatedPollutionLevel = Math.max(0, Math.min(parsedResponse.pollutionLevel || pollutionLevel, 100))

    return NextResponse.json({
      analysis: parsedResponse.analysis || 'Environmental impact calculated successfully.',
      metrics: validatedMetrics,
      pollutionLevel: validatedPollutionLevel,
      specialEvent: parsedResponse.specialEvent || specialEvent
    })

  } catch (error) {
    console.error('Error processing command:', error)
    return NextResponse.json(
      { error: 'Failed to process command', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 