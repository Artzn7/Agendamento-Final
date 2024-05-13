import React, { useState } from 'react';
import { View, TextInput, Button, Alert, FlatList, Text, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ButtonAdd, ButtonExcluir, MyButton } from '../components/MyButton';

export function DelReservationScreen() {
  const [userName, setUserName] = useState('');
  const [userReservations, setUserReservations] = useState([]);
  const [deleteReservationId, setDeleteReservationId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleSearchReservations = async () => {
    try {
      if (!userName.trim()) {
        Alert.alert('Erro', 'Por favor, insira o nome do usuário');
        return;
      }
      
      const formattedUserName = userName.toLowerCase();
      const response = await fetch(`http://10.72.2.149:3000/reservada?name=${formattedUserName}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar reservas: ${response.status}`);
      }
      const reservationsData = await response.json();
      setUserReservations(reservationsData);

      if (reservationsData.length === 0) {
        Alert.alert('Aviso', 'Não há reservas feitas pelo usuário buscado');
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar as reservas. Por favor, tente novamente mais tarde.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteReservationId) {
      return;
    }

    try {
      const response = await fetch(`http://10.72.2.149:3000/reservada/${deleteReservationId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir reserva: ${response.status}`);
      }

      Alert.alert('Sucesso', 'Reserva excluída com sucesso');

      setUserReservations(prevReservations => prevReservations.filter(reservation => reservation.id !== deleteReservationId));
      setDeleteReservationId(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao excluir a reserva. Por favor, tente novamente mais tarde.');
    }
  };

  const handleDeleteReservation = (reservationId) => {
    setDeleteReservationId(reservationId);
    setModalVisible(true);
  };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 25}}>
      <TextInput
        style={styles.input2}
        placeholder="Nome do Usuário"
        onChangeText={text => setUserName(text)}
        value={userName}
      />
      <MyButton
        title="Buscar Reservas"
        onPress={handleSearchReservations}
      />

      {userReservations.length > 0 ? (
        <FlatList
          data={userReservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reservationContainer}>
              <Text style={styles.reservationText}>Sala: {item.id}</Text>
              <Text style={styles.reservationText}>Data: {new Date(item.dateTime).toLocaleDateString()}</Text>
              <Text style={styles.reservationText}>Hora: {new Date(item.dateTime).toLocaleTimeString()}</Text>
              <ButtonExcluir title="Excluir" onPress={() => handleDeleteReservation(item.id)} />
            </View>
          )}
        />
      ) : null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>Deseja excluir esta reserva?</Text>
            <View style={styles.modalButtons}>
              <ButtonAdd title="Cancelar" onPress={() => setModalVisible(false)} />
              <ButtonExcluir title="Confirmar" onPress={handleConfirmDelete} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  reservationContainer: {
    backgroundColor: '#fff',
    gap: 7,
    padding: 20,
    marginBottom: 5,
    borderRadius: 5,
    marginTop: 7
  },
  reservationText: {
    fontSize: 17,
    marginBottom: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 20,
    marginBottom: 15,
    padding: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    gap: 5
  },
  input2: {
    borderRadius: 5,
    borderColor: '#000',
    paddingHorizontal: 8,
    color:'#000',
    borderWidth: 2,
    width: '70%',
    height: 50,
    marginBottom: 15,
},
});
