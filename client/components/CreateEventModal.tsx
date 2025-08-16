import React, { useState } from "react";
import { WayfeelEvent } from "@/types/events";
import { emojiMap } from "@/lib/constants";

export default function CreateEventModal({
  start, end, onCancel, onCreate,
}: {
  start: Date;
  end: Date;
  onCancel: () => void;
  onCreate: (event: WayfeelEvent) => void;
}) {
  const [title, setTitle] = useState("");
  const [emojiId, setEmojiId] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">New Wayfeel event</h2>

        <input
          className="w-full border rounded-lg p-2 mb-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="flex gap-3 mb-4">
          {[1,2,3,4,5].map(id => (
            <button
              key={id}
              onClick={() => setEmojiId(id)}
              className={`p-2 rounded-xl border ${emojiId===id ? "border-blue-500" : "border-gray-300"}`}
              title={`mood-${id}`}
            >
              <img src={emojiMap[id]} alt={`m-${id}`} className="w-10 h-10" />
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-2 rounded bg-gray-200">Cancel</button>
          <button
            onClick={() => {
              onCreate({
                id: `wf:${crypto.randomUUID()}`,
                start, end,
                title: title || "(untitled)",
                source: "wayfeel",
                emojiId: emojiId ?? undefined,
                imageUrl: emojiId ? emojiMap[emojiId] : undefined,
              });
            }}
            className="px-3 py-2 rounded bg-green-600 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
