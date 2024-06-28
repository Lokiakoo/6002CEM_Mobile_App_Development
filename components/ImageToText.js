import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoText, setPhotoText] = useState([]);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return 
      <View style={{height: '100%', width: '100%', justifyContent: 'center'}}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const savePhoto = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        //await MediaLibrary.saveToLibraryAsync(uri);
        console.log('Photo saved to camera roll');
        console.log(uri);
        sendImageToAPI(uri);
        const data = await sendImageToAPI(uri);
        const textArray = data.map((item) => item.text);
        console.log('Received Text:', textArray);
        for (let i = 0; i < textArray.length; i++) {
          speak(textArray[i]);
          handleMorseCodePress(textArray[i]);
        }
      } catch (error) {
        console.log('Error saving photo', error);
      }
    }
  };

  //speak
  const speak = (content) => {
    const lowercaseContent = content.toLowerCase();
    const thingToSay = lowercaseContent;
    Speech.speak(content, {
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
  const handleMorseCodePress = (text) => {
    const lowercaseText = text.toLowerCase();
    const vibrationPattern = getVibrationPattern(
      convertToMorseCode(lowercaseText)
    );
    Vibrating(vibrationPattern);
  };

  const sendImageToAPI = async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    try {
      const response = await fetch(
        'https://api.api-ninjas.com/v1/imagetotext',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Api-Key': '40ZFxsWCb2WpKvMl8I31kQ==Bpflp8kVIFdtrdxj',
          },
        }
      );

      const result = await response.json();
      console.log('Get Text result:', result);
      setPhotoText(result);
      return result;
    } catch (error) {
      console.log('Error sending image to API', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Image
        source={require('../assets/bg.jpg')}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          opacity: 0.9,
        }}
      />
      <CameraView style={{ flex: 2 }} facing={facing} ref={cameraRef}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            backgroundColor: 'transparent',
            margin: 64,
          }}>
          <TouchableOpacity
            style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'center' }}
            onPress={toggleCameraFacing}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
              Flip Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'center' }}
            onPress={savePhoto}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
              Save Photo
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      <View
        style={{
          flex: 1,
          margin: 16,
          flexWrap: 'wrap',
          color: 'white',
          padding: 8,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: 'white',
        }}>
        {photoText.map((item, index) => (
          <Text
            key={index}
            style={{ fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
            {item.text}
          </Text>
        ))}
      </View>
    </View>
  );
}
