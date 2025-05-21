"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import NavLink from "./NavLink";

type HeaderProps = {
  user: any;
};

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
    handleClose();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className='sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center'>
            <Image
              src='/orime.svg'
              alt='Orime Logo'
              width={100}
              height={40}
              className='cursor-pointer hover:opacity-90 transition-opacity'
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex gap-6 text-sm font-medium'>
            <NavLink title='Product' />
            <NavLink title='Solutions' />
            <NavLink title='Resources' />
            <Link
              href='#'
              className='text-gray-600 hover:text-black transition-colors'
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden flex items-center'
          onClick={toggleMobileMenu}
          aria-label='Toggle menu'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            className='w-6 h-6 text-gray-700'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d={
                mobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        {/* Right Side Navigation */}
        <div className='hidden md:flex items-center gap-4 text-sm font-medium'>
          {/* <Link
            href='#'
            className='text-gray-600 hover:text-black transition-colors'
          >
            Contact Sales
          </Link> */}
          {user ? (
            <>
              <IconButton
                size='small'
                onClick={handleMenu}
                aria-label='Account menu'
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#1e40af",
                    fontSize: "0.875rem",
                  }}
                  src={user.photoURL || undefined}
                >
                  {user.email?.charAt(0).toUpperCase() || "?"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    borderRadius: "0.5rem",
                    minWidth: "200px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    router.push("/dashboard");
                    handleClose();
                  }}
                  sx={{ fontSize: "0.875rem", py: 1.5 }}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/profile");
                    handleClose();
                  }}
                  sx={{ fontSize: "0.875rem", py: 1.5 }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{ fontSize: "0.875rem", py: 1.5, color: "#ef4444" }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <div className='flex items-center gap-4'>
              <Link
                href='/auth/login'
                className='text-gray-600 hover:text-black transition-colors'
              >
                Log in
              </Link>
              <Link
                href='/auth/register'
                className='text-white px-5 py-2 rounded-lg transition-all shadow-sm hover:shadow-md'
                style={{ backgroundColor: "#1e40af" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#152e67")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1e40af")
                }
              >
                Sign up free
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg'>
          <nav className='flex flex-col gap-4 text-base font-medium'>
            <Link href='#' className='text-gray-700 hover:text-[#1e40af] py-2'>
              Product
            </Link>
            <Link href='#' className='text-gray-700 hover:text-[#1e40af] py-2'>
              Solutions
            </Link>
            <Link href='#' className='text-gray-700 hover:text-[#1e40af] py-2'>
              Resources
            </Link>
            <Link href='#' className='text-gray-700 hover:text-[#1e40af] py-2'>
              Pricing
            </Link>
            <Link href='#' className='text-gray-700 hover:text-[#1e40af] py-2'>
              Contact Sales
            </Link>

            {user ? (
              <>
                <Link
                  href='/dashboard'
                  className='text-gray-700 hover:text-[#1e40af] py-2'
                >
                  Dashboard
                </Link>
                <Link
                  href='/profile'
                  className='text-gray-700 hover:text-[#1e40af] py-2'
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className='text-left text-red-500 hover:text-red-600 py-2'
                >
                  Logout
                </button>
              </>
            ) : (
              <div className='flex flex-col gap-3 mt-2'>
                <Link
                  href='/auth/login'
                  className='text-gray-700 hover:text-[#1e40af] py-2'
                >
                  Log in
                </Link>
                <Link
                  href='/auth/register'
                  className='text-white px-4 py-3 rounded-lg transition-all shadow-sm text-center'
                  style={{ backgroundColor: "#1e40af" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#152e67")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1e40af")
                  }
                >
                  Sign up free
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
