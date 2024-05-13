import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { ButtonM } from '../components/MyButton'; // Importe o componente Button necessário
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';

export function Equipament() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    setIsLoading(true);

    //Senac: 10.72.2.149
    //Casa: 26.171.29.253

    fetch('http://10.72.2.149:3000/aparelhos')
      .then(response => response.json())
      .then(data => {
        setLocations(data);
        setIsLoading(false);
      })
      .catch(error => console.error(error)); // Trata erros da requisição
  }, []);

  return (
    <SafeAreaView>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.container2}>
          {locations.map(location => (
            <ButtonM
              onPress={() => navigation.navigate('DatePicker', { id: location.id })} // Passe o ID para a tela de DatePicker
              key={location.id}
              title={location.name}
            />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}