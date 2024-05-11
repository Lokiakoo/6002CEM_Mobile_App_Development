import * as Speech from 'expo-speech';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

export default function Page1() {
  //shortVibration signal
  const shortVibration = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Heavy);
  };

  //longVibration signal
  const longVibration = () => {
    Vibration.vibrate(100);
  };

  //pause
  const pause = () => {
    return new Promise((resolve) => setTimeout(resolve, 600));
  };

  //vibratigin function
  const Vibrating = async (pattern) => {
    for (let i = 0; i < pattern.length; i++) {
      await pattern[i]();
      await pause();
    }
  };

  //speak
  const speak = (content) => {
    const lowercaseContent = content.toLowerCase();
    const thingToSay = lowercaseContent;
    Speech.speak(thingToSay, {
      language: 'en-US',
      rate: 0.9,
      pitch: 5,
    });
  };

  const morseCodedata = {
    A: '.-',
    B: '-...',
    C: '-.-.',
    D: '-..',
    E: '.',
    F: '..-.',
    G: '--.',
    H: '....',
    I: '..',
    J: '.---',
    K: '-.-',
    L: '.-..',
    M: '--',
    N: '-.',
    O: '---',
    P: '.--.',
    Q: '--.-',
    R: '.-.',
    S: '...',
    T: '-',
    U: '..-',
    V: '...-',
    W: '.--',
    X: '-..-',
    Y: '-.--',
    Z: '--..',
  };

  const morseCodeNumberData = {
    0: '-----',
    1: '.----',
    2: '..---',
    3: '...--',
    4: '....-',
    5: '.....',
    6: '-....',
    7: '--...',
    8: '---..',
    9: '----.',
  };

  //key pair for vibration
  const getVibrationPattern = (morseCode) => {
    const pattern = [];
    for (let i = 0; i < morseCode.length; i++) {
      const char = morseCode[i];
      if (char === '.') {
        pattern.push(shortVibration);
      } else if (char === '-') {
        pattern.push(longVibration);
      }
    }
    return pattern;
  };

  //use morseCodedata for vibration
  const handleMorseCodePress = (morseCode) => {
    const vibrationPattern = getVibrationPattern(morseCode);
    Vibrating(vibrationPattern);
  };

  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Image
        source={require('../assets/bg.jpg')}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          opacity: 0.9,
        }}
      />

      <Image
        source={require('../assets/morseCode.jpg')}
        style={{
          width: '100%',
          height: '10%',
          opacity: 0.9,
        }}
      />

      <FlatList style={{  width: '100%', height: '100%', justifyContent: 'center'}}
        data={Object.entries(morseCodeNumberData).concat(
          Object.entries(morseCodedata)
        )}
        numColumns={5}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1,
              borderWidth: 2,
              borderRadius: 10,
              padding: 4,
              margin: 4,
              backgroundColor:
                item[0] in morseCodeNumberData
                  ? 'rgba(125, 125, 125, 0.5)'
                  : 'rgba(255, 255, 255, 0.5)',
              borderColor: item[0] in morseCodeNumberData ? 'black' : 'white',
            }}
            onPress={() => {
              handleMorseCodePress(item[1], item[0]);
              speak(item[0]);
            }}>
            <Text
              style={{
                fontSize: 20,
                color: item[0] in morseCodeNumberData ? 'white' : 'black',
                textAlign: 'center',
              }}>
              <Text>{`${item[0]}\n`}</Text>
              <Text>{item[1]}</Text>
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item[0]}
      />
    </View>
  );
}
