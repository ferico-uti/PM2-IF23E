import { Strings } from "@/constants/strings";
import { styles } from "@/styles/barang";
import { filterHargaRaw, filterKode, filterNama, formatRibuan } from "@/utils/scripts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Snackbar, TextInput } from "react-native-paper";

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
  const [textHargaRaw, setTextHargaRaw] = useState(0);
  // buat state untuk satuan
  const [value, setValue] = useState(null);

  // buat state untuk snackbar
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  // buat useRef untuk menampilkan respon simpan data
  const messageResponse = useRef("");

  // buat useRef untuk focus ke TextInput Kode Barang
  const refFocus = useRef<any>(null);


  // buat fungsi untuk hide snackbar
  const hideSnackbar = () => setVisibleSnackbar(false);

  // buat fungsi untuk simpan data
  const saveData = async () => {
    // jika tidak error
    try {
      const response = await axios.post(Strings.api_barang, {
        kode: textKode,
        nama: textNama,
        harga: textHargaRaw,
        satuan: value,
      });

      // jika success == true
      if (response.data.success) {
        // reset form
        setTextKode("");
        setTextNama("");
        setTextHarga("");
        setTextHargaRaw(0);
        setValue(null);

        // pilih salah 1 opsi berikut setelah simpan data berhasil
        // 1. hilangkan focus
        // Keyboard.dismiss();
        // 2. alihkan focus ke TextInput Kode Barang
        refFocus.current.focus();

      }
      // isi respon
      messageResponse.current = response.data.message;
    }
    // jika terjadi error
    catch {
      // isi respon
      messageResponse.current = "Gagal Kirim Data !";
    }
    finally {
      // tampilkan snackbar
      setVisibleSnackbar(true);
    }
  }

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
        ref={refFocus}
        onChangeText={(text) => {
          const result = filterKode(text);
          setTextKode(result);
        }}
      />

      {/* area nama */}
      <TextInput
        label="Nama Barang"
        style={styles.text_input}
        maxLength={50}
        value={textNama}
        onChangeText={(text) => {
          const result = filterNama(text);
          setTextNama(result);
        }}
      />

      {/* area harga */}
      <TextInput
        label="Harga Barang"
        style={styles.text_input}
        maxLength={11}
        value={textHarga}
        keyboardType="number-pad"
        onChangeText={(text) => {
          const result = formatRibuan(text);
          const result_raw = filterHargaRaw(text);
          setTextHarga(result);
          setTextHargaRaw(Number(result_raw));
        }}
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
          onPress={saveData}>
          Simpan
        </Button>

        <Button
          icon="close"
          mode="outlined"
          onPress={() => router.back()}>
          Batal
        </Button>
      </View>

      {/* area snackbar (respon simpan data) */}
      <Snackbar visible={visibleSnackbar} onDismiss={hideSnackbar}>
        {messageResponse.current}
      </Snackbar>
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
