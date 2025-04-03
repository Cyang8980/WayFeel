"use client";

import { UserButton } from "@clerk/nextjs";
import UnSafePage from "../pages/dob/dobPrompt";

const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

export const CustomUserButton = () => {
  return (
    <UserButton>
      <UserButton.UserProfilePage
        label="Birthday"
        url="custom"
        labelIcon={<DotIcon />}
      >
        <div>
          <UnSafePage />
        </div>
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage label="account" />
    </UserButton>
  );
};
