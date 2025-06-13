import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';

type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error('Gagal mengambil data pengguna:', error.message);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <Text style={styles.name}>{item.full_name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={[styles.role, item.role === 'admin' ? styles.admin : styles.user]}>
        {item.role === 'admin' ? 'Admin' : 'User'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d4850c" />
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={renderUser}
      ListHeaderComponent={<Text style={styles.header}>Daftar Pengguna</Text>}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
  },
  list: {
    padding: 16,
    backgroundColor: '#fff8e1',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d4850c',
    marginBottom: 12,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b4e34',
  },
  email: {
    fontSize: 14,
    color: '#4e342e',
    marginVertical: 4,
  },
  role: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  admin: {
    backgroundColor: '#f39c12',
    color: '#fff',
  },
  user: {
    backgroundColor: '#a78d74',
    color: '#fff',
  },
});