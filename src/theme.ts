// import {Theme} from "@mui/material";
import {createTheme} from "@mui/material/styles";
// import '@mui/styles'

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}
export default createTheme({
    palette: {
        primary: {
            main: '#000000'
        }
    }
})