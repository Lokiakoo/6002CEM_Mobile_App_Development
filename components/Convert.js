import { useState } from 'react';
import * as Speech from 'expo-speech';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

export default function Convert() {
  const [inputText, setInputText] = useState('');
  const [morseCode, setMorseCode] = useState('');

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

  //text to morse code
  const convertToMorseCode = (text) => {
    const input = text.toUpperCase();
    let morseCode = '';
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char === ' ') {
        morseCode += ' ';
      } else if (morseCodedata.hasOwnProperty(char)) {
        morseCode += morseCodedata[char] + ' ';
      }
    }
    return morseCode.trim();
  };

  //input text
  const handleTextChange = (text) => {
    setInputText(text);
    const convertedMorseCode = convertToMorseCode(text);
    setMorseCode(convertedMorseCode);
  };

  //input cancel
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ height: '100%', justifyContent: 'space-between' }}>
        <Image
          source={require('../assets/bg.jpg')}
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            opacity: 0.9,
          }}
        />

        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              height: '35%',
              width: '80%',
              padding: 8,
              fontSize: 20,
              fontWeight: 'bold',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'lightblue',
            }}>
            {morseCode}
          </Text>

          <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 16 }}>
            Convert English to Morse Code
          </Text>
          <TextInput
            style={{
              height: '35%',
              width: '80%',
              padding: 8,
              fontSize: 20,
              fontWeight: 'bold',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'lightblue',
              marginBottom: 8,
            }}
            multiline={true}
            placeholder="Enter English text"
            value={inputText}
            onChangeText={handleTextChange}
          />
          <TouchableOpacity
            style={{
              width: '80%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: 8,
              fontSize: 20,
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'lightblue',
            }}
            onPress={() => handleMorseCodePress(morseCode)}>
            <Text style={{ color: 'white', fontSize: 20 }}>
              Vibrate Morse Code
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
