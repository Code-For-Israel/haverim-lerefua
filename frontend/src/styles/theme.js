import { SvgIcon, createTheme } from "@mui/material";

const primaryColor = "#4563CD";

export const theme = createTheme({
  direction: "rtl",
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: 600,
    },
    h2: {
      color: primaryColor,
      fontSize: 22,
      fontWeight: 600,
    },
    h3: {
      fontSize: 20,
      fontWeight: 600,
    },
    body1: {
      fontSize: 18,
    },
    fontFamily: ["Assistant", "sans-serif"].join(","),
    color: "#252525",
    fontSize: 18,
    letterSpacing: "0.5px",
  },
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: "#ff8e00",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
        },
        contained: {
          boxShadow: "0px 3px 5px 0px rgba(0, 0, 0, 0.12)",
          borderRadius: "8px",
          ":disabled": {
            backgroundColor: "white",
            boxShadow: "0px 3px 5px 0px rgba(0, 0, 0, 0.08)",
            border: "2px solid #E3E3E3",
          },
        },
        outlined: {
          boxShadow: "0px 3px 5px 0px rgba(0, 0, 0, 0.12)",
          borderRadius: "8px",
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
        text: {
          color: "#252525",
          textDecoration: "underline",
          fontWeight: 400,
          "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
          },
        },
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
        disableRipple: true,
        fullWidth: true,
      },
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true,
        checkedIcon: (
          <SvgIcon>
            <svg width="20" height="20" viewBox="0 0 23 23" fill="none">
              <circle
                id="Ellipse 2"
                cx="11.5"
                cy="11.5"
                r="6.5"
                stroke={primaryColor}
                strokeWidth="7"
              />
            </svg>
          </SvgIcon>
        ),
      },
      styleOverrides: {
        root: {
          marginRight: 10,
          color: "#979797",
          "&.Mui-checked": {
            color: primaryColor,
          },
        },
      },
    },
    FormControlLabel: {
      styleOverrides: {
        label: {
          fontWeight: 200,
        },
      },
    },
  },
});
