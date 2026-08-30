# ML Forge — Interactive Machine Learning Engineering Laboratory

**ML Forge** is an interactive, browser-native machine learning laboratory designed to help engineers, students, and researchers understand, simulate, build, and deploy ML models from first principles to production systems.

---

## Key Features

- **Interactive Playground**: Real-time parameter tweaking and visual feedback for Linear Regression, Logistic Regression, KNN, Decision Trees, Random Forests, K-Means, SVM, Naive Bayes, Gradient Boosting, and Neural Networks.
- **Visual Mathematics**: 3D & 2D gradient descent terrain surfaces and interactive decision boundary geometry powered by D3.js.
- **From-Scratch Algorithm Studio**: Code implementations built from scratch with NumPy alongside scikit-learn comparisons.
- **Multi-Agent Orchestration**: Specialized AI agents (Curriculum, Knowledge, Code Mentor, Simulation, Experiment, Challenge, Project, MLOps) providing contextual feedback, debugging, and automated project guidance.
- **Production MLOps Room**: Real-time pipeline monitoring, data drift simulation, latency telemetry, and model health diagnostics.
- **System Builder**: Drag-and-drop ML pipeline architect for designing ingestion, transformation, training, evaluation, and serving graphs.
- **Hybrid Compute Engine**: Instant JavaScript execution for real-time visualization with background Pyodide Web Worker fallback for Python execution.
- **Offline & PWA Ready**: Service worker caching and offline-first state persistence using `useSyncExternalStore`.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Standalone Output)
- **UI & Styling**: React 19, TailwindCSS 4, Lucide Icons, Shadcn UI
- **Visualizations**: D3.js, Lucide
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Python Execution**: Pyodide Web Worker (WASM)
- **State Management**: Zustand with persistent storage
- **Testing**: Vitest with JSDOM environment
- **CI/CD & Container**: Docker multi-stage builds, GitHub Actions

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone repository
git clone https://github.com/yekkala-nag/mlforge.git
cd mlforge

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment

### Docker Deployment

ML Forge is configured for multi-stage Docker standalone deployment:

```bash
# Build Docker image
docker build -t mlforge:latest .

# Run Docker container
docker run -p 3000:3000 mlforge:latest
```

The app will be available on `http://localhost:3000`.

### Node.js Standalone Production Build

```bash
# Build standalone bundle
npm run build

# Start production server
npm start
```

---

## Quality Assurance & Testing

```bash
# Run ESLint validation (0 errors, 0 warnings)
npm run lint

# Run TypeScript static type checking
npx tsc --noEmit

# Run unit and integration tests with Vitest
npm test

# Run tests with coverage
npx vitest run --coverage
```

---

## Project Structure

```
mlforge/
├── .github/workflows/ci.yml       # Automated CI pipeline
├── public/                        # Static assets, manifests, icons
├── src/
│   ├── app/                       # Next.js App Router (pages, layouts, error boundaries)
│   ├── components/                # Modular UI & interactive visualization components
│   │   ├── agents/                # Multi-agent orchestrator interface
│   │   ├── arena/                 # Model Arena head-to-head comparison
│   │   ├── challenge/             # ML coding challenge engine
│   │   ├── math/                  # Visual mathematics & loss geometry
│   │   ├── ops/                   # MLOps monitoring room
│   │   ├── playground/            # Algorithm playground & Code Studio
│   │   └── system-builder/        # Pipeline graph builder
│   ├── hooks/                     # Custom React hooks (usePyodide, useSimulationRunner)
│   ├── lib/                       # Algorithms, agents, Pyodide worker, datasets
│   ├── stores/                    # Zustand stores (playground, progress, settings)
│   └── test/                      # Vitest test suites
├── Dockerfile                     # Multi-stage production container
├── next.config.ts                 # Security headers & standalone configuration
├── vitest.config.ts               # Test runner configuration
└── package.json
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.
