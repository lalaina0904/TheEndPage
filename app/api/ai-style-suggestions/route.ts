import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content, currentTone, currentFormat } = await req.json();
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      En tant qu'expert en design et rédaction, propose 4 variations de style CSS pour ce contenu:
      Contenu: ${content}
      Ton actuel: ${currentTone}
      Format actuel: ${currentFormat}
      
      Pour chaque suggestion, retourne:
      1. Une description du style (ex: "Moderne et épuré", "Classique et élégant")
      2. Un objet JSON avec les propriétés CSS (ex: { "fontFamily": "Arial", "color": "#333", "lineHeight": "1.6" })
      3. Le ton qui correspond le mieux à ce style
      
      Retourne uniquement un tableau JSON valide. Exemple de format:
      [
        {
          "description": "Style moderne et épuré",
          "css": "{\\"fontFamily\\": \\"'Helvetica Neue', sans-serif\\", \\"color\\": \\"#222\\", \\"lineHeight\\": \\"1.8\\"}",
          "tone": "professional"
        },
        ...
      ]
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Nettoyer et parser la réponse
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    const suggestions = JSON.parse(jsonString);
    
    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des suggestions" },
      { status: 500 }
    );
  }
}
