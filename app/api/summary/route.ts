import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}



export async function POST(req: NextRequest) {
  try {
    console.log("Received request");

    const { cloudinaryUrl, jobTitle } = await req.json();
    console.log("Received jobTitle:", jobTitle);
    console.log("Received cloudinaryUrl:", cloudinaryUrl);

    if (!cloudinaryUrl || !jobTitle) {
      return NextResponse.json(
        { error: "Missing cloudinaryUrl or jobTitle" },
        { status: 400 }
      );
    }

    if (!cloudinaryUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Invalid cloudinaryUrl provided" },
        { status: 400 }
      );
    }

    console.log("Processing cloudinaryUrl:", cloudinaryUrl);

    const genAi = new GoogleGenerativeAI(apiKey as string);
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an ATS resume analyzer. Analyze this resume for the job role: "${jobTitle}".

You must respond with ONLY a valid JSON object. No explanations, no markdown, no additional text.

Use this exact format and replace the values with your analysis:

{
  "atsScore": 85,
  "keywordsMatch": 92,
  "formatScore": 78,
  "keyStrengths": ["Strong keyword optimization", "Clear professional summary", "Quantified achievements"],
  "areasForImprovement": ["Add more industry-specific keywords", "Include more recent certifications", "Optimize for specific job requirements"],
  "recommendations": ["Add 3-5 more relevant keywords", "Include recent project examples", "Tailor summary to target role"],
  "keywordAnalysis": "The resume includes basic keywords but could benefit from more industry-specific terms like 'machine learning', 'data analysis', and 'project management'.",
  "overallAssessment": "This is a solid resume with good structure and relevant experience. With some keyword optimization and role-specific tailoring, it would perform well in ATS systems."
}

IMPORTANT: Return ONLY the JSON object. Nothing else.
`;

    // Fetch the Cloudinary image and convert to base64 for Gemini
    let imagePart = null;
    try {
      console.log("Fetching image from:", cloudinaryUrl);
      const response = await fetch(cloudinaryUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');

      if (!base64Data || base64Data.length === 0) {
        throw new Error("Empty image data received");
      }

      console.log("Image data length:", base64Data.length);

      imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      };
    } catch (error) {
      console.error(`Failed to fetch image: ${cloudinaryUrl}`, error);
      return NextResponse.json(
        { error: `Failed to process image for analysis: ${error}` },
        { status: 500 }
      );
    }

    if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
      console.error("Invalid image part:", imagePart);
      return NextResponse.json(
        { error: "Failed to process image for analysis - invalid data" },
        { status: 500 }
      );
    }

    const contentParts = [
      { text: prompt },
      imagePart,
    ];

    try {
      console.log("Sending content to Gemini with", contentParts.length, "parts");
      console.log("Image part data length:", imagePart.inlineData.data.length);

      const result = await model.generateContent(contentParts);
      const responseText = result.response.text();

      console.log("Gemini response received, length:", responseText.length);
      console.log("First 500 characters of response:", responseText.substring(0, 500));
      console.log("Last 500 characters of response:", responseText.substring(responseText.length - 500));

      // Try to parse the JSON response
      let analysisData;
      let cleanedResponse = responseText.trim();
      
      // Remove any markdown formatting
      cleanedResponse = cleanedResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Try to extract JSON if it's wrapped in other text
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }
      
      try {
        analysisData = JSON.parse(cleanedResponse);
        console.log("Successfully parsed JSON response");
        console.log("Parsed data keys:", Object.keys(analysisData));
        console.log("ATS Score:", analysisData.atsScore);
        console.log("Keywords Match:", analysisData.keywordsMatch);
        console.log("Format Score:", analysisData.formatScore);
        
        // Validate that we have the required fields
        if (!analysisData.atsScore || !analysisData.keywordsMatch || !analysisData.formatScore) {
          console.error("Missing required fields in parsed data");
          return NextResponse.json({
            summary: responseText,
            isStructured: false
          });
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        console.log("Raw response:", responseText);
        console.log("Cleaned response:", cleanedResponse);
        
        // Try one more time with the original response
        try {
          analysisData = JSON.parse(responseText);
          console.log("Successfully parsed original response");
        } catch (secondParseError) {
          console.error("Second parse attempt failed:", secondParseError);
          
          // Try to create a fallback structured response from the text
          const fallbackData = {
            atsScore: 75,
            keywordsMatch: 70,
            formatScore: 80,
            keyStrengths: ["Resume analysis completed", "Basic structure detected"],
            areasForImprovement: ["Unable to parse detailed analysis", "Check resume format"],
            recommendations: ["Review the raw analysis below", "Consider manual review"],
            keywordAnalysis: "Analysis completed but JSON parsing failed. Raw response: " + responseText.substring(0, 200) + "...",
            overallAssessment: "Resume analysis completed but structured data unavailable. Please review the raw analysis."
          };
          
          return NextResponse.json({
            summary: fallbackData,
            isStructured: true
          });
        }
      }

      return NextResponse.json({
        summary: analysisData,
        isStructured: true
      });
    } catch (error: unknown) {
      console.error("Error generating summary:", error);
      return NextResponse.json(
        { error: `Failed to generate summary: ${error}` },
        { status: 500 }
      );
    }
  }
  catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: `Failed to generate summary: ${error}` },
      { status: 500 }
    );
  }
}