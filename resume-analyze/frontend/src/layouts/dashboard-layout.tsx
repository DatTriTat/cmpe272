import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";
import { AlertPopup } from "../components/AlertPopup";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Profile", path: "/profile", icon: "lucide:user" },
    {
      name: "Chat Interview",
      path: "/interview/chat",
      icon: "lucide:message-circle",
    },
    { name: "Upload Resume", path: "/resume/upload", icon: "lucide:file-plus" },
    {
      name: "Resume Analysis",
      path: "/resume/analysis",
      icon: "lucide:file-text",
    },
    {
      name: "Jobs Search",
      path: "/jobs",
      icon: "lucide:briefcase",
    },
    {
      name: "Saved Paths",
      path: "/career-paths/saved",
      icon: "lucide:bookmark",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar maxWidth="xl" className="shadow-sm">
        <NavbarBrand>
          <Link
            as={RouterLink}
            to="/"
            className="flex items-center gap-2 text-primary font-bold text-xl"
          >
            <Icon icon="lucide:briefcase" width={24} height={24} />
            FedBrigde
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <Avatar
                  name="John Doe"
                  src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
                  size="sm"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem
                key="profile"
                startContent={<Icon icon="lucide:user" />}
              >
                Profile
              </DropdownItem>
              <DropdownItem
                key="settings"
                startContent={<Icon icon="lucide:settings" />}
              >
                Settings
              </DropdownItem>
              <DropdownItem
                key="help"
                startContent={<Icon icon="lucide:help-circle" />}
              >
                Help & Feedback
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<Icon icon="lucide:log-out" />}
                onPress={logout}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-content1 border-r border-divider hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  {item.name === "Resume Analysis" ? (
                    <button
                      onClick={() => {
                        const stored = localStorage.getItem(
                          "resumeAnalysisResult"
                        );
                        if (
                          stored &&
                          stored !== "undefined" &&
                          stored !== "null"
                        ) {
                          navigate(item.path);
                        } else {
                          setShowAlert(true);
                        }
                      }}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "bg-primary text-white"
                          : "text-primary hover:bg-content2"
                      }`}
                    >
                      <Icon icon={item.icon} width={20} height={20} />
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      as={RouterLink}
                      to={item.path}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? "bg-primary text-white"
                          : "hover:bg-content2"
                      }`}
                    >
                      <Icon icon={item.icon} width={20} height={20} />
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-content1 border-t border-divider md:hidden z-10">
          <nav className="flex justify-around py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                as={RouterLink}
                to={item.path}
                className={`flex flex-col items-center p-2 ${
                  isActive(item.path) ? "text-primary" : "text-default-500"
                }`}
              >
                <Icon icon={item.icon} width={24} height={24} />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
          {children}
        </main>
        {showAlert && (
          <AlertPopup
            message="Upload needed to view analysis."
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
