"use client";

import React from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { DealDoc, DealStage, PIPELINE_STAGES } from "@/services/pipeline.service";
import { PipelineColumn } from "./PipelineColumn";
import { DealCard } from "./DealCard";
import { createPortal } from "react-dom";

interface PipelineBoardProps {
    deals: DealDoc[];
    onStageChange: (dealId: string, newStage: DealStage) => void;
    onDealClick: (deal: DealDoc) => void;
    onAddDeal: (stage: DealStage) => void;
}

export function PipelineBoard({ deals, onStageChange, onDealClick, onAddDeal }: PipelineBoardProps) {
    const [activeDeal, setActiveDeal] = React.useState<DealDoc | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const dealsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
        acc[stage] = deals.filter((d) => d.stage === stage);
        return acc;
    }, {} as Record<DealStage, DealDoc[]>);

    function handleDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Deal") {
            setActiveDeal(event.active.data.current.deal);
        }
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id.toString();
        const overId = over.id.toString();

        if (activeId === overId) return;

        const isActiveADeal = active.data.current?.type === "Deal";
        const isOverADeal = over.data.current?.type === "Deal";
        const isOverAColumn = over.data.current?.type === "Column";

        if (!isActiveADeal) return;

        // Dropping over another deal
        if (isActiveADeal && isOverADeal) {
            const activeDealObj = active.data.current?.deal as DealDoc | undefined;
            const overDealObj = over.data.current?.deal as DealDoc | undefined;

            if (activeDealObj && overDealObj && activeDealObj.stage !== overDealObj.stage) {
                onStageChange(activeDealObj.id, overDealObj.stage);
            }
        }

        // Dropping over a column
        if (isActiveADeal && isOverAColumn) {
            const activeDealObj = active.data.current?.deal as DealDoc | undefined;
            const overColumnStage = over.data.current?.stage as DealStage | undefined;

            if (activeDealObj && overColumnStage && activeDealObj.stage !== overColumnStage) {
                onStageChange(activeDealObj.id, overColumnStage);
            }
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveDeal(null);
    }

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-4 pb-8 overflow-x-auto min-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {PIPELINE_STAGES.map((stage) => (
                    <PipelineColumn
                        key={stage}
                        stage={stage}
                        deals={dealsByStage[stage]}
                        onDealClick={onDealClick}
                        onAddDeal={onAddDeal}
                    />
                ))}
            </div>

            {typeof document !== "undefined" &&
                createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeDeal ? (
                            <div className="w-72 rotate-3 opacity-90 scale-105 transition-all">
                                <DealCard deal={activeDeal} onClick={() => { }} />
                            </div>
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}
        </DndContext>
    );
}
