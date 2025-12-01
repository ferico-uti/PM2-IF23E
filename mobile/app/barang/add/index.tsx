import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { styles } from "@/styles/barang";
import { Button, TextInput } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";

const data = [
  { label: "UNIT", value: "Unit" },
  { label: "PCS", value: "Pcs" },
  { label: "KILOGRAM", value: "Kg" },
];

// buat interface untuk dropdown
interface DropdownItem {
  label: string;
  value: number;
}

export default function BarangAddPage() {
  // buat state
  const [textKode, setTextKode] = useState("");
  const [textNama, setTextNama] = useState("");
  const [textHarga, setTextHarga] = useState("");
  // buat state untuk satuan
  const [value, setValue] = useState(null);

  const renderItem = (item: DropdownItem) => {
    return (
      <View style={styles_dropdown.item}>
        <Text style={styles_dropdown.textItem}>{item.label}</Text>
        {item.value === value && (
          
          <MaterialIcons
            style={styles_dropdown.icon}
            name="check"
            size={24}
            color="black"
          />
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#fff",
      }}>
      <Text style={[styles.warna_bg, styles.jarak, { textAlign: "center" }]}>
        Halaman Tambah Data Barang
      </Text>

      {/* area kode */}
      <TextInput
        label="Kode Barang"
        style={styles.text_input}
        maxLength={15}
        value={textKode}
        onChangeText={(text) => setTextKode(text)}
      />

      {/* area nama */}
      <TextInput
        label="Nama Barang"
        style={styles.text_input}
        maxLength={50}
        value={textNama}
        onChangeText={(text) => setTextNama(text)}
      />

      {/* area harga */}
      <TextInput
        label="Harga Barang"
        style={styles.text_input}
        maxLength={11}
        value={textHarga}
        onChangeText={(text) => setTextHarga(text)}
      />

      {/* area satuan */}
      <View style={styles.satuan_area}>
        <Dropdown
          style={styles_dropdown.dropdown}
          placeholderStyle={styles_dropdown.placeholderStyle}
          selectedTextStyle={styles_dropdown.selectedTextStyle}
          inputSearchStyle={styles_dropdown.inputSearchStyle}
          iconStyle={styles_dropdown.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Pilih Satuan Barang"
          searchPlaceholder="Cari Data"
          value={value}
          onChange={(item) => {
            setValue(item.value);
          }}
          // renderLeftIcon={() => (
         
          //   <MaterialIcons
          //     style={styles_dropdown.icon}
          //     name="search"
          //     size={24}
          //     color="black"
          //   />
          // )}
          renderItem={renderItem}
        />
      </View>

      {/* area tombol */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 20,
          gap: 10,
        }}>
        <Button
          icon="check"
          mode="contained"
          onPress={() => console.log("Pressed")}>
          Simpan
        </Button>

        <Button
          icon="close"
          mode="outlined"
          onPress={() => router.back()}>
          Batal
        </Button>
      </View>
    </View>
  );
}

// setup internal style (untuk dropdown)
const styles_dropdown = StyleSheet.create({
  dropdown: {
    margin: 0,
    height: 50,
    backgroundColor: "white",
    borderRadius: 0,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#a3a3a3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.9,
    shadowRadius: 1.41,

    // elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
