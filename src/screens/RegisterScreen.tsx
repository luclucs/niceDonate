import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    // Limpeza de mensagens de erro anteriores
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.replace('Home');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Ocorreu um erro desconhecido');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Preencha o cadastro :)</Text>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
        accessibilityLabel="Nome completo"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Endereço de email"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        accessibilityLabel="Senha"
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        accessibilityLabel="Registrar nova conta"
      >
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Já tem uma conta?{' '}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
          accessibilityLabel="Ir para tela de login"
        >
          Voltar para login
        </Text>
      </Text>
    </SafeAreaView>
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
    marginBottom: 20,
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
  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  loginLink: {
    color: '#5f48bf',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});