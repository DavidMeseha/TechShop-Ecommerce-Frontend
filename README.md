# TechShop Frontend 🛍️

A modern e-commerce platform built with Next.js and TailwindCSS.

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://techshop-commerce.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white)](https://nextjs.org/)

## 📋 Table of Contents

- [Related Projects](#-related-projects)
- [Features](#-features)
- [Tech Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Internationalization](#-internationalization)

## 🔗 Related Projects

- **Backend Repository**: [Node.js Backend](https://github.com/DavidMeseha/allInOne-myShop-back)
- **Backend Dashboard**: [GoLang Backend](https://github.com/DavidMeseha/myshop-dashboard)
- **Vue/Nuxt Demo**: [TechShop Store](https://techshop-commerce.vercel.app/)
- **Vue/Nuxt Codebase**: [TechShop Store](https://github.com/DavidMeseha/myshop-nuxt)

## 🎯 Features

### 🛒 Shopping Experience

- Advanced product search and filtering
- Customizable product attributes
- Real-time shopping cart management
- Like/Save functionality (Equevelent to socila media interactions)
- Stripe payment integration

### 👤 User Features

- Secure authentication
- Profile management
- Order tracking history
- Multiple address management
- Personalized preferences

### 🔍 Product Discovery

- Intuitive category navigation
- Smart tag system
- Vendor shop profiles
- Advanced search capabilities

### V Vendors Features

- Manage Products like soft delete, republish, create and edit

### ⚡ Technical Features

- Custome form inputs for better user experiance
- Croping Images and Obtimizing before upload
- Infinite scroll implementation
- Responsive mobile-first design
- Next.js image optimization
- ISG/SSG for performance and SEO
- Multi-language support
- RTL layout support

## 🛠️ Technology Stack

### Core Technologies

```typescript
{
  "frontend": {
    "framework": "Next.js (App Router)",
    "language": "TypeScript",
    "styling": "TailwindCSS"
  }
}
```

### State Management & Data Fetching

- **Zustand** - Lightweight state management
- **Tanstack Query** - Server state handling
- **Axios** - HTTP client

### Development Tools

- **Jest & React Testing Library** - Testing suite
- **ESLint & Prettier** - Code quality
- **TypeScript** - Type safety

### UI Components

- **Framer Motion** - Smooth animations
- **TailwindCSS** - Utility-first CSS
- **UI Components** - Shadcn/ui

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= v18.0.0
npm >= v8.0.0
```

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/DavidMeseha/TechShop-Ecommerce-Frontend.git
cd TechShop-Ecommerce-Frontend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```env
NEXT_PUBLIC_API_BASEURL = http://localhost:3000
NEXT_PUBLIC_STRIP_KEY = pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL = http://localhost:3001
NEXT_PUBLIC_ADMIN_API_BASEURL = http://localhost:8080
```

4. Start development server

```bash
npm run dev
```

## 🧪 Development

### Available Scripts

```json
{
  "scripts": {
    "dev": "Start development server",
    "build": "Build for production",
    "start": "Start production server",
    "test": "Run test suite",
    "lint": "Run ESLint",
    "format": "Format with Prettier"
  }
}
```

## 🌐 Internationalization

### Supported Languages

- 🇺🇸 English (en)
- 🇸🇦 Arabic (ar)
- 🇫🇷 French (fr)
