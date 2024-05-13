import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, Button, Alert, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { ButtonExcluir } from '../components/MyButton';

export function DelEquiScreen() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // Carregar a lista de equipamentos ao montar o componente
    loadEquipmentList();
  }, []);

  const loadEquipmentList = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.72.2.149:3000/aparelhos');
      if (!response.ok) {
        throw new Error(`Erro ao buscar equipamentos: ${response.status}`);
      }
      const data = await response.json();
      setEquipmentList(data);
    } catch (error) {
      console.error('Erro ao carregar lista de equipamentos:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar a lista de equipamentos. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipments = async () => {
    try {
      if (selectedEquipments.length === 0) {
        Alert.alert('Aviso', 'Por favor, selecione pelo menos um equipamento para excluir.');
        return;
      }

      await Promise.all(selectedEquipments.map(async (equipmentId) => {
        const response = await fetch(`http://10.72.2.149:3000/aparelhos/${equipmentId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Erro ao excluir equipamento ${equipmentId}: ${response.status}`);
        }
      }));

      Alert.alert('Sucesso', 'Equipamentos excluídos com sucesso');
      // Recarregar a lista de equipamentos após a exclusão
      loadEquipmentList();
      setSelectedEquipments([]);
    } catch (error) {
      console.error('Erro ao excluir equipamentos:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao excluir os equipamentos. Por favor, tente novamente mais tarde.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles1.buttonContainer}>
      <Button
        title={item.name}
        onPress={() => toggleEquipmentSelection(item.id)}
        color={selectedEquipments.includes(item.id) ? '#fa0707' : '#fff'}
      />
    </View>
  );
  

  const toggleEquipmentSelection = (equipmentId) => {
    const isSelected = selectedEquipments.includes(equipmentId);
    if (isSelected) {
      setSelectedEquipments(selectedEquipments.filter(id => id !== equipmentId));
    } else {
      setSelectedEquipments([...selectedEquipments, equipmentId]);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={equipmentList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
      {selectedEquipments.length > 0 && (
        <View style={styles1.button}>
          <ButtonExcluir title="Excluir Selecionados" onPress={handleDeleteEquipments} />
        </View>
      )}
    </View>
  );
}

const styles1 = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: '#1d376c',
    padding: 13,
  },
  button: {
    justifyContent: 'center',
    marginVertical: 5,
    marginBottom: 25,
    padding: 25,
  }
});
