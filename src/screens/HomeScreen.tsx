import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity, Modal, Alert, Animated } from 'react-native';
import { firestore } from '../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { getAuth } from 'firebase/auth';

const icons = [
  require('../assets/icons/icon1.png'),
  require('../assets/icons/icon2.png'),
  require('../assets/icons/icon3.png'),
  require('../assets/icons/icon4.png'),
  require('../assets/icons/icon5.png'),
  require('../assets/icons/icon6.png'),
];

type Donation = {
  id: string;
  name: string;
  location: string;
  type: string;
  uid: string;
  iconIndex?: number;
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
  const filterModalAnimation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    const unsubscribeDonations = onSnapshot(collection(firestore, 'socialActions'), (snapshot) => {
      const donationsList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.title || 'Anônimo',
          location: data.location || 'Localização não especificada',
          type: Object.keys(data.categories || {}).filter((key) => data.categories[key]).join(', '),
          uid: data.uid || '',
          iconIndex: data.iconIndex ?? 0,
        };
      });
      setDonations(donationsList);
      setFilteredDonations(donationsList);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDonations();
    };
  }, []);

  const toggleFilterModal = () => {
    setIsFilterModalVisible(!isFilterModalVisible);
    Animated.timing(filterModalAnimation, {
      toValue: isFilterModalVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

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
        Alert.alert('Erro', 'Não foi possível excluir a doação. Tente novamente.');
      }
    }
  };

  const renderDonationItem = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      <Image source={icons[item.iconIndex ?? 0]} style={styles.profileImage} />
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.type}>{item.type}</Text>
        </View>
        <TouchableOpacity onPress={() => openDetailModal(item)}>
          <Ionicons name="chevron-down" size={28} color="#5f48bf" style={styles.expandIcon} />
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

      {/* Filtro Modal */}
      <Modal visible={isFilterModalVisible} transparent={true} animationType="fade">
        <Animated.View style={[styles.modalContainer, { opacity: filterModalAnimation }]}>
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
        </Animated.View>
      </Modal>

      {/* Detalhes Modal */}
      <Modal visible={isDetailModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.detailModalContainer}>
          {selectedDonation && (
            <>
              <Image source={icons[selectedDonation.iconIndex ?? 0]} style={styles.detailImage} />
              <Text style={styles.detailName}>{selectedDonation.name}</Text>
              <Text style={styles.detailLocation}>{selectedDonation.location}</Text>
              <Text style={styles.detailType}>Categorias: {selectedDonation.type}</Text>

              {selectedDonation.uid && currentUser?.uid && selectedDonation.uid === currentUser.uid && (
                <TouchableOpacity style={styles.deleteButton} onPress={deleteDonation}>
                  <Text style={styles.deleteButtonText}>Excluir Doação</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.closeButton} onPress={closeDetailModal}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5f48bf',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    fontWeight: 'bold',
    color: '#5f48bf',
    marginTop: 2,
  },
  expandIcon: {
    marginLeft: 10,
    transform: [{ translateY: -1 }], // Ajuste sutil na posição vertical
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  
  filterButton: {
    backgroundColor: '#7e60bf',
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
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
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#f2eff9',
  },
  detailImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#7e60bf',
  },
  detailName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5f48bf',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailLocation: {
    fontSize: 18,
    color: '#7a7a7a',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  detailType: {
    fontSize: 18,
    color: '#5f48bf',
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '70%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    backgroundColor: '#7e60bf',
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
