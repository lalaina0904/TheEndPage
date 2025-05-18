import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function scorePage(html: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
Voici le code HTML d'une page web. Donne-lui une note sur 10 selon :
1. La pertinence du contenu textuel (minimum 30 caractères requis).
2. La présence d’au moins une image ou un GIF.

Code HTML :
${html}

Réponds uniquement avec un score numérique entre 0 et 10.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // On extrait un score numérique
  const score = parseFloat(text.match(/[\d.]+/)?.[0] || '0');
  return score;
}
