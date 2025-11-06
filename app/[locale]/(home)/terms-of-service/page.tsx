import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/blocks/footer";
import { Header } from "@/components/blocks/header";
import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

interface TermsOfServicePageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsOfServicePage(
  props: TermsOfServicePageProps,
) {
  const { locale } = await props.params;
  const page = source.getPage(["terms-of-service"], locale);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <article className="min-h-screen w-full bg-white dark:bg-[#212121] transition-colors">
      <Header
        logo="/images/dark-logo.png"
        darkLogo="/images/dark-logo.png"
        navColor="#3D3D3D"
      />
      <div className="max-w-7xl mx-auto px-4 md:px-5 pt-24 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3D3D3D] dark:text-[#E5E5E5] mb-4">
          {page.data.title}
        </h1>
        {page.data.description && (
          <p className="text-lg text-gray-600 dark:text-[#A0A0A0] mb-8">
            {page.data.description}
          </p>
        )}
        <div className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-[#3D3D3D] dark:prose-headings:text-[#E5E5E5] prose-p:text-gray-700 dark:prose-p:text-[#A0A0A0] prose-a:text-[#F14636] hover:prose-a:text-[#F14636]/80">
          <MDX components={getMDXComponents()} />
        </div>
      </div>
      <Footer />
    </article>
  );
}

export async function generateMetadata(
  props: TermsOfServicePageProps,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(["terms-of-service"], params.locale);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
