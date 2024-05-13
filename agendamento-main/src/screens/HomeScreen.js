import React from "react";
import { View } from "react-native";
import { MyButton } from "../components/MyButton";
import {styles} from './styles';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/Auth";

export function HomeScreen(){
  const {signOut} = useAuth();
  const navigation = useNavigation();
        return (
          <View style={styles.container}>
              
            <MyButton onPress={() => navigation.navigate('Salas Disponiveis')} 
          title="Marcar Sala" />
            <MyButton onPress={() => navigation.navigate('Equipamentos')} 
            title="Marcar Equipamentos"/>
            <MyButton onPress={() => navigation.navigate('Reservas')} 
            title="Ver Reservas"/>
             <MyButton onPress={signOut} style={{backgroundColor: 'red'}} 
            title="Sair do App" />
             

          </View>
        );
};
