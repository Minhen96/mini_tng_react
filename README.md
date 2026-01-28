# Mini TNG Frontend

A modern, premium wallet application frontend built with React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication** - Secure login with JWT tokens
- **Wallet Dashboard** - View balance with elegant UI design
- **Top Up** - Add funds to your wallet
- **Transfer** - Send money to other users via email
- **Transaction History** - View all transactions with virtual scrolling
- **Transaction Details** - Detailed view of individual transactions

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **Axios** for API calls
- **TanStack Virtual** for virtualized transaction lists
- **Lucide React** for icons

## Screenshots

### Login Page
![Login Page](https://github.com/user-attachments/assets/ac571c49-ed4f-4a7d-bc57-3e54d76264ea)

### Home Page
![Home Page](https://github.com/user-attachments/assets/96356bbb-e6ff-40eb-a0fb-141373a65456)

### Transfer Page
![Transfer Page](https://github.com/user-attachments/assets/df62495f-3430-4259-ab3b-4126087c7345)

### Transaction History
![Transaction History](https://github.com/user-attachments/assets/263d0c6e-2f55-4a59-9678-1551557d0dcc)

### Transaction Details
![Transaction Details](https://github.com/user-attachments/assets/1c40fad5-ca4f-42fc-9d5f-0042b679c50d)

- **Theme**: Minimalist Monochrome with Blue Accent (`#4a9eff`)
- **Glass Cards**: Frosted glass effect with subtle borders
- **Transaction Colors**:
  - Top Up: Blue (accent)
  - Transfer In: Green (emerald)
  - Transfer Out: Red
- **Mobile-First**: Responsive design optimized for all devices

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── lib/               # Axios client configuration
├── pages/             # Page components
│   ├── HomePage.tsx       # Dashboard with balance & recent transactions
│   ├── LoginPage.tsx      # User authentication
│   ├── TopUpPage.tsx      # Add funds
│   ├── TransferPage.tsx   # Send money
│   ├── TransactionHistoryPage.tsx  # All transactions
│   └── TransactionDetailsPage.tsx  # Single transaction view
├── services/          # API service functions
│   ├── authService.ts
│   ├── walletService.ts
│   └── transactionService.ts
└── index.css          # Global styles & Tailwind config
```

## API Integration

The frontend connects to a Spring Boot backend at `http://localhost:8081/api`. Configure the base URL in `src/lib/axios.ts`.

## License

MIT
