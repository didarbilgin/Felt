import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import AdminContactMessages from "@/pages/admin/AdminContactMessages";
import AdminPages from "@/pages/admin/AdminPages";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Research from "@/pages/Research";
import ResearchArticle from "@/pages/ResearchArticle";
import Programs from "@/pages/Programs";
import Lab from "@/pages/Lab";
import Events from "@/pages/Events";
import Community from "@/pages/Community";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminArticles from "@/pages/admin/Articles";
import AdminPrograms from "@/pages/admin/Programs";
import AdminEvents from "@/pages/admin/Events";
import AdminBlog from "@/pages/admin/BlogAdmin";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/research" element={<Research />} />
            <Route path="/research/:slug" element={<ResearchArticle />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/events" element={<Events />} />
            <Route path="/community" element={<Community />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="about" element={<Navigate to="/admin/pages?page=about" replace />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="contact-messages" element={<AdminContactMessages />} />
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="programs" element={<AdminPrograms />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
