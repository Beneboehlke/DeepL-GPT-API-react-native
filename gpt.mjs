import config from "config";
import express from "express";
import axios from "axios";
import { verifyAccessToken } from "../middleware/auth.mjs";
import OpenAI from "openai";

const router = express.Router();
// always make sure no to publically display your api keys
const OPENAI_API_KEY = config.get("chatGPTApiKey");

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// !Note: This System Message is highly personalized fo rthe needs of this thesis. Make sure to create your own message fitting your needs!
const SystemMessage = `You will be provided with an object that includes fours subobjects. these are: title, desc ( as description), attributes and language.
  You are an expert on the field around the topic described in the tags.
  Follow the following four steps described to answer the user. Don't formulate an answer befor reading through all the steps: 
  
  Step1: read and understand the tags for yourself. (Do not outupt this step.)
  
  Step2: work out the five most important concepts of all the texts contained in the tags title, desc and attributes. 
  Prepare a list of these five concepts in the language provided in the language tag, describing each concept briefly in one sentence. For describing the concepts do not limit yourself 
  to the content provided by the user but use your general knowledge as an expert. Do so in the order of importance, starting with the most important concept, using the 
  following format, creatig a JSON structure. Make sure the Object follows the provided structure precisely and save it for the last Step:
  {
    { title: <concept1>, description: <description of the concept> },
    { title: <concept2>, description: <description of the concept> },
    { title: <concept3>, description: <description of the concept> },
    { title: <concept4>, description: <description of the concept> },
    { title: <concept5>, description: <description of the concept> }
    
  }
  
  
  Step3: as an expert in the field you work out the top five most interresting follow up nudges for the user. Prepare a list of these five nudges in the 
  language provided in the language tag, describing each element briefly in one sentence. For describing the nudges do not limit yourself to the content provided by the user but 
  use your general knowledge as an expert. Do so in the order of importance, starting with the most important element, using the 
  following format, creating a JSON structure. Make sure the Object follows the provided structure precisely and save it for the last Step:
  {
    { title: <nudge1>, description: <description of the nudge> },
    { title: <nudge2>, description: <description of the nudge> },
    { title: <nudge3>, description: <description of the nudge> },
    { title: <nudge4>, description: <description of the nudge> },
    { title: <nudge5>, description: <description of the nudge> }
  }
  
  Step4: prepare the output for the user using the following structure, by combining the two Objects from Step2 and Step3 insto one Object. The final structure is as follows:
  {
    concepts: <list of concepts from Step2>
    ,
    nudges: <list of nudges from Step3>
  }
  `;

async function postQueryGPT(inputObject) {
  try {
    // this part actually calls the API and includes the system message 
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SystemMessage,
        },
        {
          role: "user",
          content: inputObject.query,
        },
      ],
      // make sure to choose the best fitting avilable model for your needs
      model: "gpt-4-1106-preview",
      // respose format can optionally be set if wanted 
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API postQueryGPT:", error);
    throw error;
  }
}

//New route for OpenAI requests
router.post("/request", verifyAccessToken, async (req, res) => {

  const inputObject = req.body.params;

  try {
    const openAIResponse = await postQueryGPT(inputObject);

    return res.json(openAIResponse);
  } catch (error) {
    console.error("Error calling OpenAI API router.post:", error);
    return res.status(500).send("Internal Server Error");
  }
});


export default router;
