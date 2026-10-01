import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { BookCategory } from '../models/types';
import { BooksScreen } from '../screens/BooksScreen';
import { HomeScreen } from '../screens/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
  Books: { category: BookCategory };
};

export type BooksScreenRouteProp = RouteProp<RootStackParamList, 'Books'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Books" component={BooksScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
