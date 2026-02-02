# InnerStack

> **Build Habits That Stick.**

InnerStack is a modern, open-source Progressive Web App (PWA) designed to help you track, analyze, and optimize your daily routines. With a focus on aesthetics, privacy, and user experience, InnerStack provides a distraction-free environment to master your habits.

![Banner](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3)

## 🚀 Features

- **📊 Advanced Habit Tracking**: Support for Daily, Weekly, Custom Days, and One-time habits.
- **🔗 Habit Chains**: Create dependencies between habits (e.g., "Wake up" unlocks "Meditate").
- **🌡️ Mood & Energy Tracking**: Log your daily mood and energy levels alongside your tasks.
- **📅 Visual Analytics**: GitHub-style contribution graphs and detailed calendar views.
- **📱 PWA Ready**: Installable on iOS and Android with offline support.
- **🎨 Theming**: Beautiful Dark/Light modes and customizable color themes.
- **🔒 Privacy First**: Data is persisted locally (with future sync options).

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/innerstack.git
   cd innerstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Building for Production

To create a production-ready build:

```bash
npm run build
```
This will generate the `dist` folder, which can be deployed to Vercel, Netlify, or any static host.

## 📱 Installing as PWA

1. Open the app in your browser (Chrome/Safari).
2. Click the "Install" icon in the address bar (Desktop) or "Add to Home Screen" (Mobile).
3. The app will work offline and launch like a native application.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
