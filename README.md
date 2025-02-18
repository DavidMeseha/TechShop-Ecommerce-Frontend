# TikShop Frontend

Modern e-commerce platform built with Next.js and TailwindCSS.

## 🔗 Related Projects & Live Links

### Backend Application

- [Node.js Backend](https://github.com/DavidMeseha/allInOne-myShop-back)

### Live Demo

- [Live Store](https://techshop-commerce.vercel.app/)

## 🛠️ Technology Stack

### Core

- **React.js** - UI library
- **Next.js** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling

### State Management

- **Zustand** - Global state management
- **Tanstack Query** - Server state management
- **Axios** - HTTP client

### Testing

- **Jest & React Testing Library** - Unit testing
- **Cypress** - E2E testing

### Code Quality

- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

### UI/UX

- **Framer Motion** - Animations
- **TailwindCSS** - Responsive design
- **Headless UI** - Accessible components

## 🎯 Features

### Shopping Experience

- Product browsing and search
- Advanced filtering
- Product attributes customization
- Shopping cart management
- Wishlist & favorites
- Order placement with Stripe

### User Features

- Authentication & profile management
- Order history
- Address management
- Payment methods management
- Preferences settings

### Product Discovery

- Categories navigation
- Tags browsing
- Vendor shops
- Search functionality
- Product recommendations

### Technical Features

- Infinite scrolling
- Responsive design
- Image optimization
- ISG/SSG for static pages
- Multi-language support
- RTL support

## 🌐 Internationalization

Supported languages:

- English (en)
- Arabic (ar)
- French (fr)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:

bash
git clone https://github.com/DavidMeseha/allInOne-myShop-Front.git
cd allInOne-myShop-Front

2. Install dependencies:

bash
npm install

3. Configure environment variables:

bash
cp .env.locale .env

env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_KEY=your_stripe_public_key

4. Start development server:

bash
npm run dev

## 🧪 Development

### Scripts

bash

- npm run dev # Start development server
- npm run build # Build for production
- npm run start # Start production server
- npm run test # Run tests
- npm run lint # Run linter
- npm run format # Format code
