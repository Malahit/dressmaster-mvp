import type { Item } from '@prisma/client';
import { env } from '../env.js';

type Occasion = 'work' | 'date' | 'sport';

interface PerplexityMessage {
  role: 'system' | 'user';
  content: string;
}

interface PerplexityRequest {
  model: string;
  messages: PerplexityMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface OutfitSuggestion {
  topId: string;
  bottomId: string;
  shoesId: string;
  accessoryIds: string[];
  reasoning: string;
}

/**
 * Получает рекомендации от Perplexity AI для подбора образов
 */
export async function getPerplexityOutfitSuggestions(
  items: Item[],
  occasion: Occasion,
  temp?: number
): Promise<OutfitSuggestion[] | null> {
  // Если API ключ не настроен, возвращаем null для fallback на правила
  if (!env.PERPLEXITY_API_KEY) {
    return null;
  }

  try {
    const tops = items.filter((i) => i.category === 'top');
    const bottoms = items.filter((i) => i.category === 'bottom');
    const shoes = items.filter((i) => i.category === 'shoes');
    const accessories = items.filter((i) => i.category === 'accessory');

    // Формируем контекст с доступными вещами
    const itemsContext = formatItemsForPrompt(tops, bottoms, shoes, accessories);
    
    const occasionMap = {
      work: 'офисная работа',
      date: 'свидание или встреча',
      sport: 'спортивное мероприятие'
    };
    
    const tempContext = temp !== undefined 
      ? `Температура: ${temp}°C. Учитывай погоду при подборе.`
      : 'Температура не указана.';

    const systemPrompt = `Ты стилист-консультант для мужчин 40+. Твоя задача — подобрать 3 уместных образа из имеющегося гардероба.
Используй знания о сочетании цветов, формальности и стиле. Для офисной одежды предпочитай классические сочетания.`;

    const userPrompt = `${tempContext}
Событие: ${occasionMap[occasion]}

Доступные вещи в гардеробе:
${itemsContext}

Подбери 3 лучших образа (комплекта одежды). Для каждого образа укажи:
1. ID верха (top)
2. ID низа (bottom) 
3. ID обуви (shoes)
4. ID аксессуаров (accessories) - опционально
5. Краткое объяснение выбора (1-2 предложения)

Отвечай строго в формате JSON массива:
[
  {
    "topId": "id верха",
    "bottomId": "id низа",
    "shoesId": "id обуви",
    "accessoryIds": ["id1", "id2"],
    "reasoning": "почему этот образ подходит"
  }
]`;

    const requestBody: PerplexityRequest = {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 1500
    };

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('Perplexity API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json() as PerplexityResponse;
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return null;
    }

    // Парсим JSON ответ
    const suggestions = parsePerplexityResponse(content, items);
    return suggestions;

  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    return null;
  }
}

function formatItemsForPrompt(
  tops: Item[],
  bottoms: Item[],
  shoes: Item[],
  accessories: Item[]
): string {
  let context = '';
  
  if (tops.length > 0) {
    context += 'Верх (tops):\n';
    tops.forEach(item => {
      context += `- ID: ${item.id}, цвет: ${item.color || 'не указан'}, формальность: ${item.formality || 'не указана'}\n`;
    });
  }
  
  if (bottoms.length > 0) {
    context += '\nНиз (bottoms):\n';
    bottoms.forEach(item => {
      context += `- ID: ${item.id}, цвет: ${item.color || 'не указан'}, формальность: ${item.formality || 'не указана'}\n`;
    });
  }
  
  if (shoes.length > 0) {
    context += '\nОбувь (shoes):\n';
    shoes.forEach(item => {
      context += `- ID: ${item.id}, цвет: ${item.color || 'не указан'}, формальность: ${item.formality || 'не указана'}\n`;
    });
  }
  
  if (accessories.length > 0) {
    context += '\nАксессуары (accessories):\n';
    accessories.forEach(item => {
      context += `- ID: ${item.id}, цвет: ${item.color || 'не указан'}\n`;
    });
  }
  
  return context;
}

function parsePerplexityResponse(content: string, items: Item[]): OutfitSuggestion[] {
  try {
    // Извлекаем JSON из ответа (может быть обернут в markdown code block)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }
    
    const suggestions = JSON.parse(jsonMatch[0]) as OutfitSuggestion[];
    
    // Валидируем что все ID существуют
    const validSuggestions = suggestions.filter(s => {
      const topExists = items.some(i => i.id === s.topId);
      const bottomExists = items.some(i => i.id === s.bottomId);
      const shoesExist = items.some(i => i.id === s.shoesId);
      return topExists && bottomExists && shoesExist;
    });
    
    return validSuggestions.slice(0, 3);
  } catch (error) {
    console.error('Error parsing Perplexity response:', error);
    return [];
  }
}
