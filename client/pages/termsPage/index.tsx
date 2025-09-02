// pages/terms/index.tsx
import dynamic from "next/dynamic";
import { Download, FileText, Clock, Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";
import Sidebar from "../../components/sidebar";

// Type definitions
interface DocumentItem {
  title: string;
  file: string;
  type: string;
  size: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastUpdated: string;
}

// Dynamic import with proper typing
const PdfViewer = dynamic(() => import("../../components/pdfviewer"), { 
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading PDF viewer...</p>
      </div>
    </div>
  )
});

export default function TermsPage(): JSX.Element {
  const [activeItem, setActiveItem] = useState<string>("terms");

  const downloads: DocumentItem[] = [
    { 
      title: "Terms & Conditions", 
      file: "/TERMS_AND_CONDITIONS_WAYFEEL.pdf", 
      type: "PDF", 
      size: "176KB",
      description: "Complete terms of service and user agreement for using our platform.",
      icon: FileText,
      lastUpdated: "August 31, 2025"
    },
    { 
      title: "Privacy Policy", 
      file: "/PRIVACY_POLICY_WAYFEEL.pdf", 
      type: "PDF", 
      size: "217KB",
      description: "How we collect, use, and protect your personal information.",
      icon: Shield,
      lastUpdated: "August 25, 2025"
    },
    { 
      title: "Legal Disclaimer", 
      file: "/DISCLAIMER_WAYFEEL.pdf", 
      type: "PDF", 
      size: "198KB",
      description: "Important legal disclaimers and limitations of liability.",
      icon: AlertTriangle,
      lastUpdated: "August 20, 2025"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-black dark:to-purple-950 text-gray-800 dark:text-gray-200">
      {/* Sidebar */}
      <div className="w-1/6 fixed top-16 left-0 p-4 z-10">
        <Sidebar activeItem={activeItem} onSetActiveItem={setActiveItem} />
      </div>

      {/* Main Content Area */}
      <div className="ml-[16.67%] min-h-screen">
        {/* Header */}
        <header className="text-center py-12 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📜 Legal Documents
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Review our terms, privacy policy, and legal disclaimers
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last updated: August 31, 2025</span>
            </div>
          </div>
        </header>

        {/* Quick Navigation */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Quick Access
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {downloads.map((doc, i) => (
                <a
                  key={i}
                  href={`#document-${i}`}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700"
                >
                  <doc.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate">{doc.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{doc.size}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Documents Section */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Legal Documents</h2>
          
          <div className="space-y-12">
            {downloads.map((doc, i) => (
              <div
                key={i}
                id={`document-${i}`}
                className="rounded-3xl shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Document Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 p-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <doc.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {doc.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {doc.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Updated: {doc.lastUpdated}
                          </span>
                          <span>{doc.type} • {doc.size}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <a
                        href={doc.file}
                        download
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Download className="w-5 h-5" /> 
                        Download PDF
                      </a>
                    </div>
                  </div>
                </div>

                {/* PDF Viewer */}
                <div className="p-6">
                  <PdfViewer file={doc.file} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Information */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-center">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-medium mb-2">Questions about Terms?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contact our legal team at legal@wayfeel.com
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Privacy Concerns?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reach out to privacy@wayfeel.com
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">General Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Visit our help center or email support@wayfeel.com
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}