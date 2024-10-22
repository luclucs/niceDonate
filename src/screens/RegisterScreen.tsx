import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Importe corretamente os tipos
import { auth } from '../firebaseConfig'; // Importe a instância de autenticação do Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importe a função para criar o usuário

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password); // Usar a função corretamente
      alert('Usuário registrado com sucesso!');
      navigation.navigate('Home'); // Após registro, redirecionar para a Home
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preencha o cadastro :)</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backToLoginText}>Já tem uma conta? Voltar para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f2eff9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#5f48bf',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d7ceeb',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#7e60bf',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginText: {
    textAlign: 'center',
    color: '#5f48bf',
    fontWeight: 'bold',
  },
});