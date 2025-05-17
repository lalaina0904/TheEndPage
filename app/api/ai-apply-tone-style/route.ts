import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content, tone } = await req.json();
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
      Génère un style CSS (au format JSON) pour ce contenu qui correspond au ton suivant:
      Contenu: ${content}
      Ton: ${tone}
      
      Les propriétés CSS doivent inclure au minimum:
      - fontFamily
      - color
      - backgroundColor
      - lineHeight
      - padding
      - maxWidth
      
      Retourne uniquement un objet JSON valide. Exemple:
      {
        "fontFamily": "'Helvetica Neue', sans-serif",
        "color": "#222",
        "backgroundColor": "#f9f9f9",
        "lineHeight": "1.6",
        "padding": "2rem",
        "maxWidth": "800px"
      }
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    const css = jsonString;
    
    return NextResponse.json({ css }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du style" },
      { status: 500 }
    );
  }
}