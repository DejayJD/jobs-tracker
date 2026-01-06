"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  title: string;
  name: string;
  office?: string;
  compensation?: string;
  companySize?: string;
  questions?: string;
  pros?: string;
  cons?: string;
  vibeCheck?: number;
  stage?: string;
  source?: string;
  logo?: string;
}

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  defaultColumn?: "inMotion" | "sentApps";
}

export function CreateCardModal({
  isOpen,
  onClose,
  onSubmit,
  defaultColumn,
}: CreateCardModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      name: "",
      office: "",
      compensation: "",
      companySize: "",
      questions: "",
      pros: "",
      cons: "",
      vibeCheck: 3,
      stage: "",
      source: "",
      logo: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      reset({
        title: "",
        name: "",
        office: "",
        compensation: "",
        companySize: "",
        questions: "",
        pros: "",
        cons: "",
        vibeCheck: 3,
        stage: "",
        source: "",
        logo: "",
      });
    }
  }, [isOpen, defaultColumn, reset]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function onSubmitForm(data: FormData) {
    try {
      // Clean up empty strings and convert to undefined
      const cleanedData: FormData = {
        ...data,
        office: data.office?.trim() || undefined,
        compensation: data.compensation?.trim() || undefined,
        companySize: data.companySize?.trim() || undefined,
        questions: data.questions?.trim() || undefined,
        pros: data.pros?.trim() || undefined,
        cons: data.cons?.trim() || undefined,
        vibeCheck: data.vibeCheck,
        stage: data.stage?.trim() || undefined,
        source: data.source?.trim() || undefined,
        logo: data.logo?.trim() || undefined,
      };
      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      console.error("Failed to create card:", error);
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Card</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: true })}
                placeholder="Enter title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: true })}
                placeholder="Enter name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="office"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Office
              </label>
              <input
                id="office"
                type="text"
                {...register("office")}
                placeholder="Enter office location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="compensation"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Compensation
              </label>
              <input
                id="compensation"
                type="text"
                {...register("compensation")}
                placeholder="Enter compensation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="companySize"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company Size
              </label>
              <input
                id="companySize"
                type="text"
                {...register("companySize")}
                placeholder="Enter company size"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="questions"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Questions
              </label>
              <textarea
                id="questions"
                {...register("questions")}
                placeholder="Enter questions"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="pros"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pros
              </label>
              <textarea
                id="pros"
                {...register("pros")}
                placeholder="Enter pros"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="cons"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cons
              </label>
              <textarea
                id="cons"
                {...register("cons")}
                placeholder="Enter cons"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="vibeCheck"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Vibe Check (1-5)
              </label>
              <input
                id="vibeCheck"
                type="range"
                min="1"
                max="5"
                step="1"
                {...register("vibeCheck", { valueAsNumber: true })}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                Value: {watch("vibeCheck") || 3}
              </div>
            </div>

            <div>
              <label
                htmlFor="stage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Stage
              </label>
              <input
                id="stage"
                type="text"
                {...register("stage")}
                placeholder="Enter stage"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="source"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Source
              </label>
              <input
                id="source"
                type="text"
                {...register("source")}
                placeholder="Enter source"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Logo (Image URL)
              </label>
              <input
                id="logo"
                type="text"
                {...register("logo")}
                placeholder="Enter logo image URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
