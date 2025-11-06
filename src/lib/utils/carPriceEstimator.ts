import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

interface CarDetails {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  fuelType: string;
  transmission: string;
  location?: string;
}

export async function estimateCarPrice(carDetails: CarDetails): Promise<{ minPrice: number; maxPrice: number; reasoning: string }> {
  const { brand, model, year, mileage, condition, location } = carDetails;

  const prompt = `You are a car pricing assistant. Given the following details, provide the estimated current market price range in Shekel  and explain your reasoning. Assume that the car prices do not change frequently and reflect relatively stable market trends.
    Car Brand: ${brand}
    Model: ${model}
    Year: ${year}
    Mileage: ${mileage}
    Condition: ${condition}
    Location: ${location}

    Output format:
    - Price Range: â‚ªxx,xxx - â‚ªyy,yyy
    - Reasoning:`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides car price estimates.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }
    return extractPriceRangeAndReasoning(response);
  } catch {
    throw new Error('Failed to estimate car price');
  }
}

function extractPriceRangeAndReasoning(text: string): { minPrice: number; maxPrice: number; reasoning: string } {
  const priceRegex =
        /â‚ª\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*-\s*â‚ª\s?\d{1,3}(?:,\d{3})*(?:\.\d{2})?/;
  const priceMatch = text.match(priceRegex);

  if (!priceMatch) {
    return {
      minPrice: 0,
      maxPrice: 0,
      reasoning: 'Price range not found in response',
    };
  }

  const priceRange = priceMatch[0].replace(/\s+/g, '');
  const prices = priceRange.match(/\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g);

  if (!prices || prices.length < 2) {
    return {
      minPrice: 0,
      maxPrice: 0,
      reasoning: 'Could not extract price values',
    };
  }

  const minPrice = parseInt(prices[0].replace(/,/g, ''), 10);
  const maxPrice = parseInt(prices[1].replace(/,/g, ''), 10);

  // Extract reasoning (everything after the price range)
  const reasoningStart = text.indexOf(priceRange) + priceRange.length;
  const reasoning = text.substring(reasoningStart).trim() || 'No reasoning provided';

  return {
    minPrice,
    maxPrice,
    reasoning,
  };
}

