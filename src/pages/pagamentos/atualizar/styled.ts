import { styled } from "@ignite-ui/react";

export const Container = styled("main", {
  ">form": {
    padding: "2rem 4rem",
    ">fieldset": {
      paddingTop: "1rem",
      border: "none",
      legend: {
        fontFamily: "Roboto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.3rem",
      },
      display: "flex",
      flexDirection: `column`,
      justifyContent: "center",
      gap: "2rem",
      button: {
        width: "40%",
      },
    },
  },
});

export const Box = styled("div", {
  display: "flex",
  alignItems: "end",
  gap: "2rem",
});

export const ContainerAssociado = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "2rem",
});

export const AssociadoNome = styled("span", {
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  fontWeight: "500",
  lineHeight: "1.4375em",
  letterSpacing: "0.00938em",
  color: "#0DA9A4",
  fontSize: "14px",
  border: "solid 2px #0DA9A460",
  borderRadius: "8px",
  padding: "10px",
});

export const Text = styled("p", {
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  border: "solid 1px",
  borderLeftColor: "transparent",
  borderRightColor: "transparent",
  borderTopColor: "transparent",
  borderBottomColor: "#A9A9B2",
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  fontWeight: "400",
  lineHeight: "1.4375em",
  letterSpacing: "0.00938em",
  color: "rgba(0, 0, 0, 0.6)",
  flex: 1,
  padding: "4px 0px 5px",
  fontSize: "13px",
});

export const ContentDate = styled("div", {
  display: "flex",
  alignItems: "end",
  width: "26rem",
  fieldset: {
    border: "none",
  },
});
export const FormError = styled("p", {
  color: "#d32f2f",
  fontFamily: "Roboto, Helvetica , Arial, sans-serif",
  fontWeight: "400",
  fontSize: "0.75rem",
  lineHeight: "1.66",
  letterSpacing: "0.03333em",
  textAlign: "left",
  marginTop: "3px",
  marginRight: "0",
  marginBottom: " 0",
  marginLeft: "0",
});
