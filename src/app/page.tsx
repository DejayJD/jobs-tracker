"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CardColumn } from "@/components/CardColumn";
import { CardData } from "@/components/Card";
import { CreateCardModal } from "@/components/CreateCardModal";
import {
  getBoardData,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  BoardData as APIBoardData,
} from "@/lib/api";

type ColumnId = "inMotion" | "sentApps";

interface BoardData {
  inMotion: CardData[];
  sentApps: CardData[];
}

function getIconComponent() {
  return (
    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
      <svg
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5z" />
      </svg>
    </div>
  );
}

function transformAPIDataToCardData(apiData: APIBoardData): BoardData {
  return {
    inMotion: apiData.inMotion.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      icon: getIconComponent(),
    })),
    sentApps: apiData.sentApps.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      icon: getIconComponent(),
    })),
  };
}

export default function Home() {
  const [boardData, setBoardData] = useState<BoardData>({
    inMotion: [],
    sentApps: [],
  });
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<ColumnId | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getBoardData();
        setBoardData(transformAPIDataToCardData(data));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch board data:", err);
        setError("Failed to load board data. Make sure the server is running.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const card = findCardById(active.id as string);
    setActiveCard(card);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id as string;
    const sourceColumn = findColumnByCardId(cardId);
    const destinationColumn = over.id as ColumnId;

    if (!sourceColumn || sourceColumn === destinationColumn) return;

    // Optimistically update UI
    const card = findCardById(cardId);
    if (!card) return;

    setBoardData((prev) => {
      const newData = { ...prev };
      newData[sourceColumn] = newData[sourceColumn].filter(
        (c) => c.id !== cardId
      );
      newData[destinationColumn] = [...newData[destinationColumn], card];
      return newData;
    });

    // Update in backend
    try {
      await updateJobApplication(cardId, {
        currentColumn: destinationColumn,
      });
    } catch (err) {
      console.error("Failed to update card:", err);
      // Revert optimistic update on error
      const apiData = await getBoardData();
      setBoardData(transformAPIDataToCardData(apiData));
    }
  }

  function findCardById(id: string): CardData | null {
    for (const column of Object.values(boardData)) {
      const card = column.find((c: CardData) => c.id === id);
      if (card) return card;
    }
    return null;
  }

  function findColumnByCardId(id: string): ColumnId | null {
    for (const [columnId, cards] of Object.entries(boardData)) {
      if (cards.some((c: CardData) => c.id === id)) {
        return columnId as ColumnId;
      }
    }
    return null;
  }

  function handleAddCard(columnId: ColumnId) {
    setSelectedColumn(columnId);
    setIsModalOpen(true);
  }

  async function handleCreateCard(data: {
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
  }) {
    if (!selectedColumn) return;

    try {
      const newApplication = await createJobApplication({
        companyName: data.title,
        jobTitle: data.name,
        currentColumn: selectedColumn,
        recruiterId: null,
        office: data.office ?? null,
        compensation: data.compensation ?? null,
        companySize: data.companySize ?? null,
        questions: data.questions ?? null,
        pros: data.pros ?? null,
        cons: data.cons ?? null,
        vibeCheck: data.vibeCheck ?? null,
        stage: data.stage ?? null,
        source: data.source ?? null,
        logo: data.logo ?? null,
      });
      const newCard: CardData = {
        id: newApplication.id,
        title: newApplication.companyName,
        subtitle: newApplication.jobTitle || undefined,
        icon: getIconComponent(),
      };
      setBoardData((prev) => ({
        ...prev,
        [selectedColumn]: [...prev[selectedColumn], newCard],
      }));
    } catch (err) {
      console.error("Failed to create card:", err);
      setError("Failed to create new card");
      throw err;
    }
  }

  async function handleDeleteCard(cardId: string) {
    try {
      const columnId = findColumnByCardId(cardId);
      if (!columnId) return;

      // Optimistically remove from UI
      setBoardData((prev) => {
        const newData = { ...prev };
        newData[columnId] = newData[columnId].filter((c) => c.id !== cardId);
        return newData;
      });

      await deleteJobApplication(cardId);
    } catch (err) {
      console.error("Failed to delete card:", err);
      setError("Failed to delete card");
      // Revert optimistic update on error
      const apiData = await getBoardData();
      setBoardData(transformAPIDataToCardData(apiData));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading board data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="text-red-600 bg-red-50 p-4 rounded-lg">
          {error}
          <div className="text-sm mt-2 text-gray-600">
            Make sure the backend server is running on port 3001
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <CardColumn
              id="inMotion"
              title="In Motion"
              cards={boardData.inMotion}
              onAddCard={() => handleAddCard("inMotion")}
              onDeleteCard={handleDeleteCard}
            />
            <CardColumn
              id="sentApps"
              title="Sent Apps"
              cards={boardData.sentApps}
              onAddCard={() => handleAddCard("sentApps")}
              onDeleteCard={handleDeleteCard}
            />
          </div>
          <DragOverlay>
            {activeCard ? (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64">
                <div className="flex items-start gap-3">
                  {activeCard.icon && (
                    <div className="shrink-0 mt-0.5">{activeCard.icon}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm">
                      {activeCard.title}
                    </div>
                    {activeCard.subtitle && (
                      <div className="text-gray-600 text-sm mt-1">
                        {activeCard.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <CreateCardModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedColumn(null);
          }}
          onSubmit={handleCreateCard}
          defaultColumn={selectedColumn || undefined}
        />
      </div>
    </div>
  );
}