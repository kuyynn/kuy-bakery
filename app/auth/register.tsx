import { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      Alert.alert('Error', 'Harap isi semua field');
      setLoading(false);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('Error', 'Format email tidak valid');
      setLoading(false);
      return;
    }

    try {
      // Sign up user ke Supabase Auth tanpa konfirmasi email
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: undefined,
        },
      });

      if (authError) {
        console.error('Auth error detail:', authError);
        throw authError;
      }

      const userId = authData.user?.id;
      if (!userId) {
        throw new Error('User ID tidak ditemukan');
      }

      // Insert user ke tabel profiles
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email: trimmedEmail,
        full_name: trimmedName,
        role: 'user',
      });

      if (profileError) {
        console.error('Profile insert error:', profileError);
        throw profileError;
      }

      Alert.alert('Registrasi Berhasil!', 'Akun kamu berhasil dibuat. Silakan login.');
      router.replace('/auth/login');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        Alert.alert('Registration Error', error.message);
      } else {
        Alert.alert('Registration Error', 'Terjadi kesalahan saat registrasi');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <FontAwesome5 name="cheese" size={60} color="#d4850c" />
        <Text style={styles.brandName}>Kuy Bakery</Text>
      </View>

      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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
        <Button
          title={loading ? 'Registering...' : 'Register'}
          onPress={handleRegister}
          disabled={loading}
          color="#d4850c"
        />
      </View>

      <View style={styles.loginPrompt}>
        <Text>Sudah punya akun? </Text>
        <Text style={styles.loginLink} onPress={() => router.replace('/auth/login')}>
          Yuk login
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
  loginPrompt: {
    flexDirection: 'row',
    marginTop: 15,
  },
  loginLink: {
    color: '#d4850c',
    fontWeight: 'bold',
  },
});
