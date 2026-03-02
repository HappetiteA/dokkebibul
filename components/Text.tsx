import { Text as RNText, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  weight?: "regular" | "semibold" | "bold";
}

export function Text(props: CustomTextProps) {
  const { style, weight = "regular", ...otherProps } = props;

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
    <RNText
      {...otherProps}
      style={[
        { fontFamily: getFontFamily() },
        style,
      ]}
    />
  );
}
