import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { firestore } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

type FinalizeDonationScreenRouteProp = RouteProp<RootStackParamList, 'FinalizeDonation'>;
type FinalizeDonationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FinalizeDonation'>;

const FinalizeDonationScreen = () => {
  const route = useRoute<FinalizeDonationScreenRouteProp>();
  const navigation = useNavigation<FinalizeDonationScreenNavigationProp>();
  const { selectedCategories } = route.params;
6
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    try {
      await addDoc(collection(firestore, 'socialActions'), {
        title,
        description,
        location,
        categories: selectedCategories,
        createdAt: new Date(),
      });
      Alert.alert('Sucesso', 'Ação social cadastrada com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao cadastrar ação social:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar a ação social. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Detalhe a sua contribuição</Text>
          <View style={styles.form}>
            <TextInput
              placeholder="Dê um título para sua ação social"
              placeholderTextColor="#666"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Descreva o evento"
              placeholderTextColor="#666"
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              placeholder="Onde está acontecendo?"
              placeholderTextColor="#666"
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />
            <Text style={styles.subtitle}>Objetos a serem doados nesta ação:</Text>
            {Object.entries(selectedCategories).map(
              ([category, isSelected]) =>
                isSelected && <Text key={category} style={styles.category}>{category}</Text>
            )}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2eff9',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5f48bf',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d7ceeb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5f48bf',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  category: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#7e60bf',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FinalizeDonationScreen;