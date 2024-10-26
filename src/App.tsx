import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import ListPage from "./pages/List";
import DetailPage from "./pages/Detail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ListPage />} />
          <Route path="photos" element={<ListPage />} />
          <Route path="photos/:id" element={<DetailPage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
