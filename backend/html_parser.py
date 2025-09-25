from bs4 import BeautifulSoup
import re
from typing import List, Dict, Optional
import httpx
import json
import os
from dotenv import load_dotenv
from playwright.async_api import async_playwright, Browser, Page
import asyncio
from deepseek import deepseek_extract

# Load environment variables
load_dotenv()

def clean_text(text: str) -> str:
    """Clean and normalize text content."""
    text = ' '.join(text.split())
    text = re.sub(r'[^\w\s.,!?$€£-]', '', text)
    return text.strip()

async def get_rendered_html(url: str = None, html_content: str = None) -> str:
    """Get fully rendered HTML content using Playwright."""
    async with async_playwright() as playwright:
        try:
            # Launch browser with specific options
            browser = await playwright.chromium.launch(
                headless=False,
            )
            
            async with browser.new_context(
                viewport={'width': 1280, 'height': 1024},
                accept_downloads=False
            ) as context:
                async with context.new_page() as page:
                    # Set default timeout
                    page.set_default_timeout(30000)
                    
                    # Navigate to URL or set content
                    if url:
                        print(f"Navigating to {url}")
                        response = await page.goto(url, wait_until='domcontentloaded')
                        if response:
                            print(f"Page loaded with status: {response.status}")
                        # Wait for the page to be relatively stable
                        await page.wait_for_load_state('networkidle')
                    elif html_content:
                        await page.set_content(html_content)
                        await page.wait_for_load_state('domcontentloaded')

                    # Wait a moment for any immediate dynamic content
                    await asyncio.sleep(2)

                    # Take a screenshot if possible
                    try:
                        await page.screenshot(path='page_screenshot.png')
                        print("Screenshot saved as 'page_screenshot.png'")
                    except Exception as e:
                        print(f"Screenshot failed: {e}")

                    # Get the page content
                    return await page.content()

        except Exception as e:
            print(f"Error during page processing: {e}")
            return ""

def html_to_text(html: str) -> str:
    """Convert HTML to clean text while preserving important structure."""
    if not html:
        return ""
        
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remove unwanted elements
        for element in soup.find_all(['script', 'style', 'noscript', 'meta', 'link', 'iframe']):
            element.decompose()

        # Extract all text content
        text_content = []
        
        # Get all text elements
        for element in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'li', 'td']):
            if element.parent.get('style') and 'display:none' in element.parent.get('style'):
                continue
                
            text = element.get_text(separator=' ', strip=True)
            if text:
                cleaned = clean_text(text)
                if cleaned and len(cleaned) > 1:
                    text_content.append(cleaned)

        # Remove duplicates while preserving order
        seen = set()
        unique_content = []
        for line in text_content:
            if line not in seen:
                seen.add(line)
                unique_content.append(line)

        return '\n'.join(unique_content)
    
    except Exception as e:
        print(f"Error parsing HTML: {str(e)}")
        return ""

async def extract_products(text: str) -> Optional[Dict]:
    """Extract product information from text using DeepSeek API."""
    if not text:
        return None
    return await deepseek_extract(text)
