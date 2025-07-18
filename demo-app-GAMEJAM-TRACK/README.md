# 🎮 Game Jam Template - AI for Games

A comprehensive Next.js template for building AI-powered games and interactive experiences. This template includes three complete game modes that showcase different ways to integrate AI into gaming.

## 🚀 Features

### 1. AI Character Chatbot Arena
- **Interactive Character Selection**: Choose from 4 unique AI characters
- **Dynamic Personality System**: Each character has distinct speaking styles and backgrounds
- **Real-time Chat Interface**: Smooth, responsive chat experience with loading states
- **Character Profiles**:
  - **Zara the Warrior** ⚔️ - Battle-hardened warrior with military discipline
  - **Elric the Wise** 🧙‍♂️ - Ancient wizard with mystical wisdom
  - **Shadow** 🗡️ - Cunning thief with street-smart attitude
  - **Luna the Healer** ✨ - Compassionate cleric with healing wisdom

### 2. Guess the AI Game
- **AI vs Human Challenge**: Test your ability to distinguish AI-generated text from human writing
- **Dynamic Content**: AI generates new sentences for each round
- **Score Tracking**: Keep track of your accuracy
- **Educational**: Learn about AI text generation patterns

### 3. AI Puzzle Generator
- **Unique Puzzles**: Every puzzle is generated fresh by AI
- **Multiple Types**: Riddles, word puzzles, and logic problems
- **Hint System**: Get helpful hints when stuck
- **Score System**: Earn points for correct answers
- **Endless Content**: Generate new puzzles anytime

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom animations
- **AI Integration**: Ollama with Llama2 model
- **TypeScript**: Full type safety
- **Responsive Design**: Works on desktop and mobile

## 🚀 Getting Started

### Prerequisites

1. **Install Ollama**: [https://ollama.ai/](https://ollama.ai/)
2. **Pull Llama2 Model**:
   ```bash
   ollama pull llama2
   ```
3. **Start Ollama Server**:
   ```bash
   ollama serve
   ```

### Installation

1. **Navigate to the project**:
   ```bash
   cd template-app-GAMEJAM-TRACK/nextjs-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and visit `http://localhost:3000`

## 🎯 Game Modes

### Character Chat Mode
- Select a character from the main screen
- Start chatting with your chosen AI character
- Each character responds in their unique personality
- Switch characters anytime to try different interactions

### Guess the AI Mode
- Click "Start New Game" to begin
- Read two sentences and guess which one was written by AI
- Track your score and accuracy
- Challenge yourself to improve your AI detection skills

### Puzzle Generator Mode
- Click "Generate New Puzzle" to create a unique puzzle
- Try to solve the AI-generated riddle or logic problem
- Use hints if you get stuck
- Earn points for correct answers
- Generate unlimited new puzzles

## 🔧 API Endpoints

### `/api/character-chat`
- **Method**: POST
- **Purpose**: Handle character chat interactions
- **Body**: `{ message: string, character: string }`
- **Response**: `{ message: string, character: string }`

### `/api/guess-ai`
- **Method**: POST
- **Purpose**: Generate AI and human sentences for guessing game
- **Response**: `{ aiSentence: string, humanSentence: string, correctAnswer: string }`

### `/api/puzzle-generator`
- **Method**: POST
- **Purpose**: Generate unique puzzles with questions, answers, and hints
- **Response**: `{ puzzle: { id: string, question: string, answer: string, hint: string } }`

## 🎨 Customization

### Adding New Characters
1. Add character data to the `characters` array in `page.tsx`
2. Update the character prompts in `/api/character-chat/route.ts`
3. Add character-specific styling and icons

### Modifying Game Logic
- **Character Chat**: Edit prompts in the API route for different personalities
- **Guess AI**: Modify the AI generation prompt or human sentence pool
- **Puzzle Generator**: Adjust the puzzle generation prompt for different puzzle types

### Styling
- Custom CSS classes in `globals.css`
- Tailwind utility classes for responsive design
- Custom animations and hover effects

## 🐛 Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Check if Llama2 model is installed: `ollama list`
- Verify the API endpoint in browser dev tools

### Performance Issues
- The AI responses may take a few seconds depending on your hardware
- Consider using a more powerful model or optimizing prompts
- Implement caching for frequently used responses

## 🎮 Game Design Principles

1. **Accessibility**: All games work with keyboard navigation
2. **Responsive**: Optimized for desktop and mobile devices
3. **Progressive Enhancement**: Works even if AI services are unavailable
4. **User Feedback**: Clear loading states and error handling
5. **Replayability**: Endless content generation for continued engagement

## 🤝 Contributing

Feel free to enhance this template by:
- Adding new game modes
- Improving AI prompts
- Enhancing the UI/UX
- Adding multiplayer features
- Implementing more sophisticated AI models

## 📄 License

This template is open source and available under the MIT License.

---

**Happy Gaming! 🎮✨** 