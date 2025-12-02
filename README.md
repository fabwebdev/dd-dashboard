# Oregon I/DD Market Analysis Dashboard

A comprehensive market analysis dashboard for Oregon Developmental Disabilities (I/DD) services, developed by VYRITE, LLC. This application provides strategic insights for service providers looking to enter or expand within the Oregon market.

## Features

- **County-Level Analysis**: detailed breakdown of all 36 Oregon counties.
- **Opportunity Scoring**: Proprietary scoring model evaluating market attractiveness based on unmet needs, competition, and growth.
- **Interactive Visualizations**:
  - Top 10 Opportunities
  - Tier Distribution
  - Investment Level Analysis
- **Strategic Filtering**: Filter markets by Tier, Unmet Need, Competition Level, and Market Entry Ease.
- **Detailed Reports**: In-depth modal views for each county with executive summaries, risk assessments, and financial projections.
- **Authentication**: Secure access control (currently configured with demo credentials).

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Cloudflare Pages

This application is optimized for deployment on Cloudflare Pages using the `@cloudflare/next-on-pages` adapter.

### Build Command

The project uses `npm run pages:build` to generate the worker-compatible output.

```bash
npm run pages:build
```

### Deploy

To deploy to Cloudflare Pages:

```bash
npm run pages:deploy
```

### Configuration

Deployment settings are managed in `wrangler.toml`. The build output directory is set to `.vercel/output/static` to be compatible with Cloudflare's expectation for Next.js static exports or the `next-on-pages` output structure.

## License

&copy; 2025 VYRITE LLC. All rights reserved.
Oregon I/DD Market Analysis™ is a trademark of VYRITE, LLC.
