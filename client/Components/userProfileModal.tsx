import { Button } from "@mui/material";
import { useClerk } from "@clerk/nextjs";

export function CustomUserProfileButton() {
  const { openUserProfile } = useClerk(); // Clerk function to open the default modal

  return (
    <Button onClick={() => openUserProfile()} variant="contained" color="primary">
      Open User Profile
    </Button>
  );
}
