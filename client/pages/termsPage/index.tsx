// pages/terms.tsx
import { Download, FileText } from "lucide-react";
import { useState } from "react";
import Sidebar  from "../../components/sidebar"
export default function TermsPage() {
    const [activeItem, setActiveItem] = useState("terms");

    const downloads = [
    { title: "Full Terms & Conditions", file: "/TERMS_AND_CONDITIONS_WAYFEEL.pdf", type: "PDF", size: "176KB" },
    { title: "Privacy Policy", file: "/PRIVACY_POLICY_WAYFEEL.pdf", type: "PDF", size: "217KB" },
    { title: "Disclaimer", file: "/DISCLAIMER_WAYFEEL.pdf", type: "PDF", size: "198KB" },
    ];

    const sections = [
    {
        title: "Introduction",
        content:
        "Welcome to our website. By accessing or using our services, you agree to comply with these Terms and Conditions.",
    },
    {
        title: "User Responsibilities",
        content:
        "Users are expected to provide accurate information and refrain from any misuse of our platform.",
    },
    {
        title: "Limitations of Liability",
        content:
        "We are not liable for any damages arising from the use of our services to the maximum extent permitted by law.",
    },
    {
        title: "Governing Law",
        content:
        "These terms are governed by the laws of your jurisdiction, without regard to conflict of law principles.",
    },
    ];

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-purple-950 text-gray-800 dark:text-gray-200">
      {/* Header */}
        <div className="w-1/6 fixed top-16 left-0 p-4">
            <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
        </div>
      <header className="text-center py-12 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl font-bold">📜 Terms & Conditions</h1>
        <p className="mt-2 text-lg">Last updated: August 31, 2025</p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Please read carefully. You may also download the documents below.
        </p>
      </header>

      {/* Downloads Section */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-6">Download Documents</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {downloads.map((doc, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center"
            >
              <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="font-semibold">{doc.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {doc.type} • {doc.size}
              </p>
              <a
                href={doc.file}
                download
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" /> Download
              </a>
              
            </div>
          ))}
        </div>
      </section>

      {/* Terms Accordion */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold mb-6">Terms Overview</h2>
        <div className="space-y-4">
          {sections.map((section, i) => (
            <details
              key={i}
              className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
            >
              <summary className="cursor-pointer text-lg font-semibold">
                {section.title}
              </summary>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{section.content}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
