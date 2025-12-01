// buat fungsi untuk format rupiah
export const formatRupiah = (value: number) => {
    return value.toLocaleString("id-ID");
};