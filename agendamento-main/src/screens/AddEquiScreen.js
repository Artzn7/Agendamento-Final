import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { ButtonAdd } from '../components/MyButton';

export function AddEquiScreen() {
  const [equipmentName, setEquipmentName] = useState('');

  const navigation = useNavigation();

  const handleAddEquipment = async () => {
    try {
      // Verifique se o campo do nome do equipamento foi preenchido
      if (!equipmentName.trim()) {
        Alert.alert('Erro', 'Por favor, insira o nome do equipamento');
        return;
      }

      // Envie a solicitação POST para adicionar o equipamento ao backend
      const response = await fetch('http://10.72.2.149:3000/aparelhos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: equipmentName
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao adicionar equipamento: ${response.status}`);
      }

      // Exiba uma mensagem de sucesso
      Alert.alert('Sucesso', 'Equipamento adicionado com sucesso');

      // Redirecionar de volta para a tela de administração
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar equipamento:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar o equipamento. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 25 }}>
      <TextInput
        style={styles.input2}
        placeholder="Nome do Equipamento"
        onChangeText={text => setEquipmentName(text)}
        value={equipmentName}
      />
      <ButtonAdd
        title="Adicionar Equipamento"
        onPress={handleAddEquipment}
      />
    </View>
  );
}
