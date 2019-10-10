import * as React from "react";
import { render } from "react-dom";
// Components
import { Map } from "./Map";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Map />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
