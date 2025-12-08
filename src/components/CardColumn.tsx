"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardData } from "./Card";

interface CardColumnProps {
  id: string;
  title: string;
  cards: CardData[];
  onAddCard?: () => void;
  onDeleteCard?: (id: string) => void;
}

export function CardColumn({ id, title, cards, onAddCard, onDeleteCard }: CardColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div
        ref={setNodeRef}
        className="flex-1 bg-white rounded-lg p-4 border-2 border-solid border-gray-300 min-h-[500px] shadow-sm"
      >
        <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <Card key={card.id} card={card} onDelete={onDeleteCard} />
          ))}
          {onAddCard && (
            <button
              onClick={onAddCard}
              className="w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-400 p-6 flex items-center justify-center hover:border-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg
                className="w-8 h-8 text-gray-500"
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
