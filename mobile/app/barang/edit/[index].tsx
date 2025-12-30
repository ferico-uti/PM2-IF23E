import CustomButton from '@/components/ui/custom/CustomButton';
import CustomHeader from '@/components/ui/custom/CustomHeader';
import { Strings } from '@/constants/strings';
import { styles, styles_dropdown } from '@/styles/barang';
import { filterHargaRaw, filterKode, filterNama, formatRibuan, formatRupiah } from '@/utils/scripts';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import * as Notifications from "expo-notifications";

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

export default function BarangEditPage() {
    //   buat hook untuk ambil nilai slug (id)
    const { index } = useLocalSearchParams();

    // buat state
    const [textKode, setTextKode] = useState("");
    const [textNama, setTextNama] = useState("");
    const [textHarga, setTextHarga] = useState("");
    const [textHargaRaw, setTextHargaRaw] = useState(0);
    // buat state untuk satuan
    const [value, setValue] = useState(null);

    // buat useRef untuk focus ke TextInput Kode Barang
    const refFocus = useRef<any>(null);

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

    // buat state untuk snackbar
    const [visibleSnackbar, setVisibleSnackbar] = useState(false);

    // buat useRef untuk menampilkan respon simpan data
    const messageResponse = useRef("");

    // buat fungsi untuk hide snackbar
    const hideSnackbar = () => setVisibleSnackbar(false);

    // buat fungsi untuk ambil data (detail data)
    // sesuai dengan slug (id)
    const detailData = useCallback(
        async () => {
            try {
                // panggil service GET (detail data)
                const response = await axios.get(`${Strings.api_barang}/${index}`)
                // jika data barang ditemukan
                if (response.data.barang) {
                    // tampilkan data barang ke masing2 komponen
                    setTextKode(response.data.barang.kode);
                    setTextNama(response.data.barang.nama);
                    setTextHargaRaw(Number(response.data.barang.harga));
                    setTextHarga(formatRupiah(response.data.barang.harga));
                    setValue(response.data.barang.satuan);
                }
                // jika data barang tidak ditemukan
                else {
                    router.replace("/barang")
                }
            } catch {
                console.log("Gagal Ambil Data !");
            }
        },
        [index],
    )

    // tampilkan detail data dalam useEffect
    useEffect(() => {
        detailData();
    }, [detailData])

    // buat fungsi untuk ubah data
    const editData = async () => {
        // buat object errorStatus untuk menampung kondisi error setiap komponen
        const errorStatus = {
            kode: textKode === "",
            nama: textNama === "",
            harga: textHarga === "",
            satuan: value === null,
        };

        // update kondisi error setiap komponen
        setError(errorStatus);

        const hasError =
            errorStatus.kode ||
            errorStatus.nama ||
            errorStatus.harga ||
            errorStatus.satuan;

        // jika ada salah satu komponen tidak diisi
        if (hasError) {
            return;
        }

        // jika tidak error
        try {
            const response = await axios.put(`${Strings.api_barang}/${index}`, {
                kode: textKode,
                nama: textNama,
                harga: textHargaRaw,
                satuan: value,
            });

            // jika success == true
            if (response.data.success) {

                // tampiikan notifikasi
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Informasi",
                        body: response.data.message,
                    },
                    // jika notifikasi ingin tanpa delay
                    trigger: null,

                    // jika notifikasi ingin delay (misal 5 detik)
                    // trigger: {
                    //   type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                    //   seconds: 5
                    // },
                });

                // hilangkan focus
                Keyboard.dismiss();

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
            <CustomHeader title="Ubah Data Barang" iconBack={true}
                onPress={() => router.replace('/barang/add')} />

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
                <CustomButton icon="pencil" title="Ubah" onPress={editData} />

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
    )
}