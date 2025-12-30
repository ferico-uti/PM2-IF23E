import { View, Text } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { styles } from '@/styles/barang';
import { router } from 'expo-router';
import { Button } from 'react-native-paper';

// buat interface untuk header
type CustomButtonProps = {
    // xyz = wajib ditambahkan saat diakses
    title: string;
    onPress: () => void;
    icon: string;
};

export default function CustomButton({ title, icon, onPress }: CustomButtonProps) {
    return (
        <Button
            icon={icon}
            mode="contained"
            onPress={onPress}>
            {title}
        </Button>
    )
}