import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import store from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </PersistGate>
  </StrictMode>
);
