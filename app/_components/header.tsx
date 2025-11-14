import React from "react";

interface HeaderProps {
  subtitle: string;
  title: string;
  action?: React.ReactNode;
}

const Header = ({ subtitle, title, action }: HeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500">{subtitle}</span>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {action}
    </div>
  );
};

export default Header;
