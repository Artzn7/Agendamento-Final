import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {HomeScreen} from '../screens/HomeScreen';
import { Equipament } from '../screens/Equipament';
import { ToMarkScreen } from '../screens/ToMarkScreen';
import { DatePicker } from '../screens/DatePicker';
import ReservasUsuario from '../screens/ReservasUsuario';

export interface AppParamList {
  Home: undefined;
  AulaMarcada: undefined;
  SalasDisponiveis: { id: string };
}

const Stack = createNativeStackNavigator();

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Equipamentos" component={Equipament} />
      <Stack.Screen name="Salas Disponiveis" component={ToMarkScreen} />
      <Stack.Screen name="DatePicker" component={DatePicker} />
      <Stack.Screen name="Reservas" component={ReservasUsuario} />
    </Stack.Navigator>
  );
}
