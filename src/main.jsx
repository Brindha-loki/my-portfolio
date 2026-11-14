import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import SiteLayout from './components/SiteLayout'
import Home from './pages/Home'
import About from './pages/About'
import Skills from './pages/Skills'
import Projects from './pages/Projects'
import Experience from './pages/Experience'
import Education from './pages/Education'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { AdminProvider } from './admin/AdminContext'
import AdminLogin from './admin/Login'
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import ProfileEditor from './admin/pages/ProfileEditor'
import SkillsAdmin from './admin/pages/SkillsAdmin'
import ProjectsAdmin from './admin/pages/ProjectsAdmin'
import EducationAdmin from './admin/pages/EducationAdmin'
import ExperienceAdmin from './admin/pages/ExperienceAdmin'
import SocialAdmin from './admin/pages/SocialAdmin'
import MediaLibrary from './admin/pages/MediaLibrary'
import Messages from './admin/pages/Messages'
import SettingsEditor from './admin/pages/SettingsEditor'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminProvider><AdminLogin /></AdminProvider>} />
        <Route
          path="/admin"
          element={
            <AdminProvider>
              <AdminLayout />
            </AdminProvider>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfileEditor />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="education" element={<EducationAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="social" element={<SocialAdmin />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<SettingsEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
