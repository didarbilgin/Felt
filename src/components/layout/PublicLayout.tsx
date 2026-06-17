import { Outlet } from 'react-router-dom';
import { useGa4PageTracking } from '@/hooks/useGa4PageTracking';
import { usePageViewTracking } from '@/hooks/usePageViewTracking';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export function PublicLayout() {
  useGa4PageTracking();
  usePageViewTracking();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
