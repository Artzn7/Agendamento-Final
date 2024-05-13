import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { Registro } from '../service/regisService';
import { authService } from '../service/authService';

interface AuthData {
  isAdmin: boolean;
  id: string;
  token: string;
  email: string;
  name: string;
}

interface AuthContextData {
  authData?: AuthData;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  register: (nome: string, email: string, senha: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const _authData: AuthData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const authData = await authService.signIn(email, password);
      setAuthData(authData);
      AsyncStorage.setItem('@AuthData', JSON.stringify(authData));
    } catch (error) {
      Alert.alert('Erro de Autenticação', error.message);
    }
  }

  async function signOut() {
    setAuthData(undefined);
    AsyncStorage.removeItem('@AuthData');
  }

  async function register(nome: string, email: string, senha: string) {
    try {
      // Validação do formato do e-mail
      if (!validateEmail(email)) {
        Alert.alert('E-mail Inválido', 'Insira um endereço de e-mail válido');
        return;
      }

      // Validação do comprimento mínimo da senha e presença de pelo menos um caractere numérico
      if (senha.length < 6 || !/\d/.test(senha) || /[^\x00-\x7F]/.test(senha)) {
        Alert.alert('Senha Inválida', 'A senha deve ter no mínimo 6 caracteres e conter apenas caracteres ASCII');
        return;
      }

      const authData = await Registro.register(nome, email, senha);
      setAuthData(authData);

      await AsyncStorage.setItem('@AuthData', JSON.stringify(authData));
    } catch (error) {
      Alert.alert('Erro de Registro', error.message);
    }
  }

  // Função para validar o formato do e-mail
  function validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && !/[^\x00-\x7F]/.test(email);
  }

  return (
    <AuthContext.Provider value={{ authData, signIn, signOut, loading: isLoading, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}
