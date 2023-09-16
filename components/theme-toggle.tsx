"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className=" text-black dark:text-white bg-transparent hover:bg-gray-200 dark:hover:bg-slate-700"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

export default ThemeToggle;
