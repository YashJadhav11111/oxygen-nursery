import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import RequireAdmin from '@/components/admin/RequireAdmin';
import Home from '@/pages/Home';

/**
 * Routes.
 * Home is bundled eagerly (it is the landing page); every other route is
 * code-split so the first load stays small.
 *
 * There are two route trees. Everything under <Layout> is the public website,
 * open to anyone. Everything under /admin sits behind RequireAdmin and its own
 * shell — no navbar, no footer, no scroll motion.
 *
 * /login is outside both: it has its own full-page treatment and must stay
 * reachable when nobody is signed in.
 */
const Plants = lazy(() => import('@/pages/Plants'));
const PlantDetail = lazy(() => import('@/pages/PlantDetail'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Projects = lazy(() => import('@/pages/Projects'));
const PlantCare = lazy(() => import('@/pages/PlantCare'));
const CareGuideDetail = lazy(() => import('@/pages/CareGuideDetail'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Book = lazy(() => import('@/pages/Book'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const Login = lazy(() => import('@/pages/Login'));
const AdminLayout = lazy(() => import('@/components/admin/AdminLayout'));
const Overview = lazy(() => import('@/pages/admin/Overview'));
const PlantsAdmin = lazy(() => import('@/pages/admin/PlantsAdmin'));
const PlantEditor = lazy(() => import('@/pages/admin/PlantEditor'));
const ImagesAdmin = lazy(() => import('@/pages/admin/ImagesAdmin'));
const AppointmentsAdmin = lazy(() => import('@/pages/admin/AppointmentsAdmin'));
const AdminsAdmin = lazy(() => import('@/pages/admin/AdminsAdmin'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="plants" element={<Plants />} />
        <Route path="plants/:slug" element={<PlantDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:slug" element={<ServiceDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="plant-care" element={<PlantCare />} />
        <Route path="plant-care/:slug" element={<CareGuideDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="book" element={<Book />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/login" element={<Login />} />

      {/* Every admin route is wrapped, so there is no way in through a URL. */}
      <Route
        path="/admin"
        element={<RequireAdmin><AdminLayout /></RequireAdmin>}
      >
        <Route index element={<Overview />} />
        <Route path="plants" element={<PlantsAdmin />} />
        <Route path="plants/new" element={<PlantEditor />} />
        <Route path="plants/:slug/edit" element={<PlantEditor />} />
        <Route path="images" element={<ImagesAdmin />} />
        <Route path="appointments" element={<AppointmentsAdmin />} />
        <Route
          path="admins"
          element={<RequireAdmin ownerOnly><AdminsAdmin /></RequireAdmin>}
        />
      </Route>
    </Routes>
  );
}
