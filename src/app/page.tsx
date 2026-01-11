"use client";

import { useState, useEffect, useRef } from "react";
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
import { Card, CardData } from "@/components/Card";
import { CreateCardModal } from "@/components/CreateCardModal";
import { ViewCardModal } from "@/components/ViewCardModal";
import {
  getBoardData,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  createColumn,
  BoardData as APIBoardData,
  Column,
  JobApplication,
} from "@/lib/api";

interface BoardData {
  columns: Column[];
  applications: Record<string, JobApplication[]>;
}

export default function Home() {
  const [boardData, setBoardData] = useState<BoardData>({
    columns: [],
    applications: {},
  });
  const [activeCard, setActiveCard] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<JobApplication | null>(null);
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const isProcessingDrag = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getBoardData();
        console.log('Fetched board data:', data);
        console.log('Columns:', data.columns);
        console.log('Applications by column:', Object.entries(data.applications).map(([colId, apps]) => ({
          columnId: colId,
          appCount: apps.length,
          apps: apps.map(a => ({ id: a.id, companyName: a.companyName }))
        })));
        setBoardData(data);
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

    if (!over) {
      console.log("Drag ended with no over target");
      return;
    }

    // Prevent double-processing if this function is called multiple times
    if (isProcessingDrag.current) {
      console.log("Drag end already being processed, skipping");
      return;
    }
    isProcessingDrag.current = true;

    try {
      const cardId = String(active.id);
      const sourceColumn = findColumnByCardId(cardId);
      
      // If dropped on a card, find which column that card belongs to
      let destinationColumn = String(over.id);
      const droppedOnCard = findColumnByCardId(destinationColumn);
      if (droppedOnCard) {
        // If we dropped on a card, use that card's column as the destination
        destinationColumn = droppedOnCard;
      }

      console.log("Drag end:", {
        cardId,
        sourceColumn,
        destinationColumn,
        overId: over.id,
        overIdType: typeof over.id,
        droppedOnCard,
      });

      if (!sourceColumn) {
        console.warn("Could not find source column for card:", cardId);
        return;
      }

      // Check if destination is a valid column ID
      const isValidColumn = boardData.columns.some(col => String(col.id) === destinationColumn);
      if (!isValidColumn) {
        console.warn("Invalid destination column:", destinationColumn);
        return;
      }

      if (sourceColumn === destinationColumn) {
        console.log("Card dropped in same column, no update needed");
        return;
      }

      // Optimistically update UI
      const card = findCardById(cardId);
      if (!card) return;

    setBoardData((prev) => {
      const newData = { ...prev };
      // Ensure we're using string keys
      const sourceColStr = String(sourceColumn);
      const destColStr = String(destinationColumn);
      
      console.log("Updating board data:", {
        sourceColStr,
        destColStr,
        sourceColApps: newData.applications[sourceColStr]?.length || 0,
        destColApps: newData.applications[destColStr]?.length || 0,
      });

      // Remove from source column
      newData.applications[sourceColStr] = (newData.applications[sourceColStr] || []).filter(
        (c) => c.id !== cardId
      );
      
      // Add to destination column, but only if it's not already there
      const destCards = newData.applications[destColStr] || [];
      const cardAlreadyInDest = destCards.some((c) => c.id === cardId);
      if (!cardAlreadyInDest) {
        // Update the card's currentColumn property to match the destination
        const updatedCard = { ...card, currentColumn: destColStr };
        newData.applications[destColStr] = [...destCards, updatedCard];
      }
      
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
        setBoardData(apiData);
      }
    } finally {
      isProcessingDrag.current = false;
    }
  }

  function findCardById(id: string): JobApplication | null {
    for (const cards of Object.values(boardData.applications)) {
      const card = cards.find((c: JobApplication) => c.id === id);
      if (card) return card;
    }
    return null;
  }

  function findColumnByCardId(id: string): string | null {
    for (const [columnId, cards] of Object.entries(boardData.applications)) {
      if (cards.some((c: JobApplication) => c.id === id)) {
        return columnId;
      }
    }
    return null;
  }

  function handleAddCard(columnId: string) {
    setSelectedColumn(columnId);
    setIsModalOpen(true);
  }

  async function handleCreateCard(data: {
    title: string;
    name: string;
    office?: string;
    compensation?: string;
    companySize?: string;
    notes?: string;
    status?: string;
    nextInterviewDate?: string;
    nextInterviewType?: string;
    vibeCheck?: number;
    source?: string;
    logo?: string;
  }) {
    if (!selectedColumn) return;

    try {
      const newApplication = await createJobApplication({
        companyName: data.title,
        jobTitle: data.name,
        currentColumn: selectedColumn,
        office: data.office ?? null,
        compensation: data.compensation ?? null,
        companySize: data.companySize ?? null,
        notes: data.notes ?? null,
        status: data.status ?? null,
        nextInterviewDate: data.nextInterviewDate ?? null,
        nextInterviewType: data.nextInterviewType ?? null,
        vibeCheck: data.vibeCheck ?? null,
        source: data.source ?? null,
        logo: data.logo ?? null,
      });
      setBoardData((prev) => ({
        ...prev,
        applications: {
          ...prev.applications,
          [selectedColumn]: [
            ...(prev.applications[selectedColumn] || []),
            newApplication,
          ],
        },
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
        newData.applications[columnId] = newData.applications[columnId].filter(
          (c) => c.id !== cardId
        );
        return newData;
      });

      await deleteJobApplication(cardId);
    } catch (err) {
      console.error("Failed to delete card:", err);
      setError("Failed to delete card");
      // Revert optimistic update on error
      const apiData = await getBoardData();
      setBoardData(apiData);
    }
  }

  function handleCardClick(card: CardData | JobApplication) {
    if ("companyName" in card) {
      // It's a JobApplication
      setSelectedCard(card as JobApplication);
      setIsViewModalOpen(true);
    }
  }

  async function handleUpdateCard(
    id: string,
    data: {
      title: string;
      name: string;
      office?: string;
      compensation?: string;
      companySize?: string;
      notes?: string;
      status?: string;
      nextInterviewDate?: string;
      nextInterviewType?: string;
      vibeCheck?: number;
      stage?: string;
      source?: string;
      logo?: string;
    }
  ) {
    try {
      const updatedApplication = await updateJobApplication(id, {
        companyName: data.title,
        jobTitle: data.name || null,
        office: data.office ?? null,
        compensation: data.compensation ?? null,
        companySize: data.companySize ?? null,
        notes: data.notes ?? null,
        status: data.status ?? null,
        nextInterviewDate: data.nextInterviewDate ?? null,
        nextInterviewType: data.nextInterviewType ?? null,
        vibeCheck: data.vibeCheck ?? null,
        source: data.source ?? null,
        logo: data.logo ?? null,
      });

      // Update the card in the board data
      setBoardData((prev) => {
        const newData = { ...prev };
        for (const columnId of Object.keys(newData.applications)) {
          const index = newData.applications[columnId].findIndex((c) => c.id === id);
          if (index !== -1) {
            newData.applications[columnId][index] = updatedApplication;
            break;
          }
        }
        return newData;
      });

      // Update selected card if it's the one being edited
      if (selectedCard && selectedCard.id === id) {
        setSelectedCard(updatedApplication);
      }
    } catch (err) {
      console.error("Failed to update card:", err);
      setError("Failed to update card");
      throw err;
    }
  }

  async function handleCreateColumn() {
    if (!newColumnName.trim()) return;

    try {
      const newColumn = await createColumn({ name: newColumnName.trim() });
      setBoardData((prev) => ({
        ...prev,
        columns: [...prev.columns, newColumn].sort((a, b) => a.order - b.order),
        applications: {
          ...prev.applications,
          [newColumn.id]: [],
        },
      }));
      setNewColumnName("");
      setIsCreateColumnModalOpen(false);
    } catch (err) {
      console.error("Failed to create column:", err);
      setError("Failed to create column");
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gray-100 p-2 flex items-center justify-center">
        <div className="text-gray-600">Loading board data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-gray-100 p-2 flex items-center justify-center">
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
    <div className="h-screen bg-gray-100 p-6 overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto h-full w-full overflow-x-auto overflow-y-hidden flex-1 min-h-0">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-row gap-3 h-full w-max min-w-full">
            {boardData.columns.map((column) => {
              const columnId = String(column.id);
              return (
                <CardColumn
                  key={columnId}
                  id={columnId}
                  title={column.name}
                  cards={boardData.applications[columnId] || []}
                  onAddCard={() => handleAddCard(columnId)}
                  onDeleteCard={handleDeleteCard}
                  onCardClick={handleCardClick}
                />
              );
            })}
          </div>
          <DragOverlay>
            {activeCard ? (
              <Card card={activeCard} isJobApplication={true} />
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
        <ViewCardModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedCard(null);
          }}
          onUpdate={handleUpdateCard}
          jobApplication={selectedCard}
        />
        {isCreateColumnModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Column</h2>
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Column name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreateColumn();
                  } else if (e.key === "Escape") {
                    setIsCreateColumnModalOpen(false);
                    setNewColumnName("");
                  }
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setIsCreateColumnModalOpen(false);
                    setNewColumnName("");
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateColumn}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}