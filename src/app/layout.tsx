import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Russian, But Make It Fun! | Online Russian Lessons with Alex",
  description: "Learn Russian with a native speaker who skips the boring drills. Practical conversations, memorable grammar, and culture for US & UK students.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <Header user={user} />
        {children}
      </body>
    </html>
  );
}
