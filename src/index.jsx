import { createRoot } from "react-dom/client";
import App from "./components/app";
import "./app.scss";

const root = createRoot(document.getElementById("app"));
root.render(<App />);
