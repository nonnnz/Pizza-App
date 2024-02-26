import React from 'react';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';

import classes from './ModeToggle.module.css';

export function ModeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const toggleColorScheme = () => {
    const newColorScheme = computedColorScheme === 'light' ? 'dark' : 'light';
    // console.log('New color scheme:', newColorScheme);
    setColorScheme(newColorScheme);
  };

  return (
    <div>
        <ActionIcon
      onClick={toggleColorScheme}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
    >
      {/* <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} /> */}
            <IconSun
        style={{ display: computedColorScheme === 'dark' ? 'none' : 'block' }}
        className={cx(classes.icon)}
        stroke={1.5}
        />
        <IconMoon
        style={{ display: computedColorScheme === 'light' ? 'none' : 'block' }}
        className={cx(classes.icon)}
        stroke={1.5}
        />
        </ActionIcon> 
    </div>
    
  );
}
