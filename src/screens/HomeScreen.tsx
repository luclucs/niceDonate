import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';

const donations = [
  {
    id: '1',
    name: 'Luc Lucs',
    location: 'Santa Cruz do Capibaribe',
    type: 'Roupas e Alimentos',
    image: 'https://example.com/profile1.jpg',
  },
  {
    id: '2',
    name: 'Luc Lucs',
    location: 'Santa Cruz do Capibaribe',
    type: 'Roupas e Alimentos',
    image: 'https://example.com/profile2.jpg',
  },
];

const HomeScreen = () => {
  const renderDonationItem = ({ item }: { item: { id: string; name: string; location: string; type: string; image: string } }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Doações Próximas</Text>
      <FlatList
        data={donations}
        renderItem={renderDonationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2eff9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5f48bf',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#777',
  },
  type: {
    fontSize: 14,
    color: '#5f48bf',
  },
});

export default HomeScreen;