import { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(
        'Login Gagal',
        error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')
          ? 'Email atau password salah, atau akun belum terverifikasi.\n\nSilakan cek email untuk konfirmasi atau daftar terlebih dahulu.'
          : error.message
      );
      setLoading(false);
      return;
    }

    const user = data.user;

    // Cek apakah profile sudah ada
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // Jika belum ada, tambahkan default profile
    if (!existingProfile && !profileError) {
      const fullName = user.user_metadata?.full_name ?? 'Pengguna Baru';

      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        role: 'user',
      });
    }

    // Ambil role untuk redirect
    const { data: profile, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError || !profile) {
      Alert.alert('Gagal mengambil data role');
      setLoading(false);
      return;
    }

    // Redirect berdasarkan role
    if (profile.role === 'admin') {
      await router.replace('/admin/orders');
    } else {
      await router.replace('/(tabs)');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome5 name="bread-slice" size={60} color="#d4850c" />
        <Text style={styles.brandName}>Kuy Bakery</Text>
      </View>

      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#d4850c" />
        ) : (
          <Button title="Login" onPress={handleLogin} color="#d4850c" />
        )}
      </View>

      <View style={styles.registerPrompt}>
        <Text>Belum punya akun? </Text>
        <Text style={styles.registerLink} onPress={() => router.push('/auth/register')}>
          Yuk register
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4850c',
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b4e34',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#d4850c',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  registerPrompt: {
    flexDirection: 'row',
    marginTop: 15,
  },
  registerLink: {
    color: '#d4850c',
    fontWeight: 'bold',
  },
});
