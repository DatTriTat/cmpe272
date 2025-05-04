import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
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
            FedBridge
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          {!loading && user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button variant="light" isIconOnly>
                  <Avatar
                    name={user.email}
                    src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
                    size="sm"
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu">
                <DropdownItem
                  key="profile"
                  startContent={<Icon icon="lucide:user" />}
                  onPress={() => navigate("/profile")}
                >
                  Profile
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
          ) : (
            !loading && (
              <>
                <NavbarItem>
                  <Button
                    as={RouterLink}
                    to="/sign-in"
                    variant="light"
                    color="primary"
                  >
                    Sign In
                  </Button>
                </NavbarItem>
                <NavbarItem>
                  <Button as={RouterLink} to="/sign-up" color="primary">
                    Sign Up
                  </Button>
                </NavbarItem>
              </>
            )
          )}
        </NavbarContent>
      </Navbar>
      <main className="flex-grow">{children}</main>
      <footer className="py-8 bg-content1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">JobMatcher</h3>
              <p className="text-default-500">
                Find your dream job with AI-powered matching and interview
                preparation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features">Features</Link>
                </li>
                <li>
                  <Link href="#how-it-works">How It Works</Link>
                </li>
                <li>
                  <Link href="#testimonials">Testimonials</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-default-500">
                support@jobmatcher.com
                <br />
                123 Main Street
                <br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-divider text-center text-default-500">
            <p>© {new Date().getFullYear()} JobMatcher. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
