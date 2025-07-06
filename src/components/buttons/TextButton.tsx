import * as React from 'react';

import { cn } from '@/lib/utils';

const TextButtonVariant = ['primary', 'basic'] as const;

type TextButtonProps = {
  variant?: (typeof TextButtonVariant)[number];
} & React.ComponentPropsWithRef<'button'>;

const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      disabled: buttonDisabled,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type='button'
        disabled={buttonDisabled}
        className={cn(
          'button inline-flex items-center justify-center font-semibold',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'transition duration-100',
          //#region  //*=========== Variant ===========
          variant === 'primary' && [
            'text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 active:text-primary-700 dark:active:text-primary-200',
            'disabled:text-primary-200 dark:disabled:text-primary-600',
          ],
          variant === 'basic' && [
            'text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 active:text-gray-800 dark:active:text-gray-100',
            'disabled:text-gray-300 dark:disabled:text-gray-600',
          ],
          //#endregion  //*======== Variant ===========
          'disabled:cursor-not-allowed disabled:brightness-105 disabled:hover:underline',
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export default TextButton;
