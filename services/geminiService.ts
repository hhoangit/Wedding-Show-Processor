import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Role, ProcessedResult } from "../types";

// Initialize the client with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    assigned: {
      type: Type.BOOLEAN,
      description: "True if the provided 'ekipName' is found within the ekip/staff section of the raw data (usually inside parentheses at the end).",
    },
    Raw_data: {
      type: Type.STRING,
      description: "The original input string.",
    },
    data: {
      type: Type.OBJECT,
      properties: {
        date: {
          type: Type.STRING,
          description: "The date of the event if present, otherwise null.",
          nullable: true,
        },
        customer_name: {
          type: Type.STRING,
          description: "The bride and groom's names extraction.",
        },
        type_of_show: {
          type: Type.STRING,
          description: "The calculated service details based on the role rules (e.g., '1 MAKE + 2 DẶM' or '2 PS').",
        },
      },
      required: ["customer_name", "type_of_show"],
    },
  },
  required: ["assigned", "Raw_data", "data"],
};

export const processShowData = async (
  rawData: string,
  ekipName: string,
  role: Role
): Promise<ProcessedResult> => {
  const roleRules =
    role === Role.MUA
      ? `
      ROLE: MUA
      RULES FOR "type_of_show":
      - Analyze the time/type tokens in the raw string.
      - "Sáng, trưa" -> "1 MAKE + 2 DẶM"
      - "Sáng, chiều" -> "2 MAKE + 1 DẶM"
      - "1 tiệc" -> "1 MAKE + 1 DẶM"
      - "1 lễ" -> "1 MAKE"
      - Note: "thay 2 váy" -> adds "2 lần dặm cô dâu"
      - "TEST MAKEUP" -> "TEST MAKEUP 500k"
      - "DẶM MAKE NG NHÀ SG" -> "150K"
      
      MAPPING FOR STUDIO LOCATIONS (Return exactly as specified):
      - "Vũ Stu" -> "Vũ"
      - "Dream Stu" -> "Dream"
      - "Long Island" -> "Long Island"
      - "Vũ + SG + Stu" -> "Vũ + SG"
      - "SG Stu" -> "SG"
      - "Stu" -> "Stu"
      - "Phan Thiết" -> "Phan Thiết"
      - "Đà Lạt" -> "Đà Lạt"
      - "Stu cổng" -> "Stu Cổng"
      - "Vũng Tàu" -> "Vũng Tàu"
      
      FINAL OUTPUT FORMAT FOR 'type_of_show':
      Combine relevant counts: "[SỐ] MAKE + [SỐ] DẶM + [SỐ] DẶM MAKE NG NHÀ" OR Location Name.
      If count is 0, omit it.
      `
      : `
      ROLE: PHOTOGRAPHER
      RULES FOR "type_of_show":
      - Analyze if it is Traditional (TT) or Pre-wedding (PS).
      - "Sáng, trưa" -> "2 show"
      - "Sáng, chiều" -> "2 show"
      - "Sáng show + nhà thờ + chiều tiệc" -> "3 show"
      - "Sáng lễ + nhà thờ + chiều tiệc" -> "3 show"
      - "1 tiệc" -> "1 show"
      - "1 lễ gia tiên" -> "1 show"
      
      Identify if the role is CHỤP (Photo) or QUAY (Video). Default is CHỤP.
      
      MAPPING FOR STUDIO LOCATIONS (Return exactly as specified):
      - Same location mappings as MUA (Vũ, Dream, Long Island, etc.)
      
      FINAL OUTPUT FORMAT FOR 'type_of_show':
      "[SỐ] [CHỤP/QUAY] PS" or "[SỐ] [CHỤP/QUAY] TT" or Location Name.
      `;

  const prompt = `
    You are a wedding scheduling processor API.
    
    INPUT DATA:
    Raw String: "${rawData}"
    Target Staff Name (to check assignment): "${ekipName}"
    Role: "${role}"

    ${roleRules}

    INSTRUCTIONS:
    1. Parse the 'Raw String'. Structure usually looks like: (Salesman) ContractID Name - Name Type Note (Ekip List).
    2. Extract 'customer_name' (Bride and Groom).
    3. Determine 'assigned': Check if "${ekipName}" exists loosely in the Ekip List part of the string (usually at the end in parentheses). Case-insensitive.
    4. Calculate 'type_of_show' based strictly on the ROLE rules provided above.
    5. Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as ProcessedResult;
  } catch (error) {
    console.error("Gemini processing error:", error);
    throw error;
  }
};
