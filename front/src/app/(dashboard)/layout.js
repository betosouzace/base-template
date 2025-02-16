'use client';
import { useAuth } from '@/hooks/useAuth';
import Layout from "@/components/layout/Layout";

export default function DashboardLayout({ children }) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Layout>
      {children}
    </Layout>
  );
}