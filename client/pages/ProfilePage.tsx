import React, { useState } from "react";
import Sidebar from "../Components/sidebar";

interface ProfileData {
  name: string;
  role: string;
  email: string;
  location: string;
  joinDate: string;
  company: string;
  website: string;
  bio: string;
  stats: {
    followers: number;
    following: number;
    projects: number;
  };
}

// Simple Card components to replace shadcn/ui
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`px-6 pt-6 ${className}`}>{children}</div>
);

const Icons = {
  User: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-full h-full"
    >
      <circle cx="12" cy="8" r="4" strokeWidth="2" />
      <path d="M4 20c0-4 4-8 8-8s8 4 8 8" strokeWidth="2" />
    </svg>
  ),
  Mail: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2" />
      <path d="M2 8l10 6 10-6" strokeWidth="2" />
    </svg>
  ),
  Location: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        d="M12 21c-4-4-8-7-8-12a8 8 0 1116 0c0 5-4 8-8 12z"
        strokeWidth="2"
      />
      <circle cx="12" cy="9" r="2" strokeWidth="2" />
    </svg>
  ),
  Calendar: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
      <path d="M3 10h18M8 2v4M16 2v4" strokeWidth="2" />
    </svg>
  ),
  Briefcase: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
      <path d="M8 7V4a2 2 0 012-2h4a2 2 0 012 2v3" strokeWidth="2" />
    </svg>
  ),
  Link: () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
        strokeWidth="2"
      />
      <path
        d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        strokeWidth="2"
      />
    </svg>
  ),
};

const ProfilePage: React.FC = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const profile: ProfileData = {
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    email: "sarah.j@example.com",
    location: "San Francisco, CA",
    joinDate: "January 2022",
    company: "Tech Innovations Inc",
    website: "www.sarahjdev.com",
    bio: "Passionate about building scalable web applications and contributing to open source projects. Experienced in React, TypeScript, and Node.js.",
    stats: {
      followers: 1234,
      following: 567,
      projects: 32,
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      {/* Main content */}
      <Sidebar
          isOpen={isSidebarOpen}
          activeItem={activeItem}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          onSetActiveItem={setActiveItem}
        />
      <div className="flex-1 max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {/* Profile Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-full p-4">
                  <Icons.User />
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <p className="text-gray-600">{profile.role}</p>
                  <p className="mt-2 text-gray-700">{profile.bio}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-6">
                <div className="text-center">
                  <div className="font-bold">{profile.stats.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profile.stats.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{profile.stats.projects}</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-xl font-semibold">Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icons.Mail />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icons.Location />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icons.Calendar />
                  <span>Joined {profile.joinDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icons.Briefcase />
                  <span>{profile.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icons.Link />
                  <span>{profile.website}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
