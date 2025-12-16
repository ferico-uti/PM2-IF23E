import { Strings } from "@/constants/strings";
import { styles, styles_dropdown } from "@/styles/barang";
import { filterHargaRaw, filterKode, filterNama, formatRibuan } from "@/utils/scripts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Text, View } from "react-native";
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

  // buat state untuk cek error (jika ada salah komponen tidak diisi)
  // bentuk state berupa objek  
  const [error, setError] = useState<{
    kode: boolean;
    nama: boolean;
    harga: boolean;
    satuan: boolean;
  }>({
    kode: false,
    nama: false,
    harga: false,
    satuan: false,
  });

  // buat fungsi untuk simpan data
  const saveData = async () => {
    // buat object errorStatus untuk menampung kondisi error setiap komponen
    const errorStatus = {
      kode: textKode === "",
      nama: textNama === "",
      harga: textHarga === "",
      satuan: value === null,
    };

    // update kondisi error setiap komponen
    setError(errorStatus);

    // const hasError =
    //   errorStatus.kode ||
    //   errorStatus.nama ||
    //   errorStatus.harga ||
    //   errorStatus.satuan;

    const hasError = Object.values(errorStatus).includes(true);

    // jika ada salah satu komponen tidak diisi
    if (hasError) {
      return;
    }

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

      {/* area header */}
      <View style={styles.header_area}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          style={styles.back_button}
          onPress={() => {
            router.back();
          }}
        />

        <Text style={styles.header_title}>
          Tambah Data Barang
        </Text>
      </View>


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

      {/* tampilkan error jika kode barang belum diisi */}
      {error.kode && (
        <View style={styles.error_area}>
          <MaterialIcons
            name="info-outline"
            size={16}
            color="#ff0000"
          />
          <Text style={styles.error}>
            Kode Barang Harus Diisi !</Text>
        </View>
      )}

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

      {/* tampilkan error jika nama barang belum diisi */}
      {error.nama && (
        <View style={styles.error_area}>
          <MaterialIcons
            name="info-outline"
            size={16}
            color="#ff0000"
          />
          <Text style={styles.error}>
            Nama Barang Harus Diisi !</Text>
        </View>
      )}

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

      {/* tampilkan error jika harga barang belum diisi */}
      {error.harga && (
        <View style={styles.error_area}>
          <MaterialIcons
            name="info-outline"
            size={16}
            color="#ff0000"
          />
          <Text style={styles.error}>
            Harga Barang Harus Diisi !</Text>
        </View>
      )}

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

      {/* tampilkan error jika satuan barang belum diisi */}
      {error.satuan && (
        <View style={styles.error_area}>
          <MaterialIcons
            name="info-outline"
            size={16}
            color="#ff0000"
          />
          <Text style={styles.error}>
            Satuan Barang Harus Dipilih !</Text>
        </View>
      )}

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

