import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const ReservasUsuario = ({ userId }) => {
  const [reservasUsuario, setReservasUsuario] = useState([]);

  useEffect(() => {
    const fetchReservasUsuario = async () => {
      try {
        const response = await fetch(`http://10.72.2.149:3000/reservada/${userId}`);
        const data = await response.json();
        setReservasUsuario(data);
      } catch (error) {
      }
    };

    fetchReservasUsuario();
  }, [userId]);

  const formatarDataHora = (dataHora) => {
    const data = new Date(dataHora);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minutos}`; // Dia, mês, ano, hora e minutos
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {reservasUsuario
          .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime)) // Ordenar por hora
          .map(reserva => (
            <View key={reserva.dateTime} style={styles.reservaContainer}>
              <Text style={styles.text1}>Data: {formatarDataHora(reserva.dateTime)}</Text>
              <Text style={styles.text1}>Nome da Sala: {reserva.id}</Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const App = () => {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Simulando um login bem-sucedido e obtendo o ID do usuário
    const fetchUserId = async () => {
      try {
        const response = await fetch('http://10.72.2.149:3000/usuario'); // Endpoint para obter dados do usuário
        const data = await response.json();
        if (data && data.length > 0) {
          setUserId(data[0].id); // Supondo que o primeiro usuário retornado é o usuário atualmente logado
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <View style={styles.container}>
      <ReservasUsuario userId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reservaContainer: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 25,
    marginBottom: 10,
  },
  text1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
