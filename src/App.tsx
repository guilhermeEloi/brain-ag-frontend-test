import AppRoutes from "./routes/routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { CustomThemeProvider } from "./contexts/CustomThemeProvider";
import "./styles/global.css";

function App() {
  return (
    <CustomThemeProvider>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </CustomThemeProvider>
  );
}

export default App;
