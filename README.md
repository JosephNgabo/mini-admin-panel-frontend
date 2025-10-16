# Mini Admin Panel Frontend

A professional React frontend for the Mini Admin Panel built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern React Architecture** - Built with React 18 and TypeScript
- **Professional UI/UX** - Custom design system with Tailwind CSS
- **User Management** - Complete CRUD operations with role-based access
- **Analytics Dashboard** - Interactive charts and statistics
- **Cryptographic Security** - SHA-384 hashing and RSA digital signatures
- **Protocol Buffer Integration** - Binary data export and verification
- **Responsive Design** - Mobile-first approach with modern layouts

## 🎨 Design System

- **Primary Color**: #002b11 (Custom green)
- **Typography**: Inter font family
- **Components**: Tailwind CSS with custom component classes
- **Icons**: Lucide React for consistent iconography
- **Animations**: Smooth transitions and loading states

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom configuration
- **Routing**: React Router DOM for navigation
- **State Management**: React Query for server state
- **Forms**: React Hook Form for form handling
- **Charts**: Recharts for data visualization
- **Protocol Buffers**: protobufjs for binary data handling
- **Notifications**: React Hot Toast for user feedback

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

1. **Environment Variables**: Create `.env.local` file with your API URL
2. **Backend Connection**: Ensure backend is running on port 3025
3. **Database**: Backend should be connected to PostgreSQL

## 📁 Project Structure

```
src/
├── components/         # Reusable React components
│   ├── layout/        # Layout components (Header, Sidebar, Layout)
│   ├── ui/            # UI components (buttons, forms, tables)
│   ├── forms/         # Form components
│   └── charts/        # Chart components
├── pages/             # Page components
│   ├── HomePage.tsx   # Dashboard home page
│   ├── UsersPage.tsx  # User management page
│   ├── ChartPage.tsx  # Analytics dashboard
│   └── ExportPage.tsx # Data export page
├── services/          # API service layer
│   └── api.ts         # API client with axios
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
├── constants/         # Application constants
└── contexts/          # React contexts for state management
```

## 🚀 Getting Started

1. **Start Backend**: Ensure the Node.js backend is running
2. **Install Dependencies**: `npm install`
3. **Start Development**: `npm run dev`
4. **Open Browser**: Navigate to `http://localhost:3000`

## 🔐 Security Features

- **Email Hashing**: SHA-384 algorithm for user emails
- **Digital Signatures**: RSA-2048 for data integrity
- **Signature Verification**: Client-side validation
- **Secure API**: HTTPS and CORS configuration

## 📊 Protocol Buffer Integration

- **Binary Export**: Efficient data serialization
- **Client Decoding**: Parse protobuf data in browser
- **Signature Verification**: Validate exported data integrity
- **Performance**: Optimized for large datasets

## 🎯 Development

- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint and Prettier configured
- **Performance**: Optimized bundle size with Vite
- **Accessibility**: WCAG compliant components
- **Testing**: Jest and React Testing Library ready

## 📱 Responsive Design

- **Mobile First**: Optimized for all screen sizes
- **Touch Friendly**: Gesture support for mobile
- **Progressive Enhancement**: Works without JavaScript
- **Cross Browser**: Compatible with all modern browsers

## 🔄 State Management

- **Server State**: React Query for API data
- **Local State**: React hooks for component state
- **Form State**: React Hook Form for form management
- **Global State**: React Context for app-wide state

## 🎨 Custom Components

- **Button Variants**: Primary, secondary, success, error, outline
- **Card Components**: Standardized card layouts
- **Form Components**: Input fields with validation
- **Table Components**: Sortable and filterable tables
- **Loading States**: Skeleton loaders and spinners
- **Status Badges**: Success, error, warning, secondary

## 📈 Performance

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: React Query for intelligent caching
- **Image Optimization**: Responsive images and lazy loading

## 🧪 Testing

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user journey testing
- **Visual Tests**: Component visual regression testing

## 🚀 Deployment

- **Build**: `npm run build` creates optimized production bundle
- **Preview**: `npm run preview` to test production build locally
- **Static Hosting**: Deploy to Vercel, Netlify, or any static host
- **CDN**: Optimized for CDN delivery

## 📚 Documentation

- **Component Docs**: Storybook for component documentation
- **API Docs**: Swagger/OpenAPI integration
- **Type Docs**: TypeScript documentation
- **User Guide**: Comprehensive user documentation