import React from "react"
import ReactDOM from "react-dom"
import Annotation from "./components/Annotation"
import StreamlitProvider from "./utils/StreamlitProvider"

ReactDOM.render(
  <React.StrictMode>
    <StreamlitProvider>
      <Annotation />
    </StreamlitProvider>
  </React.StrictMode>,
  document.getElementById("root")
)