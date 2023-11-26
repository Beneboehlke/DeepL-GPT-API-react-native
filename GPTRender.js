/// make sure the paths are correct
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {COLORS, FONTS, SIZES} from '../utils/Index';
import {moderateScale} from 'react-native-size-matters';

const RenderSection = ({title, content}) => (
  <View>
    <Text style={styles.categories}>{title}</Text>
    {content.map((item, index) => (
      <View key={index} style={{marginBottom: 10}}>
        <Text style={styles.titles}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>
    ))}
  </View>
);

// GPTRender gets called and tries to render two sections independantly ('Konzepte' and 'Nudges')
const GPTRender = ({gptResponse, onEvent}) => {
  try {
    return (
      <ScrollView style={{padding: 10}}>
        <RenderSection title="Konzepte" content={gptResponse.concepts} />
        <RenderSection title="Nudges" content={gptResponse.nudges} />
      </ScrollView>
    );
  } catch (error) {
    return (
      // provide option to retry the api request, if response can't be rendered 
      <View>
        <Text style={styles.text}>Das hat leider nicht geklappt</Text>
        <TouchableOpacity onPress={() => onEvent('error')}>
          <Text style={styles.contextTryAgainBtn}>erneut versuchen</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default GPTRender;

const styles = StyleSheet.create({
  // creaty styling according to your wishes
});
