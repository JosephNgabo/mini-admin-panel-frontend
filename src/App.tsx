import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { UsersPage } from '@/pages/UsersPage'
import { ChartPage } from '@/pages/ChartPage'
import { ExportPage } from '@/pages/ExportPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App

