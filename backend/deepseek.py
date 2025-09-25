import json
from openai import OpenAI
import os
from dotenv import load_dotenv
import asyncio

# Load environment variables from .env file
load_dotenv()

client = OpenAI(api_key=os.environ.get('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")

system_prompt = """You are a specialized product information extraction assistant focused on analyzing e-commerce checkout pages. Your sole purpose is to extract product details, quantities, prices, and total cost information from the provided text content.

INSTRUCTIONS:
1. Extract ONLY the following information:
   - Individual product details (name, quantity, price)
   - Total cost
   - Currency (if specified)
2. For product names:
   - Include size/color variants if specified
   - Remove any HTML artifacts or unnecessary whitespace
   - Preserve exact product names as shown
3. For prices:
   - Convert all prices to numerical values (e.g., "$44.00" → 44.00)
   - Ensure prices are in the correct decimal format
4. For quantities:
   - Extract numerical quantities only
   - Default to 1 if quantity is implied but not explicitly stated
5. Ignore all other checkout information (shipping, payment methods, addresses, etc.)

OUTPUT FORMAT:
You must return a valid JSON object with the following structure:
{
    "items": [
        {
            "name": string,        // Full product name including variants
            "quantity": number,    // Integer quantity
            "price": number       // Decimal price without currency symbol
        }
    ],
    "total": number,             // Total cost as decimal
    "currency": string           // Three-letter currency code (e.g., "USD")
}

EXAMPLE INPUT:
Product image
Vital Seamless 2.0 Long Sleeve Crop Top - Black
Small
Quantity: 2
$45.00

Legacy Drop Arm Tank - Charcoal
Medium
Quantity: 1
$35.00

Subtotal: $125.00
Total (USD): $125.00

EXAMPLE OUTPUT:
{
    "items": [
        {
            "name": "Vital Seamless 2.0 Long Sleeve Crop Top - Black Small",
            "quantity": 2,
            "price": 45.00
        },
        {
            "name": "Legacy Drop Arm Tank - Charcoal Medium",
            "quantity": 1,
            "price": 35.00
        }
    ],
    "total": 125.00,
    "currency": "USD"
}

RULES:
- If no currency is specified, default to "USD"
- If total is not found, calculate it from individual items
- If unable to parse certain information, exclude it rather than guessing
- Return an empty items array if no products are found
- Maintain numerical precision for prices (two decimal places)
- Do not include shipping costs in the total unless explicitly part of the final total

Now, please analyze the following checkout page content and extract the product information:
"""

async def deepseek_extract(user_prompt: str) -> list:
    if not user_prompt:
        return []

    
    messages = [{"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}]
    
    print("Sending request to DeepSeek API...")

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        response_format={
            'type': 'json_object'
        }
    )

    print("Response received from DeepSeek API")

    return json.loads(response.choices[0].message.content)

if __name__ == "__main__":
    async def main():
        demo = """

        Express checkout


        OR

        Contact
        Log in
        Email
        Delivery

        United States
        First name
        Last name
        Address Line 1
        Address Line 2
        City


        ZIP code
        Phone

        Shipping method
        Enter your shipping address to view available shipping methods.

        Payment
        All transactions are secure and encrypted.


        Credit/Debit Card
        VISA
        MASTERCARD
        AMEX
        DISCOVER

        +4






        Use shipping address as billing address

        PayPal

        Afterpay
        afterpay

        Klarna - Flexible payments
        klarna
        Remember me

        Save my information for a faster checkout with a Shop account
        +1
        Secure and encrypted

        By placing your order you agree to Gymshark's Terms and Conditions, Privacy Notice and Cookie Policy.

        Your info will be saved to a Shop account. By continuing, you agree to Shop's Terms of Service and acknowledge the Privacy Policy.
        Submit
        Order summary
        Shopping cart
        Product imageDescriptionQuantityPrice
        Campus Classics Graphic Sweat Shorts - Iron BlueQuantity
        1
        Campus Classics Graphic Sweat Shorts - Iron Blue

        Small

        1
        $48.00
        Campus Classics Graphic Sweatshirt - Stone GreyQuantity
        1
        Campus Classics Graphic Sweatshirt - Stone Grey

        Medium

        1
        $60.00
        Scroll for more items
        Discount code or gift card
        Discount code or gift card
        Submit
        Cost summary
        Item
        Value
        Subtotal · 2 items
        $108.00
        Shipping
        Enter shipping address
        Total"""
        
        result = await deepseek_extract(demo)
        return result

    asyncio.run(main())