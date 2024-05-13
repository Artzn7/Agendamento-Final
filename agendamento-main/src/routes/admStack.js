import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';


import { AdminScreen } from '../screens/AdminScreen';
import { AddRoomScreen } from '../screens/AddRoomScreen';
import { DelRoomScreen } from '../screens/DelRoomScreen';
import { AddEquiScreen } from '../screens/AddEquiScreen';
import { DelEquiScreen } from '../screens/DelEquiScreen';
import { DelReservationScreen } from '../screens/DelReservationScreen';
import { ReservationReportScreen } from '../screens/ReservationReportScreen';



const Stack = createNativeStackNavigator();

export function AdmStack() {
    return (
        <Stack.Navigator>
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="Adicionar Sala" component={AddRoomScreen} />
          <Stack.Screen name="Excluir Sala" component={DelRoomScreen} />
          <Stack.Screen name="Adicionar Equipamento" component={AddEquiScreen} />
          <Stack.Screen name="Excluir Equipamento" component={DelEquiScreen} />
          <Stack.Screen name="Excluir Reserva" component={DelReservationScreen} />
          <Stack.Screen name="Relatorio de Reservas" component={ReservationReportScreen} />
        </Stack.Navigator>
      );
}
