import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { ButtonAdd } from '../components/MyButton';

export function AddRoomScreen() {
  const [roomName, setRoomName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');

  const navigation = useNavigation();

  const handleAddRoom = async () => {
    try {
      // Verifique se os campos foram preenchidos
      if (!roomName.trim() || !roomNumber.trim()) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }

      // Construa o objeto de sala com os detalhes inseridos pelo usuário
      const newRoom = {
        name: roomName,
        numeroDaSala: roomNumber
      };

      // Envie a solicitação POST para adicionar a nova sala ao backend
      const response = await fetch('http://10.72.2.149:3000/sala', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRoom)
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar sala: ${response.status}`);
      }

      // Exiba uma mensagem de sucesso
      Alert.alert('Sucesso', 'Sala adicionada com sucesso');

      // Redirecionar de volta para a tela de administração
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar sala:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar a sala. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>
      <TextInput
        style={styles.input2}
        placeholder="Nome da Sala"
        onChangeText={text => setRoomName(text)}
        value={roomName}
      />
      <TextInput
        style={styles.input2}
        placeholder="Número da Sala"
        onChangeText={text => setRoomNumber(text)}
        value={roomNumber}
      />
      <ButtonAdd
        title="Adicionar Sala"
        onPress={handleAddRoom}
      />
    </View>
  );
}
