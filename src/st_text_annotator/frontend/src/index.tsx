import { createRoot } from 'react-dom/client';
import MyComponent from "./Annotation"
import React from 'react';

const container = document.getElementById("root")
const root = createRoot(container)

root.render(<MyComponent />)
