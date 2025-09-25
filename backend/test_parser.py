import asyncio
from html_parser import html_to_text, extract_products, get_rendered_html
import json
import time
import sys

async def test_parser(url: str):
    start_time = time.time()
    print(f"\nTesting URL: {url}")
    print("=" * 50)

    try:
        # Step 1: Get rendered HTML
        print("\n1. Getting Rendered HTML:")
        print("-" * 50)
        print("Waiting for JavaScript content to load...")
        rendered_html = await get_rendered_html(url=url)
        
        if not rendered_html:
            print("Error: No HTML content received")
            return
            
        print(f"Successfully got rendered HTML. Size: {len(rendered_html):,} bytes")

        # Step 2: Convert to text
        print("\n2. Converting HTML to Text:")
        print("-" * 50)
        text_content = html_to_text(rendered_html)
        
        if not text_content:
            print("Error: No text content extracted")
            return
            
        lines = text_content.split('\n')
        print(f"\nExtracted {len(lines):,} lines of text")
        print("\nFirst 5 lines:")
        for i, line in enumerate(lines[:5], 1):
            if line.strip():
                print(f"{i}. {line[:100]}")

        # Step 3: Extract products
        print("\n3. Testing Product Extraction:")
        print("-" * 50)
        products = await extract_products(text_content)
        print("Extracted Products:")
        if products:
            print(json.dumps(products, indent=2))
        else:
            print("No products found in the text")

    except Exception as e:
        print(f"Error during processing: {e}")
    finally:
        end_time = time.time()
        print(f"\nTotal processing time: {end_time - start_time:.2f} seconds")

async def main():
    test_urls = [
        "https://us.checkout.gymshark.com/checkouts/cn/Z2NwLWFzaWEtc291dGhlYXN0MTowMUpOVFBIMVdXUTlQVFZZR1E5RTNDWkRUOQ?_gl=1*cefkm*_gcl_au*MTgyODg4NTA5NS4xNzQxNDMxNTM4*_ga*MjEwMTc4MjMzMS4xNzQxNDMxNTM5*_ga_PQJ0N2K1QF*MTc0MTQzMTUzOC4xLjEuMTc0MTQzMTU0MS41Ny4wLjA.&auto_redirect=false&edge_redirect=true&locale=en-US&skip_shop_pay=true"
    ]
    
    for url in test_urls:
        try:
            await test_parser(url)
        except KeyboardInterrupt:
            print("\nProcess interrupted by user")
            break
        except Exception as e:
            print(f"Error processing URL {url}: {e}")
        finally:
            # Give some time between tests
            await asyncio.sleep(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nProcess terminated by user")
        sys.exit(0)
    except Exception as e:
        print(f"\nFatal error: {e}")
        sys.exit(1) 