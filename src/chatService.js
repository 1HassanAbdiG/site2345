/*import axios from "axios";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY; // Utilise la clé depuis .env
const API_URL = "https://api.openai.com/v1/chat/completions";

export const fetchChatGPTResponse = async (message) => {
  if (!API_KEY) {
    console.error("Erreur: Clé API OpenAI manquante !");
    return "Erreur: Clé API non configurée.";
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-3.5-turbo", // ou "gpt-4"
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur avec OpenAI:", error.response ? error.response.data : error.message);
    return "Erreur, impossible de contacter ChatGPT.";
  }
  console.log("Clé API:", process.env.REACT_APP_OPENAI_API_KEY);
};
*/