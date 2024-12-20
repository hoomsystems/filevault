import { MainLayout } from '@/components/MainLayout';

export default function ProtectedLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
} 