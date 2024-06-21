import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

import MorseCodePattern from './components/MorseCodePattern';
import Convert from './components/Convert'; 
import MessageBoard from './components/MessageBoard';
import ImageToText from './components/ImageToText'

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: 'lightblue' },
          }}>
          <Tab.Screen
            name="Morse Code Pattern"
            component={MorseCodePattern}
            options={{
              tabBarIcon: () => (
                <Ionicons name="school-outline" size={30} color="black" />
              ),
              tabBarActiveTintColor: 'blue',
            }}
          />
          <Tab.Screen
            name="Convert"
            component={Convert}
            options={{
              tabBarIcon: () => (
                <Ionicons name="school" size={30} color="black" />
              ),
              tabBarActiveTintColor: 'blue',
            }}
          />
           <Tab.Screen
            name="Image"
            component={ImageToText}
            options={{
              tabBarIcon: () => (
                <Ionicons name="school-outline" size={30} color="black" />
              ),
              tabBarActiveTintColor: 'blue',
            }}
          />
          <Tab.Screen
            name="Message Board"
            component={MessageBoard}
            options={{
              tabBarIcon: () => (
                <MaterialIcons name="wechat" size={30} color="black" />
              ),
              tabBarActiveTintColor: 'blue',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
