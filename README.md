# 🛍️ MarketNest

**MarketNest** is a modern, responsive e-commerce web application built with React, Redux Toolkit, React Router, and Vite. It provides a complete shopping experience including product discovery, search and filtering, product details, cart management, and a demo checkout workflow.

The project focuses on reusable component design, predictable state management, API integration, responsive UI development, error handling, and automated testing.

> **Live Demo:** Coming soon  
> **Repository:** https://github.com/Yashaswini944/marketnest

---

## ✨ Features

### Product Discovery

- Browse products retrieved from the Fake Store API
- Search products by name
- Filter products by category
- Sort products by price or name
- Paginate product results
- View detailed product information
- Display product ratings and review counts

### Shopping Cart

- Add products to the cart
- Increase or decrease quantities
- Remove products
- Automatically calculate item counts
- Automatically calculate cart totals
- Access the cart from the main navigation

### Demo Checkout

- Shipping and payment information forms
- Client-side form validation
- Order summary
- Processing state during checkout
- Order confirmation
- Cart clearing after successful demo checkout
- No real payment information is processed

### User Experience

- Responsive layouts for desktop, tablet, and mobile
- Loading states while retrieving API data
- Error states when requests fail
- Retry functionality for failed requests
- Empty-cart state
- No-results state for product searches and filters
- Accessible labels and semantic navigation
- Responsive product grid

---

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Frontend | React |
| State Management | Redux Toolkit, React Redux |
| Routing | React Router |
| Build Tool | Vite |
| Styling | CSS3 |
| API | Fake Store API |
| Testing | Vitest |
| Component Testing | React Testing Library |
| User Interaction Testing | Testing Library User Event |
| Test Environment | jsdom |
| Coverage | V8 |
| Code Quality | ESLint |
| Version Control | Git & GitHub |

---

## 🏗️ Application Architecture

MarketNest separates UI components, pages, application state, routing, API communication, and automated tests into dedicated areas.

```text
User Interface
      │
      ▼
React Components / Pages
      │
      ├──────────────► React Router
      │
      ▼
Redux Toolkit Store
      │
      ▼
Cart State

React Pages
      │
      ▼
Product Service
      │
      ▼
Fake Store API
```

This separation keeps API communication outside UI components and centralizes shopping-cart state through Redux Toolkit.

---

## 📁 Project Structure

```text
marketnest/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Header.test.jsx
│   │   ├── Pagination.jsx
│   │   ├── Pagination.test.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductCard.test.jsx
│   │
│   ├── pages/
│   │   ├── Checkout.jsx
│   │   ├── Checkout.test.jsx
│   │   ├── Home.jsx
│   │   ├── Home.test.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── ProductDetail.test.jsx
│   │   ├── ShoppingCart.jsx
│   │   └── ShoppingCart.test.jsx
│   │
│   ├── redux/
│   │   ├── cartSlice.js
│   │   ├── cartSlice.test.js
│   │   └── store.js
│   │
│   ├── routes/
│   │   └── Router.jsx
│   │
│   ├── services/
│   │   ├── productService.js
│   │   └── productService.test.js
│   │
│   ├── test/
│   │   └── setup.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## 🧪 Testing

MarketNest includes automated tests covering application behavior across components, pages, Redux state management, and API services.

### Current Test Results

```text
Test Files:  9 passed
Tests:       86 passed
Failures:    0
```

### Verified Coverage

| Metric | Coverage |
|---|---:|
| Statements | 97.20% |
| Branches | 91.40% |
| Functions | 96.10% |
| Lines | 97.13% |

Tests cover functionality including:

- Cart reducer behavior
- Adding and removing products
- Quantity updates
- Cart total calculations
- Product API requests
- API failure handling
- Product cards
- Product details
- Search and filtering behavior
- Sorting
- Pagination
- Loading and error states
- Shopping-cart interactions
- Checkout validation
- Demo order submission
- Header cart counts
- Navigation behavior

Run the complete test suite:

```bash
npm run test:run
```

Generate a coverage report:

```bash
npm run test:coverage
```

---

## 🌐 API Integration

MarketNest retrieves product information from the **Fake Store API**.

API:

```text
https://fakestoreapi.com
```

### Endpoints Used

```http
GET /products
GET /products/:id
```

Product requests are centralized in:

```text
src/services/productService.js
```

The service validates HTTP responses and throws application-friendly errors when requests fail.

---

## 🔄 State Management

Shopping-cart state is managed with Redux Toolkit.

The cart state contains:

```text
items
totalPrice
```

The cart slice provides the following actions:

```text
addToCart
removeFromCart
updateQuantity
clearCart
```

This provides a centralized source of truth for cart information across the application.

---

## 🧭 Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Browse, search, filter, sort, and paginate products |
| `/product/:id` | Product Detail | View detailed information about a product |
| `/cart` | Shopping Cart | Manage products and quantities |
| `/checkout` | Checkout | Complete the demo checkout workflow |

---

## 🚀 Getting Started

### Prerequisites

Install a currently supported Node.js version and npm.

Check your installation:

```bash
node --version
npm --version
```

### Clone the Repository

```bash
git clone https://github.com/Yashaswini944/marketnest.git
cd marketnest
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

---

## 📦 Available Commands

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Automated Tests

```bash
npm run test:run
```

Runs the automated test suite.

### Test Coverage

```bash
npm run test:coverage
```

Runs the test suite and generates a V8 coverage report.

### Lint

```bash
npm run lint
```

Checks the project with ESLint.

### Production Build

```bash
npm run build
```

Creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

Runs the production build locally for verification.

---

## 📱 Responsive Design

MarketNest was designed and tested across desktop, tablet, and mobile layouts.

The interface adapts the product grid, navigation, cart, checkout, and content layout according to the available screen width.

---

## 📸 Screenshots

Screenshots will be added before the production deployment.

Planned screenshots:

- Product catalog
- Product details
- Shopping cart
- Checkout
- Mobile responsive layout

---

## 🔐 Application Notes

MarketNest is a portfolio/demo application.

- Products come from the Fake Store API.
- Checkout is a simulated workflow.
- No real payments are processed.
- No real payment credentials should be entered.
- User authentication is not currently implemented.
- Cart state is maintained in Redux for the current application session.

---

## 🔍 Code Quality

The project uses several checks before changes are considered ready:

```bash
npm run test:run
npm run lint
npm run build
```

The current project passes all three checks.

---

## 🚧 Future Improvements

Potential future enhancements include:

- Backend API integration
- User authentication and authorization
- Persistent shopping carts
- User profiles
- Order history
- Product favorites
- Backend inventory management
- Real database integration
- CI/CD workflow
- Additional accessibility testing

---

## 🌍 Deployment

MarketNest will be deployed using **Vercel**.

The production URL will be added here after deployment.

```text
Live Demo: Coming soon
```

---

## 👩‍💻 Author

**Yashaswini**

M.S. in Computer Science  
Auburn University at Montgomery

GitHub: https://github.com/Yashaswini944

---

## 📄 Project Purpose

MarketNest was developed as a portfolio project to demonstrate practical frontend software engineering skills including React application development, Redux state management, REST API integration, responsive design, routing, automated testing, error handling, and production build workflows.
