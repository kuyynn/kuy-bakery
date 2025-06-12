import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function App() {
  const [produk, setProduk] = useState([]);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    const { data, error } = await supabase.from('produk').select('*');
    if (error) console.log('❌ Error:', error);
    else setProduk(data);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Daftar Produk</Text>
      <FlatList
        data={produk}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.nama_produk} - Rp{item.harga}</Text>
        )}
      />
    </View>
  );
}
