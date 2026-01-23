import { StyleSheet } from "react-native";

export const headerHeight = 50;
export const headerMargin = 50;

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
    marginLeft: 15,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  title: {
    marginLeft: 10,
    fontSize: 26,
  },
});

export default headerStyle;
