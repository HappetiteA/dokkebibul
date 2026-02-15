import { StyleSheet } from "react-native";

export const ModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    paddingVertical: 35,
    paddingHorizontal: 40,
    borderRadius: 20, // Rounded container
    width: 300,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18, // Slightly smaller than 20 for better fit
    fontWeight: "600", // Semi-bold
    textAlign: "center",
    lineHeight: 28, // Better spacing for newlines
    color: "#333",
  },
  detailsText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#909090",
    marginBottom: 20,
    textAlign: "center",
  },

  modalBtnRow: {
    flexDirection: "row",
    gap: 12, // Space between buttons
    justifyContent: "center",
    width: "100%",
  },

  closeButtonWrapper: {
    alignSelf: "flex-end", // Pushes to the right
    padding: 5, // Hit slop area
    marginBottom: -10,
    marginTop: -25,
    marginHorizontal: -20,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12, // Vertical space between "Leave" and bottom row
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12, // Horizontal space between Block and Report
  },

  // --- BUTTON STYLES ---
  baseButton: {
    borderRadius: 20, // Pill shape
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 100,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Blue Filled Button (For "Block" or primary actions)
  blueButton: {
    backgroundColor: "#89CFF0", // The light blue from your image
    borderWidth: 0,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "600",
    fontSize: 14,
  },

  // White Bordered Button (For "Cancel" or "Confirm")
  whiteButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#E0E0E0", // Light grey border
  },
  disabledButton: {
    backgroundColor: "#D9D9D9", // Grayed out if nothing selected
  },

  // --- REASON BUTTON STYLES ---
  reasonListContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // Allows buttons to flow into multiple lines
    justifyContent: "center",
    gap: 8, // Spacing between chips
    marginBottom: 30,
    width: "80%",
  },
  reasonButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20, // Rounded Pill Shape
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#D9D9D9",
  },
  reasonButtonSelected: {
    backgroundColor: "#D9D9D9",
    borderColor: "#D9D9D9",
    borderWidth: 2,
  },
  reasonText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
});
