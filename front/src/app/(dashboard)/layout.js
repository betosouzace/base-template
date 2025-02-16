'use client';
import Layout from "@/components/layout/Layout";

export default function LayoutPage({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
};