from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import uvicorn
import socket
import sys
from deepseek import deepseek_extract
from product_search import get_shopping_results, write_results_to_file, get_dummy_results

def find_available_port(start_port: int, max_attempts: int = 10) -> int:
    """Find an available port starting from start_port."""
    for port in range(start_port, start_port + max_attempts):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('', port))
                return port
        except OSError:
            continue
    raise RuntimeError(f"Could not find an available port after {max_attempts} attempts")

app = FastAPI(title="Checkout Analysis Server")

# Configure CORS with more specific settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins since we're dealing with various websites
    allow_credentials=False,  # Set to False when allow_origins=["*"]
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

class PageData(BaseModel):
    title: str
    url: str
    description: str | None = None
    isCheckoutPage: bool
    text: str

class AnalysisResponse(BaseModel):
    success: bool
    message: str
    analysis: dict

@app.get("/test")
async def test_endpoint():
    """Test endpoint to verify server connectivity."""
    return {
        "success": True,
        "message": "Server connection test successful",
        "timestamp": asyncio.get_event_loop().time()
    }

@app.post("/analyze")
async def analyze_page(data: PageData):
    try:
        return get_dummy_results("a")
        # Convert HTML to text
        page_text = data.text
        
        # Extract products using DeepSeek API
        products = await deepseek_extract(page_text)

        results = []

        for product in products.get('items'):
            product_name = product.get('name', 'N/A')
            price = product.get('price', 'N/A')

            print(f"Product: {product_name}, Price: {price}")

            # Find alternatives
            get_dummy_results(product_name)

            results.append(get_dummy_results(product_name))
        
        return results
        
    except Exception as e:
        print(f"Error processing request")
        raise HTTPException(status_code=500)
        

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": asyncio.get_event_loop().time()
    }

def start_server(host: str = "0.0.0.0", preferred_port: int = 8000):
    """Start the server with automatic port selection if preferred port is in use."""
    try:
        port = find_available_port(preferred_port)
        print(f"\n🚀 Starting server on port {port}")
        print(f"📚 Documentation available at:")
        print(f"   - Swagger UI: http://localhost:{port}/docs")
        print(f"   - ReDoc: http://localhost:{port}/redoc")
        print(f"🔍 Health check: http://localhost:{port}/health")
        print(f"🧪 Test endpoint: http://localhost:{port}/test")
        print("\nPress Ctrl+C to stop the server\n")
        
        uvicorn.run(
            "server:app",
            host=host,
            port=port,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"\n❌ Error starting server: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    start_server() 