import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { lazy, Suspense } from "react";

const DashboardPage = lazy(
  () => import("../features/dashboard/pages/DashboardPage")
);
const ProducerListPage = lazy(
  () => import("../features/producer/pages/ProducerListPage")
);
const ProducerFormPage = lazy(
  () => import("../features/producer/pages/ProducerFormPage")
);
const FarmListPage = lazy(() => import("../features/farm/pages/FarmListPage"));
const FarmFormPage = lazy(() => import("../features/farm/pages/FarmFormPage"));
const CropListPage = lazy(() => import("../features/crop/pages/CropListPage"));
const CropFormPage = lazy(() => import("../features/crop/pages/CropFormPage"));
const NotFoundPage = lazy(
  () => import("../features/not-found/pages/NotFoundPage")
);

export default function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/producers" element={<ProducerListPage />} />
          <Route path="/producers/new" element={<ProducerFormPage />} />
          <Route path="/producers/edit/:id" element={<ProducerFormPage />} />

          <Route path="/farms" element={<FarmListPage />} />
          <Route path="/farms/new" element={<FarmFormPage />} />
          <Route path="/farms/edit/:id" element={<FarmFormPage />} />

          <Route path="/crops" element={<CropListPage />} />
          <Route path="/crops/new" element={<CropFormPage />} />
          <Route path="/crops/edit/:id" element={<CropFormPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
