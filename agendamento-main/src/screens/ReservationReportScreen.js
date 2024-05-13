import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ButtonAdd, MyButton } from '../components/MyButton';

export function ReservationReportScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://10.72.2.149:3000/sala');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleSearchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://10.72.2.149:3000/reservada?idSala=${selectedRoomId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar reservas');
      }
      
      const data = await response.json();
      data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      setReservations(data);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const findRoomNameById = (roomId) => {
    const room = rooms.find(room => room.id === roomId);
    return room ? room.name : 'Sala não encontrada';
  };

  const renderReservations = () => {
    const reservationsByDay = {};
    reservations.forEach(reservation => {
      const date = new Date(reservation.dateTime).toLocaleDateString();
      if (!reservationsByDay[date]) {
        reservationsByDay[date] = [];
      }
      reservationsByDay[date].push(reservation);
    });

    if (Object.keys(reservationsByDay).length === 0) {
      return <Text style={styles.noReservationsText}>Nenhuma reserva encontrada</Text>;
    }

    return (
      <View style={styles.reservationsContainer}>
        {Object.entries(reservationsByDay).map(([date, reservations], index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayHeading}>{date}</Text>
            {reservations.map((reservation, index) => (
              <View key={index} style={styles.reservationContainer}>
                <Text style={styles.reservationText}>Sala: {findRoomNameById(reservation.id)}</Text>
                <Text style={styles.reservationText}>Usuário: {reservation.name}</Text>
                <Text style={styles.reservationText}>Data e Hora: {new Date(reservation.dateTime).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <MyButton title="Buscar Reservas" onPress={handleSearchReservations} />
          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : (
            renderReservations()
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 30
  },
  reservationsContainer: {
    marginTop: 15,
  },
  dayContainer: {
    marginBottom: 15,
  },
  dayHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reservationContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 2
  },
  reservationText: {
    fontSize: 17,
    margin: 3
  },
  noReservationsText: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 15
  },
  loadingText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 0,
    justifyContent: 'center',
  },
});
