import React, { useState } from 'react';
import { View, Alert, Image } from 'react-native';
import { MyTextInput } from '../components/MyTextInput';
import { MyButton } from '../components/MyButton';
import { useAuth } from '../contexts/Auth';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

export function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async () => {
    try {
      // Verifica se o e-mail é o e-mail do administrador
      const isAdminEmail = email === 'admin@example.com'; // Substitua pelo e-mail do administrador
      await register(nome, email, senha, isAdminEmail); // Aguarde o registro
    } catch (error) {
      // Trate qualquer erro de registro exibindo um alerta
      Alert.alert('Erro de Registro', error.message);
    }
  };

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Image
        style={{ width: 300, height: 200 }}
        resizeMode="contain"
        source={require('../assets/logo.png')}
      />
      <MyTextInput placeholder="Nome" value={nome} onChangeText={setNome} />
      <MyTextInput placeholder="E-mail" value={email} onChangeText={setEmail} />
      <MyTextInput secureTextEntry placeholder="Senha" value={senha} onChangeText={setSenha} />
      <MyButton onPress={handleRegister} title="CADASTRAR" />
    </View>
  );
}