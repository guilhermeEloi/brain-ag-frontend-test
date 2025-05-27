import AppRoutes from "./routes/routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./styles/global.css";

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
