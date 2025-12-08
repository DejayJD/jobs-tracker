"use client";

import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface CardData {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

interface CardProps {
  card: CardData;
  onDelete?: (id: string) => void;
}

export function Card({ card, onDelete }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuOpen]);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (onDelete) {
      onDelete(card.id);
    }
    setMenuOpen(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow relative group"
    >
      <div className="flex items-start gap-3">
        <div {...listeners} className="flex-1 flex items-start gap-3 cursor-grab active:cursor-grabbing">
          {card.icon && (
            <div className="flex-shrink-0 mt-0.5">{card.icon}</div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm">
              {card.title}
            </div>
            {card.subtitle && (
              <div className="text-gray-600 text-sm mt-1">{card.subtitle}</div>
            )}
          </div>
        </div>
        {onDelete && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
              aria-label="More options"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
