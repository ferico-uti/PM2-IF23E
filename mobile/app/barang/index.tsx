import { Strings } from "@/constants/strings";
import { styles } from "@/styles/barang";
import { formatRupiah } from "@/utils/scripts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Button,
  Card,
  Dialog,
  FAB,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";

export default function BarangViewPage() {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const hideSnackbar = () => setVisibleSnackbar(false);

  // buat react hook (useState)
  const [data, setData] = useState<
    { id: number; kode: string; nama: string; harga: number; satuan: string }[]
  >([]);
  // state untuk pencarian
  const [search, setSearch] = useState("");
  // state untuk filter data (hasil pencarian)
  const [filter, setFilter] = useState<typeof data>([]);
  // state untuk simpan id barang
  const [id, setId] = useState(0);

  // buat useRef untuk menampilkan pesan hapus data
  const message = useRef("");
  // buat useRef untuk menampilkan respon hapus data
  const messageResponse = useRef("");

  // buat react hook (useEffect)
  useEffect(() => {
    getDataBarang();

    // jika pencarian data diisi
    if (search.toLowerCase().trim() !== "") {
      // lakukan pencarian dan filter data
      // berdasarkan nama barang / harga barang
      const filter_data = data.filter((item) => {
        // filter nama dengan mengabaikan spasi
        const nama = item.nama.replace(/\s+/g, "").toLowerCase();
        // filter harga tanpa mengabaikan spasi
        // const harga = item.harga.toString().toLowerCase();
        const harga = String(item.harga).toLowerCase();

        // proses filter data
        return (
          nama.includes(search.replace(/\s+/g, "").toLowerCase()) ||
          harga.includes(search.toLowerCase())
        );
      });
      // tampilkan data barang berdasarkan pencarian
      setFilter(filter_data);
    }
    // jika pencarian data tidak diisi
    else {
      // tampilkan seluruh data barang
      setFilter(data);
    }
  }, [search, data]);

  // buat fungsi koneksi API dengan axios
  const getDataBarang = async () => {
    const response = await axios.get(Strings.api_barang);
    // console.log(response.data.barang);
    setData(response.data.barang);
  };

  // buat pesan untuk hapus data
  const setMessage = (text: string) => {
    message.current = "Data Barang : " + text + " Ingin Dihapus ?";
  };

  // buat fungsi untuk hapus data
  const deleteDataBarang = async () => {
    try {
      const response = await axios.delete(
        `${Strings.api_barang}/${id}`
      );
      messageResponse.current = response.data.message;
    } finally {
      setVisibleSnackbar(true);
      hideDialog();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        // alignItems: "center",
        // width: "100%",
        // backgroundColor: "#ffcc00",
      }}>
      {/* contoh inline */}
      {/* <Text style={{color: 'red', textAlign: 'center', fontSize: 20}}>Halaman View Barang</Text> */}

      {/* contoh internal */}

      {/* area header */}
      <View style={styles.header_area}>
        <Text style={styles.header_title}>
          Tampil Data Barang
        </Text>
      </View>

      {/* area pencarian */}
      <TextInput
        label="Cari Data Barang"
        right={
          <TextInput.Icon
            icon={() => (
              <MaterialIcons
                name="search"
                size={24}
                color="black"
                onPress={() => console.log("Search")}
              />
            )}
          />
        }
        style={{ fontSize: 16, backgroundColor: "#fff" }}
        value={search}
        onChangeText={(text) => setSearch(text)}
      />

      {/* area content */}
      {/* <Text> */}

      {/* {data.map((item) => ( */}

      <FlatList
        style={{ backgroundColor: "#a51c31" }}
        data={filter}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card key={item.id} style={styles.card}>
            <Card.Title
              title={item.nama}
              subtitle={formatRupiah(item.harga)}
              titleStyle={{ fontSize: 20 }}
            />

            <Card.Actions>
              <Button
                style={{ backgroundColor: "red" }}
                onPress={() => {
                  setId(item.id);
                  showDialog();
                  setMessage(item.nama);
                }}>
                <MaterialIcons name="delete" size={24} color="white" />
              </Button>

              <Button
                style={{ backgroundColor: "#e3e3e3" }}
                onPress={() => router.push(`/barang/edit/${item.id}`)}>
                <MaterialIcons name="edit" size={24} color="black" />
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      {/* </Text> */}

      {/* area fab */}

      <FAB
        icon="plus"
        color="#000"
        mode="flat"
        style={styles.fab}
        onPress={() => router.push("/barang/add")}
      />

      {/* area dialog (hapus data) */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Informasi</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{message.current}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={deleteDataBarang}>Ya</Button>
            <Button onPress={hideDialog}>Tidak</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* area snackbar (respon hapus data) */}
      <Snackbar visible={visibleSnackbar} onDismiss={hideSnackbar}>
        {messageResponse.current}
      </Snackbar>
    </View>
  );
}


