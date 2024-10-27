import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Category } from '../types';
import Ionicons from '@expo/vector-icons/Ionicons';

// Importando o PNG corretamente
const swingImage = require('../assets/images/undraw_swing_jn5d.png');

type SelectDonationTypeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectDonationType'>;

const SelectDonationTypeScreen = () => {
  const [selectedCategories, setSelectedCategories] = useState<Record<Category, boolean>>({
    brinquedos: false,
    alimentos: false,
    roupas: false,
    moveis: false,
    outros: false,
  });

  const navigation = useNavigation<SelectDonationTypeScreenNavigationProp>();

  const toggleCategory = (category: Category) => {
    setSelectedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const handleNext = () => {
    navigation.navigate('FinalizeDonation', { selectedCategories });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Ajude alguém hoje ;)</Text>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Doar</Text>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxRow}>
              <TouchableOpacity style={styles.checkboxWrapper} onPress={() => toggleCategory('brinquedos')}>
                <Checkbox
                  status={selectedCategories.brinquedos ? 'checked' : 'unchecked'}
                  color="#7e60bf"
                  uncheckedColor="#7e60bf"
                />
                <Text style={styles.checkboxLabel}>Brinquedos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxWrapper} onPress={() => toggleCategory('alimentos')}>
                <Checkbox
                  status={selectedCategories.alimentos ? 'checked' : 'unchecked'}
                  color="#7e60bf"
                  uncheckedColor="#7e60bf"
                />
                <Text style={styles.checkboxLabel}>Alimentos</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity style={styles.checkboxWrapper} onPress={() => toggleCategory('roupas')}>
                <Checkbox
                  status={selectedCategories.roupas ? 'checked' : 'unchecked'}
                  color="#7e60bf"
                  uncheckedColor="#7e60bf"
                />
                <Text style={styles.checkboxLabel}>Roupas</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxWrapper} onPress={() => toggleCategory('moveis')}>
                <Checkbox
                  status={selectedCategories.moveis ? 'checked' : 'unchecked'}
                  color="#7e60bf"
                  uncheckedColor="#7e60bf"
                />
                <Text style={styles.checkboxLabel}>Móveis</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.checkboxRow}>
              <TouchableOpacity style={styles.checkboxWrapper} onPress={() => toggleCategory('outros')}>
                <Checkbox
                  status={selectedCategories.outros ? 'checked' : 'unchecked'}
                  color="#7e60bf"
                  uncheckedColor="#7e60bf"
                />
                <Text style={styles.checkboxLabel}>Outros</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Ionicons name="arrow-forward-circle" size={50} color="#7e60bf" />
          </TouchableOpacity>
        </View>
        {/* Exibindo a imagem PNG */}
        <Image source={swingImage} style={styles.image} resizeMode="contain" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2eff9',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center', // Centraliza os elementos no topo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#5f48bf',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: 'center',
    width: '100%',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5f48bf',
    marginBottom: 20,
    textAlign: 'center',
  },
  checkboxContainer: {
    marginVertical: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 5,
    width: '100%',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7e60bf',
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#5f48bf',
    marginLeft: 8,
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  image: {
    marginTop: 20,
    width: '100%',
    height: 300,
  },
});

export default SelectDonationTypeScreen;