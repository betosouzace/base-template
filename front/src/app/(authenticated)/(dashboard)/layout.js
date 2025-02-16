'use client';
import { useAuth } from '@/hooks/useAuth';
import Layout from "@/components/layout/Layout";

export default function DashboardLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}