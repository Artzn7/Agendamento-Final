import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, Button, Alert, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonExcluir } from '../components/MyButton';

export function DelRoomScreen() {
  const [roomList, setRoomList] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // Carregar a lista de salas ao montar o componente
    loadRoomList();
  }, []);

  const loadRoomList = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.72.2.149:3000/sala');
      if (!response.ok) {
        throw new Error(`Erro ao buscar salas: ${response.status}`);
      }
      const data = await response.json();
      setRoomList(data);
    } catch (error) {
      console.error('Erro ao carregar lista de salas:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar a lista de salas. Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRooms = async () => {
    try {
      if (selectedRooms.length === 0) {
        Alert.alert('Aviso', 'Por favor, selecione pelo menos uma sala para excluir.');
        return;
      }

      await Promise.all(selectedRooms.map(async (roomId) => {
        const response = await fetch(`http://10.72.2.149:3000/sala/${roomId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`Erro ao excluir sala ${roomId}: ${response.status}`);
        }
      }));

      Alert.alert('Sucesso', 'Salas excluídas com sucesso');
      // Recarregar a lista de salas após a exclusão
      loadRoomList();
      setSelectedRooms([]);
    } catch (error) {
      console.error('Erro ao excluir salas:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao excluir as salas. Por favor, tente novamente mais tarde.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.buttonContainer}>
      <Button
        title={item.name}
        onPress={() => toggleRoomSelection(item.id)}
        color={selectedRooms.includes(item.id) ? '#fa0707' : '#fff'}
      />
    </View>
  );

  const toggleRoomSelection = (roomId) => {
    const isSelected = selectedRooms.includes(roomId);
    if (isSelected) {
      setSelectedRooms(selectedRooms.filter(id => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  return (
    
    
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={roomList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
      {selectedRooms.length > 0 && (
        <View style={styles.button}>
          <ButtonExcluir title="Excluir Selecionadas" onPress={handleDeleteRooms} />
        </View>
      )}
    </View>
    
  );
}

const styles = StyleSheet.create({
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
