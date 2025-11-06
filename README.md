# NextDeal Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-6.4.8-0081CB?style=for-the-badge&logo=material-ui)](https://mui.com/)

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A modern, feature-rich car marketplace and dealership management platform built with Next.js 15, React 19, TypeScript, Material-UI, and Tailwind CSS.

## 🚗 Overview

NextDeal is a comprehensive automotive platform that connects car buyers, sellers, dealers, and garages. The platform offers vehicle listings, dealer management, community features, chat functionality, and administrative tools for managing the marketplace.

## ✨ Features

### 🏠 User Features
- **Vehicle Marketplace**: Browse and search for cars with advanced filtering
- **Hot Vehicles**: Featured and trending vehicle listings
- **Rent Vehicles**: Vehicle rental marketplace
- **Certified Garages**: Find trusted automotive service providers
- **Recommended Agencies**: Curated list of verified dealers and agencies
- **Community**: Share posts and engage with other car enthusiasts
- **Chat System**: Real-time communication between users, dealers, and garages
- **User Profiles**: Manage personal information and preferences
- **Search Results**: Advanced search with filtering and sorting options
- **Favorites**: Save and track vehicles of interest

### 🏢 Dealer Features
- **Inventory Management**: Add, edit, and manage vehicle listings
- **Lead Management**: Track and manage customer inquiries
- **Advertisement Tools**: Create and manage marketing campaigns
- **Analytics Dashboard**: Monitor performance and sales metrics
- **Bulk Messaging**: Send mass communications to customers

### 🔧 Admin Features
- **User Management**: Manage user accounts and permissions
- **Dealer Management**: Oversee dealer registrations and verifications
- **Content Moderation**: Monitor community posts and listings
- **Analytics**: Comprehensive reporting and insights
- **Bulk Operations**: Mass messaging and data management tools
- **Campaign Management**: Create and manage marketing campaigns
- **Subscription Management**: Handle billing and subscription plans
- **CRM Integration**: Customer relationship management tools
- **Product Management**: Manage spare parts and accessories
- **Email Logs**: Track and manage email communications

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.2.3](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) with JSX
- **Styling**: [Material-UI v6.4.8](https://mui.com/), [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand v5.0.3](https://zustand-demo.pmnd.rs/)
- **Authentication**: JWT-based authentication with role-based access
- **Real-time**: [Socket.IO v4.8.1](https://socket.io/) for chat functionality
- **Internationalization**: [i18next v25.0.1](https://www.i18next.com/) (English, Hebrew, Bengali)
- **Form Handling**: [Formik v2.4.6](https://formik.org/) + [Yup v1.6.1](https://github.com/jquense/yup)
- **HTTP Client**: [Axios v1.8.4](https://axios-http.com/)
- **Data Fetching**: [TanStack Query v5.74.3](https://tanstack.com/query)
- **Rich Text Editor**: [CKEditor 5 v41.4.2](https://ckeditor.com/)
- **File Upload**: [React Dropzone v14.3.8](https://react-dropzone.js.org/)
- **Calendar**: [React Big Calendar](https://github.com/jquense/react-big-calendar)
- **Charts**: [Recharts v2.15.2](https://recharts.org/)
- **Notifications**: [React Toastify v11.0.5](https://fkhadra.github.io/react-toastify/)
- **Icons**: [React Icons v5.5.0](https://react-icons.github.io/react-icons/)
- **Image Gallery**: [React Image Gallery v1.4.0](https://github.com/xiaolin/react-image-gallery)
- **CSV Processing**: [PapaParse v5.5.2](https://www.papaparse.com/)
- **Emoji Picker**: [Emoji Picker React v4.12.2](https://www.npmjs.com/package/emoji-picker-react)
- **Google OAuth**: [React OAuth Google v0.12.1](https://www.npmjs.com/package/@react-oauth/google)
- **AI Integration**: [OpenAI v5.3.0](https://openai.com/)
- **Deployment**: Docker support with multi-stage builds

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.17 or higher)
- [npm](https://www.npmjs.com/) (v9.0 or higher) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- [TypeScript](https://www.typescriptlang.org/) (included with Next.js)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nextDeal-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Authentication
JWT_SECRET=your-jwt-secret-key-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OpenAI (Optional)
OPENAI_API_KEY=your-openai-api-key

# Socket.IO (Optional)
SOCKET_URL=your-socket-server-url

# Database (if applicable)
DATABASE_URL=your-database-connection-string
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (home)/            # Home page routes
│   │   └── page.tsx       # Main homepage
│   ├── admin/             # Admin panel routes
│   │   ├── add-vehicle/   # Add vehicle form
│   │   ├── ads/           # Advertisement management
│   │   ├── bulk-message/  # Bulk messaging tools
│   │   ├── community/     # Community management
│   │   ├── crm/           # Customer relationship management
│   │   ├── customers-list/ # Customer management
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── dealer/        # Dealer management
│   │   ├── dealers-list/  # Dealers listing
│   │   ├── inventory/     # Inventory management
│   │   ├── mailing/       # Email management
│   │   ├── manage-subscription/ # Subscription management
│   │   ├── new-campaign/  # Campaign creation
│   │   ├── plan-billing/  # Billing management
│   │   ├── product-list/  # Product management
│   │   └── layout.tsx     # Admin layout
│   ├── cars/              # Vehicle listing routes
│   │   └── [slug]/        # Dynamic car detail pages
│   ├── chat/              # Chat system routes
│   │   ├── [type]/        # Chat type-specific pages
│   │   └── page.tsx       # Main chat page
│   ├── marketplace/       # Marketplace routes
│   ├── rent-vehicles/     # Vehicle rental routes
│   ├── hot-vehicles/      # Featured vehicles
│   ├── certified-garages/ # Garage listings
│   ├── recommended-agencies/ # Agency recommendations
│   ├── search-result/     # Search results
│   │   └── (searchItem)/  # Search item components
│   ├── profile/           # User profile
│   ├── signin/            # Authentication
│   ├── signup/            # Registration
│   ├── forgetpassword/    # Password recovery
│   ├── password-reset/    # Password reset
│   ├── user/              # User-specific routes
│   │   └── [id]/          # Dynamic user pages
│   ├── favicon.ico        # App icon
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/             # Reusable UI components
│   ├── admin/             # Admin-specific components
│   │   ├── ui/            # Admin UI components (28 files)
│   │   └── Mail/          # Email components
│   ├── auth/              # Authentication components
│   │   ├── CarForm.tsx    # Vehicle form
│   │   ├── ForgetPassword.tsx # Password recovery
│   │   ├── LeftSideScreen.tsx # Auth layout
│   │   ├── Login.tsx      # Login component
│   │   ├── NewPassword.tsx # New password setup
│   │   ├── OtpVerifyPage.tsx # OTP verification
│   │   ├── Signup.tsx     # Registration
│   │   └── SignupRole.tsx # Role selection
│   ├── layouts/           # Layout components
│   │   ├── Footer.tsx     # Site footer
│   │   └── Navbar.tsx     # Navigation bar
│   ├── modal/             # Modal components (12 files)
│   │   ├── ConfirmationModal.tsx
│   │   ├── CreateCarGarageModal.tsx
│   │   ├── CreateCustomerModal.tsx
│   │   ├── CreateDealerModal.tsx
│   │   ├── CreateLeadModal.tsx
│   │   ├── EditCarGarageModal.tsx
│   │   ├── EditSparePartModal.tsx
│   │   ├── EmailLogModal.tsx
│   │   ├── SparePartModalForm.tsx
│   │   ├── UpdateCarModal.tsx
│   │   ├── UpdateDealerModal.tsx
│   │   ├── UpdateReminderStatusModal.tsx
│   │   └── UserEditModal.tsx
│   ├── style/             # Style components
│   │   └── listingStatus.css
│   ├── styles.ts          # Style utilities
│   └── ui/                # General UI components (40+ files)
│       ├── chats/         # Chat components (3 files)
│       ├── AccessibleButton.tsx
│       ├── AdvertisementCard.tsx
│       ├── CarCard.tsx
│       ├── CarDetailsSection.tsx
│       ├── CarListing.tsx
│       ├── CarSpecification.tsx
│       ├── Category.tsx
│       ├── CheckoutForm.tsx
│       ├── CommunitryPostCard.tsx
│       ├── CommunityHeader.tsx
│       ├── ContinueWithGoogleButton.tsx
│       ├── CreatePostCard.tsx
│       ├── CustomButton.tsx
│       ├── CustomLoaderForComponent.tsx
│       ├── DealerListSidebar.tsx
│       ├── Error.tsx
│       ├── ErrorBoundary.tsx
│       ├── ExpandableText.tsx
│       ├── GarageCard.tsx
│       ├── GarageCards.tsx
│       ├── HeaderContent.tsx
│       ├── HomePageBanner.tsx
│       ├── HomePageCars.tsx
│       ├── ListingStatus.tsx
│       ├── LocationSearchBar.tsx
│       ├── MaintenanceComponent.tsx
│       ├── MenuItems.tsx
│       ├── NavigationButtons.tsx
│       ├── NextDealTab.tsx
│       ├── ProfilePage.tsx
│       ├── ReviewSection.tsx
│       ├── SearchBar.tsx
│       ├── SectionHeader.tsx
│       ├── SuccessMessage.tsx
│       └── SvgComponent.tsx
├── lib/                    # Utility libraries
│   ├── api/               # API integration (12 files)
│   │   ├── auth.ts        # Authentication API
│   │   ├── campaign.ts    # Campaign API
│   │   ├── chat.ts        # Chat API
│   │   ├── community.ts   # Community API
│   │   ├── dealer.ts      # Dealer API
│   │   ├── garage.ts      # Garage API
│   │   ├── leads.ts       # Leads API
│   │   ├── shareVehicale.ts # Vehicle sharing API
│   │   ├── sparePart.ts   # Spare parts API
│   │   ├── subscription.ts # Subscription API
│   │   ├── users.ts       # Users API
│   │   └── vehicale.ts    # Vehicle API
│   ├── hooks/             # Custom React hooks (6 files)
│   │   ├── authorize.ts   # Authorization utilities
│   │   ├── AuthorizeProtect.tsx # Route protection
│   │   ├── useAuth.ts     # Authentication hook
│   │   ├── useCheckUserAuthenticateStatus.ts # Auth status
│   │   ├── usePermission.ts # Permission hook
│   │   └── useProtectedRoute.ts # Route protection
│   └── utils/             # Helper functions (8 files)
├── locales/                # Internationalization files
│   ├── en.json            # English translations
│   ├── he.json            # Hebrew translations
│   └── bn.json            # Bengali translations
├── screens/                # Screen-specific components (20+ files)
│   ├── admin/             # Admin screens (8 files)
│   ├── CertifiedGarages.tsx
│   ├── Chat/              # Chat screens
│   │   └── ChatScreen.tsx
│   ├── CommunityScreen.tsx
│   ├── HotVehicles.tsx
│   ├── LoginScreen.tsx
│   ├── MarketPlace.tsx
│   ├── RecommendedAgencies.tsx
│   ├── RentVehicles.tsx
│   ├── SearchItem.tsx
│   └── SignupScreen.tsx
├── assets/                 # Static assets (images, icons)
│   ├── Agency.png
│   ├── Banner.png
│   ├── CustomerImage.jpg
│   ├── DealerImage.jpg
│   ├── Garage.png
│   ├── Group_1.svg
│   ├── image.png
│   ├── logo.png
│   ├── MarketPlaceImage.png
│   └── navbarLogo.png
├── i18n.ts                 # Internationalization configuration
└── theme.ts                # Material-UI theme configuration
```

## 🧪 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run type-check` - Type check TypeScript files
- `npm run analyze` - Analyze bundle size
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🐳 Docker

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t nextdeal-frontend .

# Run the container
docker run -p 3000:3000 nextdeal-frontend
```

### Docker Compose (if applicable)

```bash
docker-compose up -d
```

The Dockerfile uses a multi-stage build process:
1. **Build Stage**: Installs dependencies and builds the Next.js application
2. **Production Stage**: Creates a lightweight production image with only necessary files

## 🌐 Internationalization

The application supports multiple languages:
- **English** (en) - Default language
- **Hebrew** (he) - RTL support
- **Bengali** (bn) - Bengali language support

Language files are located in `src/locales/` and the configuration is in `src/i18n.ts`.

## 🔐 Authentication

The application uses JWT-based authentication with:
- Email/Password authentication
- Google OAuth integration (optional)
- Role-based access control (User, Dealer, Admin)
- JWT tokens for session management
- Password reset functionality
- OTP verification system

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Type check TypeScript files
npm run type-check
```

## 📦 Build and Deployment

### Production Build

```bash
npm run build
```

### Environment Variables for Production

Ensure all production environment variables are properly configured in your deployment platform.

### Deployment Platforms

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style and formatting
- Use Prettier for code formatting (`npm run format`)
- Follow ESLint rules (`npm run lint`)
- Write meaningful commit messages
- Use TypeScript for type safety
- Follow TypeScript best practices and conventions
- Run type checking before committing (`npm run type-check`)

## 🐛 Known Issues

- Ensure all environment variables are properly configured
- Some features may require backend API endpoints to be available
- Socket.IO connection requires a running WebSocket server
- React Strict Mode is disabled for development flexibility

## 🔮 Roadmap

- [ ] Add comprehensive test coverage
- [ ] Implement PWA features
- [ ] Add more payment gateways
- [ ] Enhance mobile app experience
- [ ] Add advanced analytics dashboard
- [ ] Implement real-time notifications
- [ ] Enhance TypeScript type definitions
- [ ] Add strict TypeScript configuration
- [ ] Implement automated testing pipeline
- [ ] Add performance monitoring
- [ ] Enhance accessibility features

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Material-UI](https://mui.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for hosting and deployment tools
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- All contributors and community members

---

**Made with ❤️ by the NextDeal Team**