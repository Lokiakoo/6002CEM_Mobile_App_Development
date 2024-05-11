import { useState, useEffect } from 'react';
import {
  View,
  Button,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';

export default function MessageBoard() {
  //get message when enter this page
  useEffect(() => {
    getAllMessage();
    getCurrentLocation();
  }, []);

  //received message
  const [messages, setMessages] = useState([]);
  //input message
  const [message, setMessage] = useState('');
  //translation state
  const [translation, setTranslation] = useState('');
  //store location
  const [address, setAddress] = useState('');
  //base url for get and post message
  const messageDB =
    'https://moblie-ge-board-degree-phcqmagclq.cn-hongkong.fcapp.run';

  //get GPS location
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          method: 'GET',
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      const addressData = {
        town: data.address.town,
        city: data.address.city,
        state: data.address.state,
      };
      setAddress(addressData);
    } catch (error) {
      console.log('Error getting current location:', error);
    }
  };

  //method GET : get all message
  const getAllMessage = async () => {
    try {
      const response = await fetch(messageDB, {
        method: 'GET',
      });
      const data = await response.json();
      const sortedMessages = data.sort((a, b) => {
        const dateA = parseTimestamp(a.timestamp);
        const dateB = parseTimestamp(b.timestamp);
        return dateB - dateA;
      });
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error getting messages:', error);
    }
  };

  //method POST : post message
  const postMessage = async () => {
    try {
      const timestamp = new Date().getTime();
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleString();
      const sendMessage = {
        message: message,
        timestamp: formattedDate,
        address: address,
      };
      const response = await fetch(messageDB, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendMessage),
      });
      const data = await response.json();
      setMessage();
      await getAllMessage();
    } catch (error) {
      console.error('Error posting message:', error);
    }
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

  //translate morse code to english
  const translateMorseToEnglish = (morseCode) => {
    const morseCodeWords = morseCode.split(' ');
    const englishWords = morseCodeWords.map((word) => {
      const morseCodeLetters = word.split(' ');
      const englishLetters = morseCodeLetters.map((letter) => {
        for (const [key, value] of Object.entries(morseCodedata)) {
          if (value === letter) {
            return key;
          }
        }
        return '';
      });
      return englishLetters.join('');
    });
    return englishWords.join(' ');
  };

  //backspace
  const backspace = () => {
    if (message.length > 0) {
      const updatedMessage = message.slice(0, -1);
      setMessage(updatedMessage);
    }
  };

  //parse timestamp to a valid Date object
  const parseTimestamp = (timestamp) => {
    const [date, time] = timestamp.split(', ');
    const [day, month, year] = date.split('/');
    const [hours, minutes, seconds] = time.split(':');
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <Image
        source={require('../assets/bg.jpg')}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          opacity: 0.9,
        }}
      />
      <View style={{ flex: 1, height: '100%', width: '100%' }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 8 }}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                padding: 8,
                margin: 8,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 2,
                borderRadius: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  const translatedText = translateMorseToEnglish(msg.message);
                  setTranslation(translatedText);
                  Alert.alert('Translation message', translatedText);
                }}>
                <Text style={{ color: 'rgba(125, 125, 125, 0.9)' }}>
                  {msg.message}
                </Text>
                <Text style={{ color: 'rgba(125, 125, 125, 0.9)' }}>
                  {msg.address.town ? `${msg.address.town}` : null}
                  {msg.address.city ? `${msg.address.city}` : null}
                  {msg.address.state ? `${msg.address.state}` : null}
                </Text>
                <Text style={{ color: 'rgba(125, 125, 125, 0.9)' }}>
                  {msg.timestamp}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
          }}>
          <TextInput
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              fontSize: 20,
              fontWeight: 'bold',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'lightblue',
              margin: 8,
              width: '65%',
              color: 'white',
            }}
            placeholder="Enter code message"
            multiline={true}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={{
              width: '25%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: 8,
              fontSize: 20,
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
            onPress={postMessage}>
            <Text style={{ color: 'white', fontSize: 20 }}>✎Send</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: 8,
          }}>
          <TouchableOpacity
            style={{
              width: '20%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: 8,
              fontSize: 20,
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
            onPress={() => setMessage(message + '.')}>
            <Text style={{ color: 'white', fontSize: 20 }}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '20%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: 8,
              fontSize: 20,
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
            onPress={() => setMessage(message + '-')}>
            <Text style={{ color: 'white', fontSize: 20 }}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '20%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: 8,
              fontSize: 20,
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
            onPress={() => setMessage(message + ' ')}>
            <Text style={{ color: 'white', fontSize: 20 }}>space</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '20%',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: 8,
              fontSize: 20,
              alignItems: 'center',
              borderWidth: 2,
              borderRadius: 10,
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
            onPress={backspace}>
            <Text style={{ color: 'white', fontSize: 20 }}>↼</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
