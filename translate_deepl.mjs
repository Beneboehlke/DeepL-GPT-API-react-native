const DEEPL_API_KEY = config.get("deeplApiKey");

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

// Function to call the DeepL API for translation
const deeplTranslate = async (query, targetLang) => {
  if (!(typeof query == "string" || Array.isArray(query))) return query;
  //check for empty string
  if (!query) return query;

  //check for empty array
  if (Array.isArray(query) && !(query.length > 0)) return query;

  const params = new URLSearchParams({
    auth_key: DEEPL_API_KEY,
    target_lang: targetLang,
  });

  if (typeof query == "string") {
    params.append("text", query);
  } else {
    query.forEach((text) => {
      params.append("text", text);
    });
  }

  try {
    const response = await axios.post(DEEPL_API_URL, params, {
      headers: {
        //"Content-Type": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // console.log(response.data.translations);
    return response.data.translations;
  } catch (error) {
    console.error("There was an error calling the DeepL API", error);
  }
};
