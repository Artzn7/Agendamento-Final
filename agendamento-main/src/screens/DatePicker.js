import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ButtonAula } from '../components/MyButton';

const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [message, setMessage] = useState('');
  const [reservedTimes, setReservedTimes] = useState([]);
  const [name, setName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHours, setSelectedHours] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params; // Recebendo o ID da sala selecionada

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://10.72.2.149:3000/reservada');
        const data = await response.json();
        setReservedTimes(data);
      } catch (error) {
        console.error('Erro ao buscar reservas:', error);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    updateAvailableHours();
  }, [selectedDate, reservedTimes]);

  const updateAvailableHours = () => {
    const available = Array.from({ length: 17 }, (_, index) => index + 6);
    const reservedHours = reservedTimes
      .filter(reservation => {
        const reservationDate = new Date(reservation.dateTime);
        return reservationDate.toDateString() === selectedDate.toDateString() && reservation.id === id; // Filtrando as reservas pelo ID da sala selecionada
      })
      .map(reservation => new Date(reservation.dateTime).getHours());
    const filteredHours = available.filter(hour => !reservedHours.includes(hour));
    setAvailableHours(filteredHours);
  };

  const isTimeReserved = (hour) => {
    const lastReservationTime = reservedTimes
      .filter(reservation => {
        const reservationDate = new Date(reservation.dateTime);
        return reservationDate.toDateString() === selectedDate.toDateString() && reservation.id === id; // Filtrando as reservas pelo ID da sala selecionada
      })
      .reduce((latestTime, reservation) => {
        const reservationDateTime = new Date(reservation.dateTime);
        return reservationDateTime.getHours() > latestTime ? reservationDateTime.getHours() : latestTime;
      }, 0);

    return hour <= lastReservationTime;
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const handleHourSelection = (hour) => {
    if (availableHours.includes(hour)) {
      if (!selectedStartTime) {
        setSelectedStartTime(hour);
        setSelectedEndTime(null);
        setSelectedHours([hour]);
      } else {
        if (selectedStartTime === hour && selectedEndTime === hour) {
          setSelectedStartTime(null);
          setSelectedEndTime(null);
          setSelectedHours([]);
        } else if (selectedStartTime === hour) {
          setSelectedStartTime(null);
          setSelectedHours([]);
        } else if (selectedEndTime === hour) {
          setSelectedEndTime(null);
          setSelectedHours([]);
        } else if (!selectedStartTime) {
          setSelectedStartTime(hour);
          setSelectedEndTime(hour);
          setSelectedHours([hour]);
        } else {
          setSelectedEndTime(hour);
          setSelectedHours([selectedStartTime, hour]);
        }
      }
    } else {
      setMessage('Hora já marcada. Por favor, escolha outro horário.');
      setModalVisible(true);
    }
  };

  const handleReserva = async () => {
    if (!name || !selectedDate || !selectedStartTime || !selectedEndTime) {
      setMessage('Por favor, preencha todos os campos.');
      setModalVisible(true);
      return;
    }

    if (selectedEndTime <= selectedStartTime) {
      setMessage('A hora de término deve ser posterior à hora de início.');
      setModalVisible(true);
      return;
    }

    const reservationsToMake = [];
    for (let i = selectedStartTime; i <= selectedEndTime; i++) {
      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(i);
      startDateTime.setMinutes(0);
      reservationsToMake.push(startDateTime);
    }

    try {
      const isAnyTimeAlreadyReserved = reservationsToMake.some(startDateTime => {
        return reservedTimes.some(reservation => {
          const reservationDateTime = new Date(reservation.dateTime);
          return (
            reservationDateTime.getTime() === startDateTime.getTime() && reservation.id === id
          );
        });
      });

      if (isAnyTimeAlreadyReserved) {
        setMessage('A hora selecionada já está reservada. Por favor, escolha outro horário.');
        setModalVisible(true);
        return;
      }

      const reservationPromises = reservationsToMake.map(startDateTime =>
        fetch('http://10.72.2.149:3000/reservada', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, dateTime: startDateTime.toISOString(), name: name.toLowerCase() }),
        })
      );

      const responses = await Promise.all(reservationPromises);

      if (responses.every(response => response.ok)) {
        setMessage('Reserva realizada com sucesso!');
        const newReservations = reservationsToMake.map(startDateTime => ({ dateTime: startDateTime.toISOString(), id }));
        setReservedTimes([...reservedTimes, ...newReservations]);
        setSelectedStartTime(null);
        setSelectedEndTime(null);
        setName('');
        setSelectedHour(null);
        setSelectedHours([]);
        updateAvailableHours();
      } else {
        setMessage('Erro ao fazer reserva.');
      }
    } catch (error) {
      setMessage('Erro ao fazer reserva.');
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nome do Solicitante:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
      />

      <Text style={styles.title}>Data da Reserva:</Text>
      <View>
      <TextInput
        style={styles.input}
        value={selectedDate.toLocaleDateString('pt-BR')}
        editable={false}
      />

        <ButtonAula title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
      </View>
      {showDatePicker && (
        <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        locale="pt-BR"
        onChange={handleDateChange}
      />      
      )}

      <View style={styles.availableHoursContainer}>
        <Text style={styles.title}>Horas Disponíveis:</Text>
        {chunkArray(availableHours, 6).map((chunk, index) => (
          <View key={index} style={styles.hourGroup}>
            {chunk.map((hour, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.availableHour,
                  {
                    backgroundColor: isTimeReserved(hour) ? 'red' : (selectedStartTime === hour || selectedEndTime === hour ? '#086e04' : 'white'),
                    borderColor: selectedHours.includes(hour) ? 'black' : 'black',
                    borderWidth: selectedHours.includes(hour) ? 0 : 0,
                  }
                ]}
                onPress={() => handleHourSelection(hour)}
              >
                <Text>{hour}:00</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <ButtonAula title="Reservar Sala" onPress={handleReserva} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{message}</Text>
            <ButtonAula title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 7,
    borderColor: '#fff',
    textAlign: 'center',
    gap: 15,
    backgroundColor: '#fff'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: '#000'
  },
  input: {
    borderRadius: 5,
    paddingHorizontal: 15,
    color: '#000',
    height: 50,
    marginBottom: 10,
    fontSize: 20,
    backgroundColor: '#fff',
    margin: 5,
    borderColor: '#000',
    borderWidth: 2
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 45,
    borderRadius: 10,
    alignItems: 'center',
    gap: 35
  },
  modalMessage: {
    fontSize: 20,
  },
  availableHoursContainer: {
    alignItems: 'center',
    gap: 10,
  },
  availableHour: {
    padding: 10,
    marginRight: 3,
    marginLeft: 3,
    borderRadius: 5,
  },
  hourGroup: {
    flexDirection: 'row',
    marginBottom: 2,
  },
});

export default DatePicker;
