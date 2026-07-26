import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Join from './pages/Join';
import About from './pages/About';

import Events from './pages/Events';
import Magazines from './pages/Magazines';
import Committee from './pages/Committee';

import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminEvents from './pages/admin/AdminEvents';
import AdminMagazines from './pages/admin/AdminMagazines';
import AdminCommittee from './pages/admin/AdminCommittee';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AppRouter = () => {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/magazines" element={<Magazines />} />
            <Route path="/committee" element={<Committee />} />
            <Route path="/about" element={<About />} />
            <Route path="/join" element={<Join />} />
          </Route>
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            {/* Admin Routes */}
            <Route path="events" element={<AdminEvents />} />
            <Route path="magazines" element={<AdminMagazines />} />
            <Route path="committee" element={<AdminCommittee />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
};

export default AppRouter;
