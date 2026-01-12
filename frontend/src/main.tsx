import { StrictMode } from 'react'
import './index.css'
import ReactDom from "react-dom/client"
import { BrowserRouter} from "react-router-dom"
import App from './App.tsx'


ReactDom.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
)
