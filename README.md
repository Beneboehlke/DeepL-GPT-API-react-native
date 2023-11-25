# DeepL-GPT-API-react-native
This Repository documents the practices used to integrate both the DeepL as well as the GPT API into the [basense](https://basense.com/recommendations/646919ca52dade4f296ea997) Application for the bachelor thesis ...

To get started one needs API Keys for [DeepL](https://www.deepl.com/pro?utm_source=github&utm_medium=github-nodejs-readme#developer) as well as the [GPT](https://auth0.openai.com/u/signup/identifier?state=hKFo2SBCUWRPRkZUQ25yb2FFRHh2NjMzcXJkb0xUak5sa1JOeKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIGNjcUc3NnJrek9LelRRR0RWWmlTLXI0ek5UdHJ6YTN5o2NpZNkgRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0Q) API.

For more details on the specific API's visit: <br>
[Deepl Documentation](https://www.deepl.com/pro-api?cta=header-pro-api) <br>
[OpenAI (GPT) Documentation](https://openai.com/product)

## General System Setup
The existiing Setup to start with contained a frontend part written in react native and a backend part written in Node.js. 

## DeepL integration
Depending on your System setup and the expected traffic on your application the way you approach transaltion may shift slightly. For this project live transaltion was chosen, as the traffic isn't, at least for now, expected to be too high and therefore future inconsistencies in the data structure, as well as outdated (bad) translations won't pose issues. Using tis setup you can translate the content right after being fetched from the Server, before being sent to the frontend. That being sayed you may want to transalte your content once and store it for a set period of time in the database before retransalting, using an advanced model. Additionally that may safe cost in translation, as a limit of 500.000 caracters monthly are currently for free, using the DeepL API.


### backend 
The integration in the case of the basense project looks as follows:

With each Object, that needs to be translated you call the function 'deeplTranslate(query, targetLang)', which takes two input parameters: the Object to be translated, as well as the language it's supposed to be translated into. For a more detailed look at the code visit: <br>
[translate_deepl](./translate_deepl.mjs)

