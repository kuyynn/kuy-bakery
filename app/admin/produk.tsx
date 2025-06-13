// app/admin/produk.tsx

import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const dummyProducts = [
  {
    id: '1',
    name: 'Roti Tawar Gandum',
    description: 'Roti tawar gandum segar dengan tekstur lembut dan rasa yang kaya.',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 15000,
    category: 'bread',
  },
  {
    id: '2',
    name: 'Croissant Mentega',
    description: 'Croissant berlapis dengan mentega berkualitas tinggi.',
    image: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=800',
    price: 25000,
    category: 'bread',
  },
  {
    id: '3',
    name: 'Kue Coklat Premium',
    description: 'Kue coklat lembut dengan lapisan ganache yang kaya.',
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 85000,
    category: 'cake',
  },
  {
    id: '4',
    name: 'Roti Sobek Keju',
    description: 'Roti sobek dengan topping keju mozzarella yang melimpah.',
    image: 'https://images.pexels.com/photos/298217/pexels-photo-298217.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 35000,
    category: 'bread',
  },
  {
    id: '5',
    name: 'Black Forest Cake',
    description: 'Kue Black Forest dengan cherry segar dan krim yang lembut.',
    image: 'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 120000,
    category: 'cake',
  },
  {
    id: '6',
    name: 'Roti Bakar Coklat',
    description: 'Roti bakar dengan selai coklat premium dan topping almond.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 20000,
    category: 'bread',
  },
  {
    id: '7',
    name: 'Tiramisu Cake',
    description: 'Kue tiramisu autentik Italia dengan mascarpone dan kopi espresso.',
    image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 95000,
    category: 'cake',
  },
  {
    id: '8',
    name: 'Baguette Prancis',
    description: 'Baguette tradisional Prancis dengan kulit renyah dan isi lembut.',
    image: 'https://images.pexels.com/photos/209540/pexels-photo-209540.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 18000,
    category: 'bread',
  },
  {
    id: '9',
    name: 'Red Velvet Cake',
    description: 'Kue red velvet dengan cream cheese frosting yang lembut.',
    image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 90000,
    category: 'cake',
  },
  {
    id: '10',
    name: 'Donat Glazed',
    description: 'Donat lembut dengan glazed manis yang mengkilap.',
    image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=800',
    price: 12000,
    category: 'bread',
  },
];

export default function ProdukScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Logout Gagal', error.message);
    else router.replace('/auth/login');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Produk Kuy Bakery</Text>
        <TouchableOpacity onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#6b4e34" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.price}>Rp {item.price.toLocaleString()}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff8e1' },
  header: {
    padding: 16,
    backgroundColor: '#fff3e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#f0e0d6',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d4850c',
  },
  list: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fefefe',
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b4e34',
  },
  desc: {
    color: '#888',
    marginVertical: 4,
    fontSize: 12,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d4850c',
  },
});
