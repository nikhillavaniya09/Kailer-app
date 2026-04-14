import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

export const generateRandomIdea = async (type, context = "") => {
  const randomSeed = Math.floor(Math.random() * 9999999); 
  let prompt = "";
  
  if (type === "world") prompt = `Seed: ${randomSeed}. Give me ONE highly unique, evocative 1-sentence fictional world setting. Pick a completely random genre. Use simple language. Just the sentence.`;
  else if (type === "protagonist") prompt = `Seed: ${randomSeed}. Give me ONE highly unique 1-sentence description of a flawed protagonist. Include profession and their biggest secret. Use simple language. Just the sentence.`;
  else if (type === "hook") prompt = `Seed: ${randomSeed}. Give me ONE highly unique, sudden inciting incident (a hook) that disrupts a protagonist's life. Use simple language. Just the sentence.`;
  else if (type === "anchor") prompt = `Seed: ${randomSeed}. Name ONE totally random, specific, popular movie, book, or video game universe. CRITICAL RULE: You MUST NOT pick BioShock, Star Wars, Harry Potter, Lord of the Rings, or Marvel. Pick something obscure or different. Just the title.`;
  else if (type === "divergence") {
    if (context) {
       prompt = `Seed: ${randomSeed}. Give me ONE massive 'What If?' divergence point specifically for the fictional universe of '${context}'. Use simple language. Just the sentence.`;
    } else {
       prompt = `Seed: ${randomSeed}. Give me ONE massive 'What If?' divergence point for a random fictional universe. Use simple language. Just the sentence.`;
    }
  }

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().replace(/^["']|["']$/g, '').trim(); 
  } catch (error) {
    console.error("Dice Error:", error);
    return "A mysterious glitch in the matrix...";
  }
};

export const generateStoryForgeActOne = async (world, protagonist, hook) => {
  const prompt = `
    You are a master storyteller. Write Act 1 and Act 2 of a massive, highly detailed story:
    - The World: ${world}
    - The Protagonist: ${protagonist}
    - The Inciting Incident: ${hook}

    Rules:
    1. Start the response with a catchy title formatted as an H1 heading (e.g., # The Neon Shadow).
    2. USE EVERYDAY, ACCESSIBLE LANGUAGE. Do not use overly complex, fancy, or confusing vocabulary. Make it very easy and incredibly fun for a normal person to read and understand.
    3. Expand deeply on sensory details, dialogue, and pacing, but keep the words simple.
    4. Format with clean Markdown (### Act 1: The Setup, ### Act 2: The Escalation).
    5. You MUST stop at the end of Act 2 on a massive cliffhanger.
    6. At the very bottom, give the user 3 distinct, chaotic options for what the protagonist does next in Act 3. 
        Format exactly like this:
        **Option A:** [Choice description]
        **Option B:** [Choice description]
        **Option C:** [Choice description]
  `;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Story Forge Error:", error);
    return "Story Forge malfunctioned and the tale was lost in the void.";
  }
};

export const generateStoryForgeActThree = async (previousStory, chosenOption) => {
  const prompt = `
    Here is the story so far:
    ${previousStory}

    The user has chosen: ${chosenOption}

    Write the final, epic, highly detailed ### Act 3: The Climax & Resolution based strictly on this choice. 
    Make the ending satisfying, cinematic, and long. 
    CRITICAL RULE: USE EVERYDAY, ACCESSIBLE LANGUAGE. Do not use overly complex or confusing vocabulary. Make it easy for a normal reader to enjoy.
  `;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Act 3 Error:", error);
    return "The ending was lost in the void. Tragic!";
  }
};

export const generateMultiverseReality = async (anchor, divergence, path, tone, isComplexMode) => {
  let modeInstructions = "";

  if (isComplexMode) {
    modeInstructions = `
      CRITICAL OBJECTIVE: The user requested a MASSIVE, deep lore breakdown of the complex universe: "${anchor}".
      
      1. EXHAUSTIVE UNIVERSE RECAP: Explain the overarching plot, the intricate rules of the world, the history, and the core conflict of this specific universe in incredibly simple, everyday language.
      2. NO WHAT-IF SCENARIOS: DO NOT invent a "What-If" scenario or alternate reality. Your ONLY job is to explain the ORIGINAL canon story in extreme detail.
      3. LENGTH & DEPTH: This must be a very long, comprehensive guide. Break it down into clear sections using Markdown (e.g., ### The World, ### The Main Plot, ### Key Characters).
    `;
  } else {
    modeInstructions = `
      CRITICAL OBJECTIVE: Multiverse What-If Scenario.
      - Original Universe: ${anchor}
      - The Divergence Point: ${divergence}
      - New Reality Path: ${path}
      - New Genre/Tone: ${tone}

      1. QUICK RECAP: Start by briefly explaining the original story/universe of "${anchor}" in simple language so the user understands the baseline.
      2. THE DIVERGENCE: Introduce the user's specific "What If" scenario (${divergence}).
      3. THE NEW REALITY: Explain in MASSIVE detail how this specific change alters the timeline, leading to the ${path} result and shifting the tone to ${tone}.
    `;
  }

  const prompt = `
    You are a master multiverse chronicler. 
    
    ${modeInstructions}

    Rules:
    1. USE EVERYDAY, ACCESSIBLE LANGUAGE. Explain the concepts clearly so anyone can understand them without needing a dictionary.
    2. Start the response with a catchy title formatted as an H1 heading.
  `;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Multiverse Error:", error);
    return "The multiverse collapsed and the reality was lost.";
  }
};

export const generateVibeCheck = async (format, energy, atmospheres, timeCommitment, savedItemsContext, vibeReference, vibeMode, vibePlot) => {
  const randomSeed = Math.floor(Math.random() * 9999999);
  let modeInstructions = "";

  if (vibeMode === 'Find the plot') {
    modeInstructions = `
    CRITICAL OBJECTIVE: The user forgot the name of a specific ${format}. They remember this plot: "${vibePlot}".
    1. Identify the exact ${format} they are describing as your #1 recommendation.
    2. Provide 3 additional ${format} recommendations that are highly similar to that plot, just in case they misremembered details.
    3. IGNORE the requested energy, atmosphere, and time commitment. Finding the correct media is your ONLY priority.
    4. Write a MASSIVE, highly detailed explanation for each, proving exactly how it matches the plot they described.
    `;
  } else if (vibeMode === 'Analyse the idea') {
    modeInstructions = `
    CRITICAL OBJECTIVE: The user pitched a custom story idea: "${vibePlot}".
    1. Recommend exactly 4 ${format}s that share the exact themes, narrative structure, or vibe of their idea.
    2. Treat their requested energy and atmosphere as completely secondary or ignore them. The thematic match to their idea is the primary priority.
    3. Write a MASSIVE, highly detailed, multi-paragraph pitch for each, explaining exactly how the media mirrors their specific idea.
    `;
  } else {
    modeInstructions = `
    CRITICAL OBJECTIVE: Pure Vibe Check.
    1. Recommend exactly 4 ${format}s.
    2. Strictly follow these constraints: Energy: ${energy}, Atmospheres: ${atmospheres.join(" and ")}, Time Commitment: ${timeCommitment}.
    3. Write a MASSIVE, highly detailed pitch for every single recommendation. Do not be brief.
    `;
  }

  const referenceInstruction = vibeReference ? `Also, ensure the recommendations feel similar in style or caliber to: "${vibeReference}".` : "";

  const prompt = `
    Seed: ${randomSeed}
    You are Kailer's elite AI curator. Do not mention your AI nature.
    Do NOT recommend anything on this list: ${savedItemsContext || "None"}

    ${modeInstructions}
    ${referenceInstruction}

    STRICT FORMATTING RULES:
    - You MUST provide exactly 4 ${format} recommendations. Do not mix formats.
    - Start the response with your absolute best #1 match formatted strictly as a heading (e.g., "# Title Here").
    - ON THE VERY NEXT LINE, generate a highly specific, fictional match percentage (e.g., Match: 98.4%).
    - Clearly separate and number the next 3 recommendations (2, 3, 4) using bold text.
    - Speak in a friendly, conversational, everyday tone. Do not use pretentious critic jargon.
    - NEVER provide a short, one-sentence summary. Every recommendation must have a long, rich, engaging description of the lore, the characters, and the vibe.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Vibe Check Error:", error);
    return "The vibe was lost in the ether. Try again later.";
  }
};