  // variable to store the language preference
  const [chosenLanguage, setChosenLanguage] = useState(null);
  const [seeTransalation, setSeeTranslation] = useState(true);

  const handleLanguageChange = lang => {
    if (lang == 'original') {
      setChosenLanguage('original');
    } else {
      setChosenLanguage(lang);
    }
    setSeeTranslation(!seeTransalation);
  };


  // these consts are connected to the entities in the gpt store and get updated accordingly 
  const {gptEnabled, gptResponseLoading, gptResponses} = useSelector(
    state => state.gpt,
  );

  // local variables 
  const [gptResponse, setgptResponse] = useState(null);
  const [gptResponseOpened, setGptResponseOpened] = useState(false);
  const [recomm_id, setRecomm_id] = useState(null);
  const [gptLoading, setGptLoading] = useState(false);


  // builds the JSON string input for GPT
  const gptInput = () => {
    let title = parseTranslatedContent(data, 'title', chosenLanguage);
    let desc = parseTranslatedContent(data, 'desc', chosenLanguage);
    let attributesObj = parseTranslatedContent(
      data,
      'attributes',
      chosenLanguage,
    );
    let attributesArr = [];

    for (let index = 0; index < attributesObj.length; index++) {
      attributesArr.push(attributesObj[index].item);
    }
    let language = chosenLanguage == null ? 'DE' : chosenLanguage;
    const input = {
      title: title,
      desc: desc,
      artributes: attributesArr,
      language: language,
    };
    return JSON.stringify(input);
  };

  // sets the recommendation_id as soon as the local data is available 
  useEffect(() => {
    if (data) {
      setRecomm_id(data._id);
    }
  }, [data]);

  // Effekt waits for variables and searches for existing Element with the _id in Store entries (gptResponses) sets gotResponse if found
  useEffect(() => {
    const foundElement = gptResponses.find(element => element.id === recomm_id);

     if (foundElement) {
      // console.log('element has been found in gptResponses');
      setgptResponse(foundElement);
    } else {
      // console.log('element has not been found in gptResponses');
      setgptResponse(null);
      // loadGPTContent() only if ther is no response for this item already found and the loading is not already in progress
      if (gptLoading) {
        return;
      } else {
        loadGPTContent();
        setGptLoading(true);
      }
    }
  }, [gptResponses, recomm_id]);

  const dispatch = useDispatch();

  // function that loads the gpt content
  const loadGPTContent = async () => {
    props.GptContextLoading(true);
    console.log('in loadingGPTContext();');
    props.getGptContext(gptInput(), recomm_id);
  };

  const handleGPTRequest = async () => {
    setGptResponseOpened(!gptResponseOpened);
  };

  const handleRenderGPTCorrupted = data => {
    // Handle the event/data emitted by the child
    console.log('this item was corrupted: ', data);
    props.deleteGPTItem(recomm_id);
  };


  const handleGptDisclaimer = () => {
    Alert.alert(
      'Disclaimer',
      'Information ist nicht verifiziert und keinerlei haftung wird übernommen '
      [{text: 'OK', onPress: () => console.log('Disclaimer read')}],
    );
  };




// visual part 
  return {
    // example use case of translation module
    <View style={styles.rowContainer1}>
      <Text style={styles.label}>{t('common:about')}</Text>
      <Text style={styles.desc}>
        {/* {data.desc?.trim()} */}
        {parseTranslatedContent(data, 'desc', chosenLanguage)}
      </Text>
    </View>
    // example use case of the gpt module
    // gptEnabled definses, if the gpt module is available or not
    {gptEnabled ? (
          <View>
            // as soon as the additional information is vailable
            {gptResponseOpened ? (
              <View>
                <View style={styles.rowContainer2}>
                  <View style={styles.rowContainer}>
                    <Text style={styles.contextInfoBtn}>
                      {''}
                      weitere kontextuelle Information{''}
                    </Text>
                    <TouchableOpacity onPress={() => handleGptDisclaimer()}>
                      <InformationCircleIcon style={styles.infoIcon} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => handleGPTRequest()}>
                    <Text style={styles.closeBtn}> close </Text>
                  </TouchableOpacity>
                </View>
               <View>
                  {/* {gptResponseLoading ? (
                    <Text style={styles.text}>loading...</Text>
                  ) : null} */}
                  {gptResponse ? (
                    <View>
                      <GPTRender
                        gptResponse={gptResponse.content}
                        onEvent={handleRenderGPTCorrupted}
                      />
                    </View>
                  ) : (
                    <Text style={styles.text}>loading...</Text>
                  )}
                </View>
              </View>
            ) : (
              // additional iformation has not yet been requested by user
              <View style={styles.rowContainer1}>
                <TouchableOpacity onPress={() => handleGPTRequest()}>
                  <Text style={styles.contextInfoBtnLink}>
                    {' '}
                    weitere kontextuelle Information{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}
      }

  // redux store actions get mapped to the local props
  const mapDispatchToProps = dispatch => {
    return {
      getGptContext: (query, id) => dispatch(actions.getGptContext(query, id)),
      deleteGptContext: id => dispatch(actions.deleteGPTItem(id)),
      GptContextLoading: loadingStatus => dispatch(actions.loadingGptItem(loadingStatus)),
    };
  };
