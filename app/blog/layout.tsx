import BlogThemeWrapper from "@/features/blog/components/BlogThemeWrapper";
import BlogNavbar from "@/features/blog/components/BlogNavbar";
import SiteFooter from "@/app/components/main/SiteFooter";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlogThemeWrapper>
      <BlogNavbar />
      {children}
      <SiteFooter />
    </BlogThemeWrapper>
  );
}
