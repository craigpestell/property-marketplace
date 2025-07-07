// Font Comparison: Sans-Serif Options for Real Estate Marketplace

/**
 * OPTION 1: Poppins + Lato (Current)
 * - Heading: Poppins (geometric, modern, rounded)
 * - Body: Lato (clean, neutral, highly readable)
 * - Characteristics: Contemporary, friendly yet professional
 * - Letter spacing: Normal
 */

/**
 * OPTION 2: Outfit + Work Sans
 * - Heading: Outfit (geometric, modern with unique character)
 * - Body: Work Sans (clean, slightly more personality than Lato)
 * - Characteristics: Modern, distinctive, tech-forward
 * - Letter spacing: Tight (would be adjusted to normal if selected)
 */

// To switch back to Outfit + Work Sans, use this configuration:
/*
theme: {
  extend: {
    fontFamily: {
      primary: ['Inter', ...defaultTheme.fontFamily.sans],
      heading: ['Outfit', ...defaultTheme.fontFamily.sans],
      body: ['Work Sans', ...defaultTheme.fontFamily.sans],
    },
  }
}
*/

// Example styling with Outfit + Work Sans:
/*
  .h0 {
    @apply font-heading text-3xl font-bold md:text-5xl tracking-normal;
  }

  h1,
  .h1 {
    @apply font-heading text-2xl font-bold md:text-4xl tracking-normal;
  }

  h2,
  .h2 {
    @apply font-heading text-xl font-bold md:text-3xl tracking-normal;
  }

  h3,
  .h3 {
    @apply font-heading text-lg font-semibold md:text-2xl tracking-normal;
  }

  h4,
  .h4 {
    @apply font-heading text-base font-semibold md:text-lg tracking-normal;
  }
*/

// Key differences between the options:

/**
 * Poppins (current heading)
 * - More rounded letterforms
 * - Slightly taller x-height
 * - More geometric feel
 * - Very popular in modern web design
 * - Great readability at various sizes
 */

/**
 * Outfit (alternative heading)
 * - More neutral, slightly squarer letterforms
 * - More consistent stroke width
 * - Slightly more compact
 * - Less common, more distinctive
 * - Modern but less geometric than Poppins
 */

/**
 * Lato (current body)
 * - Very neutral and clean
 * - Excellent readability
 * - Slightly more compact
 * - Classic feel, widely used
 */

/**
 * Work Sans (alternative body)
 * - Slightly more personality and character
 * - Still very readable
 * - More modern feel
 * - Pairs well with geometric headings
 */

// Visual impact considerations:

/**
 * Poppins + Lato (current)
 * - Friendly, approachable
 * - Very readable
 * - Modern but safe choice
 * - Works well for broad audience
 */

/**
 * Outfit + Work Sans
 * - More distinctive, unique identity
 * - Still very readable
 * - More cutting-edge feel
 * - Slightly more "design-forward" look
 */
