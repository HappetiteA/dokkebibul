import { StyleSheet } from "react-native";

export const headerHeight = 60;
//export const headerMargin = 50;

export const BGStyle = StyleSheet.create({
  BG: { flex: 1, backgroundColor: "#F8F8FA" },
});

const headerStyle = StyleSheet.create({
  container: {
    height: headerHeight,
    backgroundColor: "#F8F8FA",
  },
  content: {
    height: headerHeight,
    flexDirection: "row",
    textAlignVertical: "center",
    justifyContent: "space-between",
  },
  right: {
    flexDirection: "row",
    marginRight: 15,
  },
  left: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 25,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "auto",
  },
  title: {
    marginLeft: 20,
    fontSize: 22,
  },
  headerWrapper: {
    zIndex: 1000,
    backgroundColor: "#F8F9FA",
  },
  headerFade: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
    height: 20,
  },
});

export default headerStyle;
