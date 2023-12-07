import "./index.css"
import React from "react"
import { createRoot } from "react-dom/client"
import Builder from "./components/Builder"
import StreamlitProvider from "./utils/StreamlitProvider"
import { ComponentProps, withStreamlitConnection } from "streamlit-component-lib"

const Component = (props: ComponentProps) => {
  const { mode } = props.args
  return (
    <StreamlitProvider>
      <Builder mode={mode} />
    </StreamlitProvider>
  )
}

const StreamlitComponent = withStreamlitConnection(Component)

const container = document.getElementById("root")
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <StreamlitComponent />
  </React.StrictMode>
)