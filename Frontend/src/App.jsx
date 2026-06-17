import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BlogDetailPage from './pages/BlogDetailPage'
import BlogFormPage from './pages/BlogFormPage'
import MyBlogsPage from './pages/MyBlogsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />
          <Route path="/blog/:id"   element={<BlogDetailPage />} />
          <Route path="/my-blogs"   element={
            <ProtectedRoute><MyBlogsPage /></ProtectedRoute>
          } />
          <Route path="/create"     element={
            <ProtectedRoute requireWriter><BlogFormPage /></ProtectedRoute>
          } />
          <Route path="/edit/:id"   element={
            <ProtectedRoute requireWriter><BlogFormPage /></ProtectedRoute>
          } />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import Navbar from './components/Navbar';
// import Alert from './components/Alert';

// // Import Pages
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import BlogDetailPage from './pages/BlogDetailPage';
// import BlogFormPage from './pages/BlogFormPage';
// import MyBlogsPage from './pages/MyBlogsPage';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
//           <Navbar />
//           <Alert />
//           <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<HomePage />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<RegisterPage />} />
//               <Route path="/blog/:id" element={<BlogDetailPage />} />

//               {/* Protected Routes using your exact component wrapper */}
//               <Route path="/create" element={
//                 <ProtectedRoute requireWriter={true}>
//                   <BlogFormPage />
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/edit/:id" element={
//                 <ProtectedRoute requireWriter={true}>
//                   <BlogFormPage />
//                 </ProtectedRoute>
//               } />
              
//               <Route path="/my-blogs" element={
//                 <ProtectedRoute requireWriter={true}>
//                   <MyBlogsPage />
//                 </ProtectedRoute>
//               } />

//               {/* Catch-all fallback */}
//               <Route path="*" element={<HomePage />} />
//             </Routes>
//           </main>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

