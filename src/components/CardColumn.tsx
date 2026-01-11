"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, JobApplication } from "./Card";

interface CardColumnProps {
  id: string;
  title: string;
  cards: JobApplication[];
  onAddCard?: () => void;
  onDeleteCard?: (id: string) => void;
  onCardClick?: (card: JobApplication) => void;
}

export function CardColumn({ id, title, cards, onAddCard, onDeleteCard, onCardClick }: CardColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full min-h-0 w-80 shrink-0">
      <div className="mb-2 shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 bg-white rounded-lg p-3 border-2 border-solid border-gray-300 shadow-sm overflow-y-auto min-h-0"
      >
        <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <div key={card.id} className="mb-3">
              <Card 
                card={card} 
                onDelete={onDeleteCard} 
                onClick={onCardClick ? (c) => {
                  if ('companyName' in c) {
                    onCardClick(c);
                  }
                } : undefined} 
                isJobApplication={true} 
              />
            </div>
          ))}
          {onAddCard && (
            <button
              onClick={onAddCard}
              className="w-full h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors cursor-pointer mt-3"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
