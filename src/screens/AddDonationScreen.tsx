import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddDonationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cadastrar Ação Social</Text>
    </View>
  );
};

export default AddDonationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});