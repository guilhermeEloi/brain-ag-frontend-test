import AppRoutes from "./routes/routes";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store";
import { CustomThemeProvider } from "./contexts/CustomThemeProvider";
import "./styles/global.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CustomThemeProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </CustomThemeProvider>
  );
}

export default App;
