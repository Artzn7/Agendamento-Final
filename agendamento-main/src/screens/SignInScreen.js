import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { MyTextInput } from "../components/MyTextInput";
import {styles} from './styles';
import { ButtonRegis, MyButton } from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/Auth";

export function SignInScreen() {
  const {signIn} = useAuth()
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

        return (
          <View style={[styles.container, {justifyContent:'center', alignItems: 'center'}]}>
            <Image
              style={{width: 300, height: 200}}
              resizeMode="contain"
              source={require('../assets/logo.png')}
            />
            <MyTextInput placeholder="E-mail" value={email} onChangeText={setEmail} />
            <MyTextInput secureTextEntry placeholder="Senha" value={password} onChangeText={setPassword} />

            <MyButton onPress={() => signIn(email, password)}
            title="Entrar no App" />
            
            <ButtonRegis onPress={() => navigation.navigate('Register')}
            title="Registre-se" />

          </View>
        );
      }