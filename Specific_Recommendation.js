
  const {gptEnabled, gptResponseLoading, gptResponses} = useSelector(
    state => state.gpt,
  );
  const [gptResponse, setgptResponse] = useState(null);
  const [gptResponseOpened, setGptResponseOpened] = useState(false);
  const [recomm_id, setRecomm_id] = useState(null);

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
    // console.log('this is input: ', JSON.stringify(input));
    return JSON.stringify(input);
  };

  useEffect(() => {
    if (data) {
      setRecomm_id(data._id);
      // console.log('set the recomm_id: ', recomm_id);
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




// visueller part 
  return {
    // gptEnabled bestimmt ob das tool für den Nutzer zur Verfügung ssteht
    {gptEnabled ? (
          <View>
            // sobald die zusatzinformation beantragt ist
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

  // actions des Redux Stores werden and props gemapped ( zur einfacheren Verwendung )
  const mapDispatchToProps = dispatch => {
    return {
      getGptContext: (query, id) => dispatch(actions.getGptContext(query, id)),
      deleteGptContext: id => dispatch(actions.deleteGPTItem(id)),
      GptContextLoading: loadingStatus => dispatch(actions.loadingGptItem(loadingStatus)),
    };
  };
