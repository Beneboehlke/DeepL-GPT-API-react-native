export const parseTranslatedContent = (data, key, lang) => {
  // checking for original lang request and else using the set lang from settings
  // function gets the chosen language and the default if none is chosen

  // get the language that is safed vor this device as a standard if necessary
  let langNormal = 'DE';

  if (lang == 'original') {
    try {
      let value = '';
      value = data?.[key];
      if (typeof value == 'string') value.trim();
      return value;
    } catch (error) {}
  } else if (lang == null) {
    // console.log('there is no lang parameter');
    try {
      let value = '';
      if (data?.translatedContent?.[langNormal][key]) {
        // console.log('this is Translate.js if loop');
        value = data.translatedContent[langNormal][key];
      } else {
        // console.log('this is Translate.js else loop');
        value = data?.[key];
      }

      if (typeof value == 'string') value.trim();

      return value;
    } catch (error) {}
  } else {
    try {
      let value = '';
      if (data?.translatedContent?.[lang][key]) {
        // console.log('this is Translate.js if loop');
        value = data.translatedContent[lang][key];
      } else {
        // console.log('this is Translate.js else loop');
        value = data?.[key];
      }

      if (typeof value == 'string') value.trim();

      return value;
    } catch (error) {}
  }
};
