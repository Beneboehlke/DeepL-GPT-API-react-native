# DeepL-GPT-API-react-native
This Repository documents the practices used to integrate both the DeepL as well as the GPT API into the [basense](https://basense.com/recommendations/646919ca52dade4f296ea997) Application for the bachelor thesis ...

To get started one needs API Keys for [DeepL](https://www.deepl.com/pro?utm_source=github&utm_medium=github-nodejs-readme#developer) as well as the [GPT](https://auth0.openai.com/u/signup/identifier?state=hKFo2SBCUWRPRkZUQ25yb2FFRHh2NjMzcXJkb0xUak5sa1JOeKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIGNjcUc3NnJrek9LelRRR0RWWmlTLXI0ek5UdHJ6YTN5o2NpZNkgRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0Q) API.

For more details on the specific API's visit: <br>
[Deepl Documentation](https://www.deepl.com/pro-api?cta=header-pro-api) <br>
[OpenAI (GPT) Documentation](https://openai.com/product)

## General System Setup
The existing Setup to start with contained a Frontend written in react native and a backend written in NodeJs. 

--------

## DeepL integration
Additional Note towards System architecture: <br>
Depending on your System setup and the expected traffic on your application the way you approach transaltion may shift slightly. For this project live transaltion was chosen, as the traffic isn't, at least for now, expected to be too high and therefore future inconsistencies in the data structure, as well as outdated (bad) translations won't pose issues. Using this setup you can translate the content right after being fetched from the Server, before being sent to the frontend. That being sayed you may want to translate your content once and store it for a set period of time in the database before retransalting, using an advanced model, if you expect to encounter greater traffic. Also that may safe cost in translation, as a limit of 500.000 caracters monthly are currently for free, using the DeepL API.



### Backend 
For each Object that needs to be translated make sure to extract the strings into seperate Arrays in advance.
For each Array that needs to be translated you call the function ```deeplTranslate(query, targetLang)```, which takes two input parameters: the string Array to be translated, as well as the language it's supposed to be translated into. For a more detailed explenation visit: [translate_deepl](./translate_deepl.mjs) <br>

To save the content to the Object map the result (if its an Array) into a (JSON-) Object with the desired structure after translation.

```jsx
contentObj.attributes.map((attrObj, index) => {
  if (attrObj?.item && typeof attrObj?.item == "string") {
    attributesArr.push({
      ...attrObj,
      item: translatedResponse[index].text,
    });
  }
});
```

For this Project the translations got added as an additional Subobject to the Original in order to preserve the Original language, as well as to enable transaltions into multiple langauges to be saved to the same Object, using following structure:

```jsx
{
  //original content of the Object
  translated_Content: {
    EN: {
      // english transaltion 
    }
    // alternative translations
    DE: {
      // german translation
    }
  }
}
```



### Frontend
Choosing the preffered langauage for the user is really easy now, as you just create a general function for fetching the transaltion in a seperate file: [Translate](./Translate.js) <br>

and call it from within any component where you need translated user content displayed:

```jsx
{parseTranslatedContent(data, 'desc', chosenLanguage)}
```
full code at [Specific_Recommendation.js](./Specific_Recommendation.js)

----------------

## GPT integration
In this Project the OPENAI (GPT) API call happens, for multiple reasons like time sensible content and performance, only on user request.

The gerneral structure is as follows: <br>
Frontend: <br>
  - [user requests](#user-request) content in specific components
  - async [call to backend](#backend-call) using dispatch is made <br>
  
Backend: <br>
  - OPENAI API request is handeled in backend
  - response(backend) is formatted into valid JSON file and sent to frontend <br>
  
Frontend: <br>
  - Object with response(frontend) plus ObjectId is [saved to a redux store](#save-response-to-store)
  - component tries to [render the conent](#rendering-content) on store state update
  - on JSON Object error component provides Option to retry

This architecture has the advantages that the API Key is savely stored in the backend and due to the response being saved to the store multiple responses can be saved during the session. Therefore the API only needs to be called once for every specific component / Object. (data isn't lost when calling the API again for a differnt Object in the same component)


### Frontend

#### User Request
The user triggers the API call using a Button:
``` jsx
<TouchableOpacity onPress={() => handleGPTRequest()}>
  <Text>
    // text to trigger call
    call GPT
  </Text>
</TouchableOpacity>
```
gets handeled through a const:
```jsx
const handleGPTRequest = async () => {
  // call the get Context action in the redux store
};
```

full code at [Specific_Recommendation.js](./Specific_Recommendation.js)


#### backend call
In the action file [GPT.js](./GPT.js) the function ```getGptContext(query, id)``` takes the input, sends the request to the backend and sends the response to the store defined by an action type, as soon as it arrived.
Therefore the action types have to be defined somewhere in an ```actionTypes.js``` file (probably best loacted e.g. in a constants folder: 

```jsx
export const GPT_CONTROLS = 'GPT_CONTROLS';
export const GPT_CORRUPTED = 'GPT_CORRUPTED';
export const GPT_LOADING = 'GPT_LOADING';
```

full code at [GPT.js](./GPT.js)


#### save response to store 
The response from the backend call gets send to the GPT store [GPT_reducer.js](./GPT_reducer.js) and gets added to the array of ```gptResponses```, via the specific action type case ```GPT_CONTROLS```.
The ```gptResponses``` Array containes all the responses, identifiable by the _id of the database entry.

```jsx
switch (action.type) {
    case actionTypes.GPT_CONTROLS:
      return {
        ...state,
        gptResponseLoading: false,
        gptResponses: state.gptResponses.concat(action.payload.gptResponses),
      };
    // alternative cases
    default:
      return state;
  }
```

full code at [GPT_reducer.js](./GPT_reducer.js)


#### rendering content 
With this event the Selector in [Specific_Recommendation](./Specific_Recommendation) gets triggert and the entry from within the store can be displayed in the component.

```jsx
 const {gptEnabled, gptResponseLoading, gptResponses} = useSelector(
    state => state.gpt,
  );

 // use Effect gets triggert again and sets the local constant gptResponse
 useEffect(() => {
    const foundElement = gptResponses.find(element => element.id === recomm_id);

    if (foundElement) {
      setgptResponse(foundElement);
    } else {
      // different case
    }
  }, [gptResponses, recomm_id]);
```

with the update of the local const ```gptResponse```the displaying code snipped gets activated and the JSON file gets sent to the component ```GPTRender```:

```jsx
{gptResponse ? (
  <View>
    <GPTRender
      gptResponse={gptResponse.content}
    />
  </View>
) : null}
```

full code at [Specific_Recommendation](./Specific_Recommendation)

Which renders the content accordingly:

```jsx
<ScrollView >
  <RenderSection title="Konzepte" content={gptResponse.concepts} />
  <RenderSection title="Nudges" content={gptResponse.nudges} />
</ScrollView>
```

full code at [GPTRender](./GPTRender)


### Backend

#### 

