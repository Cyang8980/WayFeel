declare module 'react-pdf' {
  import { ComponentType, ReactNode } from 'react';

  export interface DocumentProps {
    file: string | File | Uint8Array;
    onLoadSuccess?: (pdf: { numPages: number }) => void;
    onLoadError?: (error: Error) => void;
    loading?: ReactNode;
    error?: ReactNode;
    options?: {
      cMapUrl?: string;
      cMapPacked?: boolean;
      [key: string]: any;
    };
    children?: ReactNode;
  }

  export interface PageProps {
    pageNumber: number;
    scale?: number;
    rotate?: number;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
    className?: string;
  }

  export const Document: ComponentType<DocumentProps>;
  export const Page: ComponentType<PageProps>;
  
  export const pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    version: string;
  };
}