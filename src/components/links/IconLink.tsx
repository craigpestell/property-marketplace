import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

const IconLinkVariant = [
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
] as const;

type IconLinkProps = {
  isDarkBg?: boolean;
  variant?: (typeof IconLinkVariant)[number];
  icon?: IconType | LucideIcon;
  classNames?: {
    icon?: string;
  };
} & Omit<UnstyledLinkProps, 'children'>;

const IconLink = React.forwardRef<HTMLAnchorElement, IconLinkProps>(
  (
    {
      className,
      icon: Icon,
      variant = 'outline',
      isDarkBg = false,
      classNames,
      ...rest
    },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        type='button'
        className={cn(
          'inline-flex items-center justify-center rounded font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          'min-h-[28px] min-w-[28px] p-1 md:min-h-[34px] md:min-w-[34px] md:p-2',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-500 text-white',
              'border-primary-600 border',
              'hover:bg-primary-600 hover:text-white',
              'active:bg-primary-700',
              'disabled:bg-primary-700',
            ],
            variant === 'outline' && [
              'text-primary-500 dark:text-primary-400',
              'border-primary-500 dark:border-primary-400 border',
              'hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-900/30 disabled:bg-primary-100 dark:disabled:bg-primary-900/20',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-primary-500 dark:text-primary-400',
              'shadow-none',
              'hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-900/30 disabled:bg-primary-100 dark:disabled:bg-primary-900/20',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300',
              'border border-gray-300 dark:border-gray-600',
              'hover:text-dark dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
              'active:bg-white/80 dark:active:bg-gray-800/80 disabled:bg-gray-200 dark:disabled:bg-gray-700',
            ],
            variant === 'dark' && [
              'bg-gray-900 text-white',
              'border border-gray-600',
              'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className,
        )}
        {...rest}
      >
        {Icon && <Icon size='1em' className={cn(classNames?.icon)} />}
      </UnstyledLink>
    );
  },
);

export default IconLink;
