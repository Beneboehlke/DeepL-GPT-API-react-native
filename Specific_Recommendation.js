// get your imports based on components that are not found

// these consts are connected to the entities in the gpt store and get updated accordingly 
  const {gptEnabled, gptResponseLoading, gptResponses} = useSelector(
    state => state.gpt,
  );

  // local variables 
  const [gptResponse, setgptResponse] = useState(null);
  const [gptResponseOpened, setGptResponseOpened] = useState(false);
  const [recomm_id, setRecomm_id] = useState(null);

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
    }
  }, [gptResponses, recomm_id]);

  const dispatch = useDispatch();

  // checks if Response esists otherwise calls action in store initaiting API call (getGptContext) 
  const handleGPTRequest = async () => {
    setGptResponseOpened(!gptResponseOpened);
    props.GptContextLoading(true);
    // check if ther is already data or not, if there is retiurn, if not call API

    if (gptResponse) {
      console.log(
        'there is already a response for this item: loading falsse and returning',
      );
      props.GptContextLoading(false);
      return;
    }
    props.getGptContext(gptInput(), recomm_id);
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
    // gptEnabled bestimmt ob das tool für den Nutzer zur Verfügung ssteht
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
                  {gptResponseLoading ? (
                    <Text style={styles.text}>loading...</Text>
                  ) : null}
                  {gptResponse ? (
                    <View>
                      <GPTRender
                        gptResponse={gptResponse.content}
                        onEvent={handleRenderGPTCorrupted}
                      />
                    </View>
                  ) : null}
                </View>
              </View>
            ) : (
              // zusatzinformation wurde noch nicht beantragt
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
