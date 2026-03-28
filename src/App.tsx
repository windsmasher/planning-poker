import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Room } from './pages/Room'

const trimmedBase = import.meta.env.BASE_URL.replace(/\/$/, '')
const routerBasename = trimmedBase === '' ? undefined : trimmedBase

export function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
