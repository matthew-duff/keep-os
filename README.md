# Keep 🌱

**The browser extension for the lazy eco-warrior.**

Keep is a browser extension that helps environmentally conscious consumers make sustainable shopping decisions by automatically detecting checkout pages and suggesting ethical alternatives to products they're about to purchase.

## 🌟 Features

### Smart Checkout Detection
- Automatically detects when you're on a checkout page
- Analyzes products in your cart using AI-powered extraction
- Works across major e-commerce platforms

### Sustainable Alternatives
- Finds eco-friendly, ethical, and sustainable alternatives to your products
- Searches for recycled, second-hand, and environmentally conscious options
- Provides price comparisons and environmental impact metrics

### Environmental Impact Tracking
- Tracks your environmental savings (water, trees, carbon)
- Shows cumulative impact of your sustainable choices
- Gamifies eco-friendly shopping behavior

### Seamless Integration
- Works in the background while you shop normally
- Non-intrusive suggestions that don't disrupt your shopping experience
- Clean, modern interface that matches your browsing flow

## 🚀 How It Works

1. **Shop Normally** - Browse and add items to your cart as usual
2. **Automatic Detection** - Keep detects when you reach the checkout page
3. **AI Analysis** - The extension analyzes your cart items using advanced AI
4. **Sustainable Suggestions** - Ethical alternatives are displayed with environmental impact data
5. **Make Conscious Choices** - Compare options and choose sustainable alternatives

## 🛠️ Technical Architecture

### Frontend (Browser Extension)
- **Framework**: Svelte 5 with TypeScript
- **Build Tool**: WXT (Web Extension Framework)
- **Styling**: Tailwind CSS 4
- **Features**:
  - Content script for checkout page detection
  - Popup interface for user interaction
  - Modal overlays for product suggestions
  - Background service worker for data processing

### Backend (Analysis Server)
- **Framework**: FastAPI (Python)
- **AI Integration**: DeepSeek API for product extraction and analysis
- **Search Engine**: SerpAPI for finding sustainable alternatives
- **Features**:
  - HTML parsing and product extraction
  - Image analysis for product identification
  - Shopping results aggregation
  - Environmental impact calculations

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Chrome or Firefox browser

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python server.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # For development
npm run build  # For production

If “Keep” still isn’t listed:
  Click “Load unpacked” → select /Users/matthewduff/Programs/prod-keep/frontend/.output/chrome-mv3. It should install and persist in this profile on future runs.
```

### Environment Variables
Create a `.env` file in the backend directory:
```
SERP_API_KEY=your_serpapi_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

## 🎯 User Journey

1. **Installation**: Add Keep to your browser
2. **Shopping**: Browse your favorite online stores
3. **Checkout Detection**: Keep automatically detects checkout pages
4. **Product Analysis**: AI analyzes your cart items
5. **Suggestions**: View sustainable alternatives with impact metrics
6. **Decision**: Choose between original or sustainable options
7. **Tracking**: See your environmental impact accumulate over time

## 🌍 Environmental Impact

Keep helps users make a positive environmental impact by:
- **Water Conservation**: Track liters of water saved through sustainable choices
- **Tree Preservation**: Monitor trees saved by choosing eco-friendly products
- **Carbon Reduction**: Calculate carbon footprint reduction
- **Waste Reduction**: Promote circular economy through second-hand options

## 🔧 Development

### Project Structure
```
keep/
├── frontend/           # Browser extension (Svelte 5 + WXT)
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── entrypoints/# Extension entry points
│   │   └── lib/        # Utilities and stores
├── backend/            # Analysis server (FastAPI)
│   ├── server.py       # Main server file
│   ├── deepseek.py     # AI integration
│   └── product_search.py # Search functionality
└── README.md
```

### Key Components
- **Content Script**: Detects checkout pages and extracts product data
- **Background Worker**: Processes data and communicates with backend
- **Popup Interface**: Main user interface for viewing suggestions
- **Analysis Server**: AI-powered product analysis and alternative search

## 🚀 Getting Started

1. Clone the repository
2. Set up the backend server
3. Build and load the extension in your browser
4. Start shopping and see Keep in action!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📞 Contact

- **Website**: [KeepExtension.com](https://keepextension.com)

---

*Keep - Making sustainable shopping effortless for the conscious consumer.*