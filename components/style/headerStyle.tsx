import { StyleSheet } from "react-native";

const headerStyle = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: "#bdc3c7",
  },
  content: {
    marginTop: 50,
    height: 50,
    flexDirection: "row",
    textAlignVertical: "center",
    justifyContent: "space-between",
  },
  right: {
    flexDirection: "row",
    marginRight: 20,
  },
  left: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  button: {
    width: 48,
    height: 48,
    backgroundColor: "#95a5a6",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  title: {
    marginLeft: 5,
  },
});

export default headerStyle;
