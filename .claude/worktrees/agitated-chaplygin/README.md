# ☕ BrewCart Admin

**Complete SAAS Platform for Coffee Shop E-commerce**

A modern, professional admin dashboard and customer-facing store built with React, TypeScript, Vite, and Supabase. Designed for Malaysian coffee shops to manage products, orders, and payments seamlessly.

---

## 🚀 Features

### ✅ **Admin Dashboard**
- 📊 Real-time analytics & sales dashboard
- 📦 Product management (CRUD operations)
- 🛒 Order tracking & status updates
- ⚙️ Settings & configuration
- 📱 Responsive design (mobile-friendly)

### ✅ **Payment Integration**
- 💳 DuitNow QR payment modal
- 💰 Manual payment confirmation flow
- 🧾 Order summary & receipt generation
- 📲 WhatsApp order notifications

### ✅ **Customer Features** *(Coming Soon)*
- 🏪 Beautiful product catalog
- 🛍️ Shopping cart (localStorage)
- 🔍 Product search & filters
- ⭐ Product reviews & ratings

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 19, TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | TailwindCSS |
| **Database** | Supabase (PostgreSQL) |
| **State Management** | React Context API |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **Code Quality** | Prettier, ESLint |

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+ and npm
- Supabase account (free tier works!)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/your-username/brewcart-admin.git
cd brewcart-admin
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Setup Environment Variables**
```bash
# Copy example file
cp .env.example .env

# Edit .env and add your Supabase credentials
# Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
```

### **Step 4: Setup Database**
Run the SQL schema in Supabase SQL Editor:
```bash
cat supabase_schema.sql
# Copy & paste into Supabase SQL Editor
```

### **Step 5: Start Development Server**
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint code with ESLint |

---

## 📁 Project Structure

```
brewcart-admin/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin dashboard components
│   │   ├── system/         # System components (ErrorBoundary)
│   │   └── ui/             # Reusable UI components
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Libraries (Supabase client)
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── config/             # App configuration
├── App.tsx                 # Main App component (Admin Dashboard)
├── index.tsx               # App entry point
├── index.css               # Global styles
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
├── tailwind.config.ts      # TailwindCSS config
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite build config
```

---

## 🗄️ Database Schema

### **Tables:**
- `stores` - Store information
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Order line items

See `supabase_schema.sql` for complete schema.

---

## 🔐 Environment Variables

See `.env.example` for all available environment variables:

```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional (Future)
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_EMAIL_API_KEY=your-key
```

---

## 🚧 Roadmap

### **Phase 1: MVP** ✅ (Current)
- [x] Admin dashboard
- [x] Product CRUD
- [x] Order management
- [x] DuitNow QR payment modal
- [x] Supabase integration

### **Phase 2: Customer Store** 🔄 (In Progress)
- [ ] Public-facing storefront
- [ ] Shopping cart with localStorage
- [ ] Product detail pages
- [ ] Mock data for testing

### **Phase 3: Payment Gateway** 📅 (Planned)
- [ ] Stripe integration
- [ ] FPX online banking
- [ ] Payment webhooks
- [ ] Order confirmation emails

### **Phase 4: Advanced Features** 💡 (Future)
- [ ] Multi-store support
- [ ] Inventory tracking
- [ ] Analytics & reports
- [ ] Customer accounts
- [ ] Loyalty rewards program

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 💬 Support

- 📧 Email: support@brewcart.com
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/brewcart-admin/issues)

---

## 🙏 Acknowledgments

- Built with ❤️ for Malaysian coffee shops
- Powered by [Supabase](https://supabase.com)
- UI inspired by modern SaaS platforms

---

**Made with ☕ by [Your Name]**
