import { forwardRef } from "react";
import { TextInput as RNTextInput, TextInputProps } from "react-native";

interface CustomTextInputProps extends TextInputProps {
  weight?: "regular" | "semibold" | "bold";
}

export const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(
  ({ style, weight = "regular", ...otherProps }, ref) => {
    const getFontFamily = () => {
      switch (weight) {
        case "bold":
          return "IBMPlexSansKRBold";
        case "semibold":
          return "IBMPlexSansKRSemiBold";
        case "regular":
        default:
          return "IBMPlexSansKRRegular";
      }
    };

    return (
      <RNTextInput
        ref={ref}
        {...otherProps}
        style={[
          { fontFamily: getFontFamily() },
          style,
        ]}
      />
    );
  },
);

TextInput.displayName = "TextInput";
