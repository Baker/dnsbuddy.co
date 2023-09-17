'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      className=' bg-transparent text-black hover:bg-gray-200 dark:text-white dark:hover:bg-slate-700'
      id='theme-toggle'
      name='theme-toggle'
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
    >
      <span className='sr-only'>
        {theme === 'light' ? 'Turn on darkmode' : 'Turn on lightmode'}
      </span>
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

export default ThemeToggle;
