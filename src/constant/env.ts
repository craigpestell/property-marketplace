export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

const SHOW_LOGGER =
  process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ? true : false;
export const showLogger = isLocal ? true : (SHOW_LOGGER ?? false);
