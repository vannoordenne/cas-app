# CAS Student Rating Platform

A Next.js application for rating and feedback between students and teachers.

## Features

- Student and teacher authentication
- Rating system
- Profile management
- Leaderboard
- Real-time updates

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/echo-rating-platform.git
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file with the following variables:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your-database-url
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment

This project is configured for deployment on Vercel. See the [Vercel documentation](https://vercel.com/docs) for more information.
