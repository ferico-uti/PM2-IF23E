import { View, Text } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { styles } from '@/styles/barang';
import { router } from 'expo-router';

// buat interface untuk header
type CustomHeaderProps = {
    // xyz = wajib ditambahkan saat diakses
    title: string;

    // xyz? = optional ditambahkan saat diakses
    iconBack?: boolean;   
};

export default function CustomHeader({ title, iconBack = false }: CustomHeaderProps) {
    return (
        <View style={styles.header_area}>
            {iconBack && (
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    style={styles.back_button}
                    onPress={() => router.back()}
                />
            )}

            <Text style={styles.header_title}>{title}</Text>
        </View>
    )
}