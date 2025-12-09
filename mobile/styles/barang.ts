import { StyleSheet } from "react-native";

// buat css (styling)
const size = 20;

export const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 15,
    right: 0,
    bottom: 0,
    backgroundColor: "#f9cf00",
  },

  header_area: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    backgroundColor: "#a51c31",    
    padding: 10,
  },

  header_title: {
    fontSize: size,
    color: "#ffffff",
  },

  card: {
    margin: 20,
  },

  text_input: {
    backgroundColor: "#fff",
  },

  satuan_area: {
    width: "100%",
  },

  error_area: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  error: {
    color: "#ff0000",
    fontSize: 12,
    marginVertical: 5,
    marginHorizontal: 0,
    paddingLeft: 5,
  },

  back_button: {
    position: "absolute",
    left: 10,
    color: "#ffffff",
  },
});
