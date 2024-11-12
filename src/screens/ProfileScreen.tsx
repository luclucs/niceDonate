import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { getFirestore, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

const icons = [
  require('../assets/icons/icon1.png'),
  require('../assets/icons/icon2.png'),
  require('../assets/icons/icon3.png'),
  require('../assets/icons/icon4.png'),
  require('../assets/icons/icon5.png'),
  require('../assets/icons/icon6.png'),
];

export default function ProfileScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const db = getFirestore();

  const [selectedIconIndex, setSelectedIconIndex] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>('Usuário');

  useEffect(() => {
    const fetchUserIcon = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setSelectedIconIndex(data.iconIndex ?? 0);
        } else {
          await setDoc(userDocRef, { iconIndex: 0 });
          setSelectedIconIndex(0);
        }

        // Extrair o primeiro nome do e-mail
        if (user.email) {
          const name = user.email.split('@')[0];
          setFirstName(name.charAt(0).toUpperCase() + name.slice(1));
        }
      }
    };

    fetchUserIcon();
  }, [user]);

  const handleSignOut = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.navigate('Login');
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível sair da conta. Tente novamente.');
          }
        },
      },
    ]);
  };

  const selectIcon = async (index: number) => {
    try {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { iconIndex: index });
        setSelectedIconIndex(index);
      }
    } catch (error) {
      console.error("Erro ao salvar o ícone: ", error);
      Alert.alert('Erro', 'Não foi possível salvar o ícone. Tente novamente.');
    }
  };

  const handlePasswordChange = () => {
    navigation.navigate('ForgotPassword'); // Navegar para a tela de recuperação de senha
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      
      <Image source={icons[selectedIconIndex]} style={styles.profileImage} />
      <Text style={styles.firstName}>{firstName}</Text>

      <Text style={styles.selectText}>Escolha seu ícone:</Text>
      <View style={styles.iconContainer}>
        {icons.map((icon, index) => (
          <TouchableOpacity key={index} onPress={() => selectIcon(index)}>
            <Image
              source={icon}
              style={[
                styles.icon,
                selectedIconIndex === index && styles.selectedIconBorder,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.email}>{user?.email || 'Usuário não logado'}</Text>
      </View>

      <TouchableOpacity style={styles.changePasswordButton} onPress={handlePasswordChange}>
        <Text style={styles.changePasswordText}>Altere sua senha</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2eff9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7e60bf',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  firstName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7e60bf',
    marginBottom: 20,
  },
  selectText: {
    fontSize: 16,
    color: '#7e60bf',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedIconBorder: {
    borderWidth: 2,
    borderColor: '#7e60bf',
  },
  profileInfo: {
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#7e60bf',
    fontWeight: '500',
  },
  email: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 20,
  },
  changePasswordButton: {
    marginBottom: 20,
  },
  changePasswordText: {
    color: '#7e60bf',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signOutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
