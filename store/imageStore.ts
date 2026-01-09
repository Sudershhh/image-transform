import { create } from 'zustand';

export interface Image {
  id: string;
  sessionId: string;
  originalFilename: string | null;
  originalUrl: string;
  processedUrl: string | null;
  status: 'processing' | 'completed' | 'failed';
  errorMessage: string | null;
  createdAt: string;
}

interface ImageStore {
  images: Image[];
  currentImage: Image | null;
  uploading: boolean;
  processing: boolean;
  error: string | null;

  // Actions
  setImages: (images: Image[]) => void;
  addImage: (image: Image) => void;
  updateImage: (id: string, updates: Partial<Image>) => void;
  setCurrentImage: (image: Image | null) => void;
  setUploading: (uploading: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  deleteImage: (id: string) => void;
  clearError: () => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  currentImage: null,
  uploading: false,
  processing: false,
  error: null,

  setImages: (images) => set({ images }),
  addImage: (image) => set((state) => ({ images: [image, ...state.images] })),
  updateImage: (id, updates) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, ...updates } : img
      ),
      currentImage:
        state.currentImage?.id === id
          ? { ...state.currentImage, ...updates }
          : state.currentImage,
    })),
  setCurrentImage: (image) => set({ currentImage: image }),
  setUploading: (uploading) => set({ uploading }),
  setProcessing: (processing) => set({ processing }),
  setError: (error) => set({ error }),
  deleteImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
      currentImage:
        state.currentImage?.id === id ? null : state.currentImage,
    })),
  clearError: () => set({ error: null }),
}));
