"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

interface UnSafePageProps {
  onBirthdayUpdate?: Dispatch<SetStateAction<string>>;
}

export default function UnSafePage({ onBirthdayUpdate }: UnSafePageProps) {
  const { user } = useUser();
  const [birthday, setBirthday] = useState<string>("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  // Load birthday from user's metadata when component mounts
  useEffect(() => {
    if (user?.unsafeMetadata?.birthday) {
      const birthdayValue = user.unsafeMetadata.birthday as string;
      setBirthday(birthdayValue);
      onBirthdayUpdate?.(birthdayValue);
    }
  }, [user, onBirthdayUpdate]);

  const handleUpdate = () => {
    if (!birthday) {
      setError("Please enter your birthday.");
      return;
    }
    setError("");

    user?.update({
      unsafeMetadata: { birthday },
    });

    setEditing(false); // Switch back to display mode
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Your Birthday</h2>

        {editing || !birthday ? (
          <div>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="mt-2 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleUpdate}
            >
              Update Birthday
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 text-lg">🎉 {birthday}</p>
            <button
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              onClick={() => setEditing(true)}
            >
              Change Birthday
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
