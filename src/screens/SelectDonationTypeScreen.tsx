import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Category } from '../types';
import Ionicons from '@expo/vector-icons/Ionicons';

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
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Ajude alguém hoje ;)</Text>
        <View style={styles.card}>
          <Text style={styles.subtitle}>Doar</Text>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxRow}>
              {Object.keys(selectedCategories).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.checkboxWrapper,
                    selectedCategories[category as Category] && styles.checkboxSelected,
                  ]}
                  onPress={() => toggleCategory(category as Category)}
                >
                  <Checkbox
                    status={selectedCategories[category as Category] ? 'checked' : 'unchecked'}
                    color="#7e60bf"
                    uncheckedColor="#7e60bf"
                  />
                  <Text style={styles.checkboxLabel}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Ionicons name="arrow-forward-circle" size={60} color="#5f48bf" />
        </TouchableOpacity>
        <Image source={swingImage} style={styles.image} resizeMode="contain" />
      </View>
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
    alignItems: 'center',
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
    marginBottom: 20,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 5,
    width: '100%',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7e60bf',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    width: 140,
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#5f48bf',
    marginLeft: 8,
  },
  checkboxSelected: {
    backgroundColor: '#e0d4f7',
    borderColor: '#5f48bf',
  },
  nextButton: {
    marginTop: 16,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#e0d4f7',
    borderRadius: 50,
    padding: 12,
  },
  image: {
    width: '90%', 
    maxHeight: 200, 
    aspectRatio: 1, 
    resizeMode: 'contain', 
    marginTop: 0,
  },
});

export default SelectDonationTypeScreen;