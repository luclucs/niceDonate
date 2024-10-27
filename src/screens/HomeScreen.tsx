import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { firestore } from '../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { getAuth } from 'firebase/auth';

type Donation = {
  id: string;
  name: string;
  location: string;
  type: string;
  uid: string;
  image?: string;
};

const HomeScreen = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    brinquedos: false,
    alimentos: false,
    roupas: false,
    moveis: false,
    outros: false,
  });
  const [currentUser, setCurrentUser] = useState(getAuth().currentUser);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    const unsubscribeDonations = onSnapshot(collection(firestore, 'socialActions'), (snapshot) => {
      const donationsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().title || 'Anônimo',
        location: doc.data().location || 'Localização não especificada',
        type: Object.keys(doc.data().categories).filter((key) => doc.data().categories[key]).join(', '),
        uid: doc.data().uid,
        image: doc.data().image || 'https://example.com/default-profile.jpg',
      }));
      setDonations(donationsList);
      setFilteredDonations(donationsList);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDonations();
    };
  }, []);

  const toggleFilterModal = () => setIsFilterModalVisible(!isFilterModalVisible);

  const applyFilter = () => {
    const selectedKeys = Object.keys(selectedCategories).filter((key) => selectedCategories[key]);
    setFilteredDonations(
      selectedKeys.length > 0
        ? donations.filter((donation) => selectedKeys.some((key) => donation.type.includes(key)))
        : donations
    );
    toggleFilterModal();
  };

  const toggleCategory = (category: string) =>
    setSelectedCategories((prev) => ({ ...prev, [category]: !prev[category] }));

  const openDetailModal = (donation: Donation) => {
    setSelectedDonation(donation);
    console.log('Current User UID:', currentUser?.uid);
    console.log('Selected Donation UID:', donation.uid);
    setIsDetailModalVisible(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedDonation(null);
  };

  const deleteDonation = async () => {
    if (selectedDonation) {
      try {
        await deleteDoc(doc(firestore, 'socialActions', selectedDonation.id));
        Alert.alert('Sucesso', 'Doação excluída com sucesso.');
        setFilteredDonations((prev) => prev.filter((item) => item.id !== selectedDonation.id));
        closeDetailModal();
      } catch (error) {
        console.error('Erro ao excluir doação:', error);
        Alert.alert('Erro', 'Não foi possível excluir a doação. Tente novamente.');
      }
    }
  };

  const renderDonationItem = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.profileImage} />
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>
        <TouchableOpacity onPress={() => openDetailModal(item)}>
          <Ionicons name="expand" size={24} color="#5f48bf" style={styles.expandIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>O que está acontecendo hoje?</Text>
      <FlatList
        data={filteredDonations}
        renderItem={renderDonationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
        <Text style={styles.filterButtonText}>Filtrar</Text>
      </TouchableOpacity>

      {/* Modal de Filtro */}
      <Modal visible={isFilterModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.filterContent}>
            <Text style={styles.modalTitle}>Selecione entre</Text>
            <View style={styles.categoriesContainer}>
              {Object.keys(selectedCategories).map((category) => (
                <TouchableOpacity key={category} style={styles.checkboxWrapper} onPress={() => toggleCategory(category)}>
                  <Checkbox
                    status={selectedCategories[category] ? 'checked' : 'unchecked'}
                    color="#5f48bf"
                    uncheckedColor="#7e60bf"
                  />
                  <Text style={styles.checkboxLabel}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
              <Text style={styles.applyButtonText}>Aplicar filtro</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes (tela cheia) */}
      <Modal visible={isDetailModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.detailModalContainer}>
          {selectedDonation && (
            <>
              <Image source={{ uri: selectedDonation.image }} style={styles.detailImage} />
              <Text style={styles.detailName}>{selectedDonation.name}</Text>
              <Text style={styles.detailLocation}>{selectedDonation.location}</Text>
              <Text style={styles.detailType}>Categorias: {selectedDonation.type}</Text>
              {selectedDonation.uid === currentUser?.uid && (
                <TouchableOpacity style={styles.deleteButton} onPress={deleteDonation}>
                  <Text style={styles.deleteButtonText}>Excluir Doação</Text>
                </TouchableOpacity>
              )}
              <Button title="Fechar" onPress={closeDetailModal} color="#7e60bf" />
            </>
          )}
        </SafeAreaView>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  expandIcon: {
    marginLeft: 10,
  },
  filterButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#7e60bf',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5f48bf',
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#5f48bf',
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: '#7e60bf',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailModalContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#f2eff9',
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5f48bf',
    marginBottom: 10,
  },
  detailLocation: {
    fontSize: 18,
    color: '#777',
    marginBottom: 10,
  },
  detailType: {
    fontSize: 18,
    color: '#5f48bf',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;