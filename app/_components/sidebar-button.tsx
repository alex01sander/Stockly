"use client";
import React from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarButtonProps {
  href: string;
  children: React.ReactNode;
}

const SidebarButton = ({ href, children }: SidebarButtonProps) => {
  const pathname = usePathname();
  return (
    <Button
      variant={pathname === `${href}` ? "secondary" : "ghost"}
      className="justify-start gap-2"
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

export default SidebarButton;
