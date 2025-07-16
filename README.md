# 🚀 OpenxAI Global AI Accelerator 2025 University Hackathon

Welcome to the **OpenxAI Global AI Accelerator Program 2025**! This repository contains templates and examples to help you build decentralized AI applications across 9 different tracks.

## 🏆 Hackathon Overview

- **💰 Prizes**: $7.5K total prizes ($2,500 per winner)
- **🎁 Hardware**: Xnode One Hardware
- **👥 Mentorship**: Industry experts from NVIDIA, OpenxAI, and Openmesh
- **📅 Duration**: 30-day program (July 15th - August 15th, 2025)
- **🎯 Goal**: Create innovative decentralized AI applications

## 📅 Timeline

| Date | Event |
|------|-------|
| **Jul 15th** | Sign-Ups Open |
| **Jul 18th** | Build Phase Begins |
| **Jul 22nd** | Mentor Sessions |
| **Jul 25th** | Submissions Open |
| **Aug 12th** | Submissions Close |
| **Aug 15th** | Winners Announced! |

## 🎯 9 Tracks Available

1. **Textstream** - Build AI apps that transform text—create chatbots that feel human, generate instant articles, or summarize complex documents with precision
2. **Soundwave** - Develop audio-driven AI solutions like voice assistants, speech-to-text tools, or apps that analyze sound for insights
3. **Gamejam** - Create AI-enhanced games or tools—think smart NPCs, dynamic worlds, or apps that generate game content on the fly
4. **Vision** - Build AI apps that see and understand the world—create tools for image recognition, object detection, or video analysis to unlock visual insights
5. **Enviro** - Develop AI solutions for environmental challenges, like climate modeling, wildlife tracking, or sustainable energy optimization to make a real-world impact
6. **HealthTech** - Innovate in healthcare with AI—build apps for medical image analysis, disease prediction, or personalized treatment plans
7. **FinTech** - Build AI tools for finance—create fraud detectors, automated advisors, predictive market analyzers & Web3 Defi
8. **LearnAI** - Develop AI-powered tools to revolutionize learning—think personalized tutors, automated grading, or interactive educational content
9. **Social Network** - Build AI apps that enhance social interactions—create tools for smarter recommendations, community engagement, or AI-driven content curation

## 🛠️ Project Templates

This repository includes ready-to-use templates for different AI application types:

### 📁 Available Templates

- **`template-app-TEXTSTREAM-TRACK/`** - Textstream track: Basic chat application with Ollama
- **`template-app-VISION-TRACK/`** - Vision track: Computer vision example (HOT or NOT app)
- **`template-app-SOUNDWAVE-TRACK/`** - Soundwave track: Audio/speech AI applications
- **`template-app-GAMEJAM-TRACK/`** - Gamejam track: Gaming AI applications
- **`template-app-ENVIRO-TRACK/`** - Enviro track: Environmental AI applications
- **`template-app-HEALTHTECH-TRACK/`** - HealthTech track: Healthcare AI applications
- **`template-app-FINTECH-TRACK/`** - FinTech track: Financial AI applications
- **`template-app-LEARNAI-TRACK/`** - LearnAI track: Educational AI applications
- **`template-app-SOCIAL-NETWORK-TRACK/`** - Social Network track: Social media AI applications

### 🔧 Template Features

Each template includes:
- ✅ **Next.js 15** with TypeScript
- ✅ **Tailwind CSS** for styling
- ✅ **Ollama integration** for local AI models
- ✅ **Nix deployment** configuration
- ✅ **Production-ready** setup
- ✅ **Comprehensive documentation**

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** installed
- **Ollama** installed and running locally
- **Nix** (optional, for advanced deployment)
- **Git** for version control

### Quick Start

1. **Choose a template:**
   ```bash
   # For Textstream track (chat/text apps)
   cp -r template-app-TEXTSTREAM-TRACK my-textstream-app
   
   # For Vision track (computer vision)
   cp -r template-app-VISION-TRACK my-vision-app
   
   # For Soundwave track (audio/speech)
   cp -r template-app-SOUNDWAVE-TRACK my-soundwave-app
   
   # For Gamejam track (gaming AI)
   cp -r template-app-GAMEJAM-TRACK my-gamejam-app
   
   # For Enviro track (environmental AI)
   cp -r template-app-ENVIRO-TRACK my-enviro-app
   
   # For HealthTech track (healthcare AI)
   cp -r template-app-HEALTHTECH-TRACK my-healthtech-app
   
   # For FinTech track (financial AI)
   cp -r template-app-FINTECH-TRACK my-fintech-app
   
   # For LearnAI track (educational AI)
   cp -r template-app-LEARNAI-TRACK my-learnai-app
   
   # For Social Network track (social media AI)
   cp -r template-app-SOCIAL-NETWORK-TRACK my-social-app
   ```

2. **Customize the template:**
   ```bash
   cd my-ai-chat-app
   
   # Update package.json
   npm pkg set name="my-awesome-ai-app"
   
   # Install dependencies
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization Guide

### 1. Update App Information

```json
// package.json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "description": "Your AI app description"
}
```

### 2. Modify the UI

Edit `src/app/page.tsx` to customize the user interface:
```tsx
// Example: Change the title
<h1 className="text-3xl font-bold text-center">
  Your AI App Title
</h1>
```

### 3. Update AI Logic

Modify `src/app/api/` routes to change AI behavior:
```typescript
// Example: Change the AI prompt
const response = await ollama.chat({
  model: "llama3.2:1b",
  messages: [{ 
    role: "user", 
    content: "Your custom prompt here" 
  }],
});
```

### 4. Add New Features

- **New API endpoints** in `src/app/api/`
- **New pages** in `src/app/`
- **New components** in `src/components/`

## 📦 Deployment Options

### Option 1: Traditional Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Option 2: Nix Deployment

```bash
# From your app directory
nix run
```

### Option 3: NixOS Production Deployment

Add to your NixOS configuration:
```nix
services.your-app-name = {
  enable = true;
  port = 3000;
  host = "0.0.0.0";
};
```

## 📝 Submission Guidelines

### Required Components

1. **Working Application**
   - Functional AI application
   - Clean, responsive UI
   - Error handling

2. **Documentation**
   - README.md with setup instructions
   - API documentation
   - Usage examples

3. **Code Quality**
   - TypeScript/JavaScript
   - Clean, readable code
   - Proper error handling
   - Comments and documentation

4. **Innovation**
   - Unique AI use case
   - Creative implementation
   - User value proposition

### Submission Checklist

- [ ] Application runs without errors
- [ ] README.md is comprehensive
- [ ] Code is well-documented
- [ ] UI is user-friendly
- [ ] AI functionality works correctly
- [ ] Deployment instructions included
- [ ] Project demonstrates innovation
- [ ] Repository is public and accessible

### Submission Format

1. **GitHub Repository**
   - Public repository
   - Clear project name
   - Comprehensive README.md

2. **Demo Video** (Optional but Recommended)
   - 2-3 minute walkthrough
   - Show key features
   - Demonstrate AI functionality

3. **Live Demo** (If Possible)
   - Deployed application
   - Accessible URL
   - Working functionality

## 🏆 Judging Criteria

### Innovation (30%)
- Unique AI application
- Creative problem-solving
- Novel use of AI technology

### Technical Quality (25%)
- Code quality and structure
- Performance and efficiency
- Error handling and reliability

### User Experience (25%)
- Intuitive interface
- Responsive design
- Accessibility considerations

### Impact (20%)
- Real-world applicability
- Potential user base
- Social or commercial value

## 🎓 Mentorship

### Available Mentors

- **Ashton Hettiarachi** - OpenxAI, Openmesh (Founder and Product Architect)
- **Sam Mens** - OpenxAI, Openmesh (Lead Engineer)
- **John Forfar** - OpenxAI, Openmesh (Developer Relations)
- **Hariharan Suresh** - NVIDIA (Senior Cloud & GenAI Technologist)

### Getting Help

1. **Discord Community** - Join for real-time support
2. **Mentor Sessions** - Scheduled on July 22nd
3. **Documentation** - Comprehensive guides in each template
4. **GitHub Issues** - Report bugs and request features

## 🎯 Tips for Success

### 1. Start Early
- Begin with a template
- Test thoroughly
- Iterate based on feedback

### 2. Focus on Innovation
- Solve real problems
- Use AI creatively
- Think outside the box

### 3. Polish Your Application
- Clean, professional UI
- Smooth user experience
- Comprehensive documentation

### 4. Demonstrate Value
- Clear use case
- Target audience
- Potential impact

## 📞 Support & Resources

### Official Channels
- **Website**: [OpenxAI Global Accelerator](https://openxai.com/accelerator)
- **Discord**: Join our community for support
- **Email**: accelerator@openxai.com

### Technical Resources
- **Ollama Documentation**: https://ollama.ai/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Nix Documentation**: https://nixos.org/guides

### AI Models
- **LLaMA**: `ollama pull llama3.2:1b`
- **LLaVA**: `ollama pull llava:latest`
- **Mistral**: `ollama pull mistral:latest`
- **Code Llama**: `ollama pull codellama:latest`

## 🎉 Good Luck!

We're excited to see what innovative AI applications you'll create! Remember:

- **Be creative** - Think outside the box
- **Focus on users** - Solve real problems
- **Polish your work** - Quality matters
- **Have fun** - Enjoy the building process

**Ready to build the future of AI? Let's go! 🚀**

---

*This hackathon is organized by OpenxAI in partnership with NVIDIA and the global AI community.* 