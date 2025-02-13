import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from "next/router";

export default function UnSafePage() {
  const { user } = useUser();
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpdate = () => {
    if (!birthday) {
      setError("Please enter your birthday.");
      return;
    }
    setError("");
    user?.update({
      unsafeMetadata: { birthday },
    });
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">Enter Your Birthday</h2>
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
    </div>
  );
}
