import { BrowserRouter, Route, Routes } from "react-router";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import NowPlayingPage from "./pages/NowPlayingPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import DashboardMovies from "./pages/DashboardMovies";
import DashboardBookings from "./pages/DashboardBookings";
import AddMoviePage from "./pages/AddMoviePage";
import DashboardTheater from "./pages/DashboardTheater";
import DashboardTheaterDetail from "./pages/DashboardTheaterDetail";
import AddMovieSchedule from "./pages/AddMovieSchedule";
import MakeSeatLayoutPage from "./pages/MakeSeatLayoutPage";
import GlobalNavigateSetter from "./components/GlobalNavigateSetter";
import { Toaster } from "sonner";
import AddTheaterPage from "./pages/AddTheaterPage";
import DashboardMiscellaneous from "./pages/DashboardMiscellaneous";
import TheatersPage from "./pages/TheatersPage";
import TheaterDetailPage from "./pages/TheaterDetailPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminRoute from "./components/AdminRoute";
import { NotFoundPage } from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <GlobalNavigateSetter />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<NowPlayingPage />} />
          <Route path="/movies/:movieId" element={<MovieDetailPage />} />
          <Route path="/theaters" element={<TheatersPage />} />
          <Route path="/theaters/:theaterId" element={<TheaterDetailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route
              path="/dashboard/miscellaneous"
              element={<DashboardMiscellaneous />}
            />
            <Route path="/dashboard/movies" element={<DashboardMovies />} />
            <Route path="/dashboard/movies/add" element={<AddMoviePage />} />
            <Route path="/dashboard/bookings" element={<DashboardBookings />} />
            <Route path="/dashboard/theaters" element={<DashboardTheater />} />
            <Route
              path="/dashboard/theaters/add"
              element={<AddTheaterPage />}
            />
            <Route
              path="/dashboard/theaters/:theaterId"
              element={<DashboardTheaterDetail />}
            />
            <Route
              path="/dashboard/theaters/:theaterId/add/:movieId"
              element={<AddMovieSchedule />}
            />
          </Route>
          <Route path="/make-seat-layout" element={<MakeSeatLayoutPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/booking/:showtimeId" element={<SeatSelectionPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
