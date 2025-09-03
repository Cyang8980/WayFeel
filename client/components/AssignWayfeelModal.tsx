import React, { useState } from "react";
import Image from "next/image";
import { WayfeelEvent } from "@/types/events";
import { emojiMap } from "@/lib/constants";

export default function AssignWayfeelModal({
  event,
  onCancel,
  onSave,
}: {
  event: WayfeelEvent; // must be a gcal event
  onCancel: () => void;
  onSave: (updated: WayfeelEvent) => void;
}) {
  const [emojiId, setEmojiId] = useState<number | null>(null);
  const [description, setDescription] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Add Wayfeel details</h2>

        <div className="flex gap-3 mb-4">
          {[1,2,3,4,5].map(id => (
            <button
              key={id}
              onClick={() => setEmojiId(id)}
              className={`p-2 rounded-xl border ${emojiId===id ? "border-blue-500" : "border-gray-300"}`}
              title={`mood-${id}`}
            >
              <Image src={emojiMap[id]} alt={`m-${id}`} width={40} height={40} className="w-10 h-10" />
            </button>
          ))}
        </div>

        <textarea
          className="w-full border rounded-lg p-2 mb-4"
          rows={3}
          placeholder="Add a short description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
          <button
            onClick={() => {
              onSave({
                ...event,
                source: "wayfeel",
                emojiId: emojiId ?? undefined,
                imageUrl: emojiId ? emojiMap[emojiId] : undefined,
                description: description || undefined,
              });
            }}
            disabled={!emojiId}
            className="px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
