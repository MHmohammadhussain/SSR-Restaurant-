# SSR Restaurant - Next.js Website with Backend

A fully functional restaurant website built with Next.js, featuring reservations, delivery orders, contact management, and admin panel.

## 🚀 Features

✅ **Frontend**
- Responsive design (mobile, tablet, desktop)
- 7 pages: Home, About, Menu, Gallery, Reservations, Delivery, Contact
- Interactive menu filtering
- Lightbox gallery
- Form validation

✅ **Backend**
- MongoDB database for persistent data storage
- Reservation management
- Delivery order processing
- Contact form submissions
- Admin dashboard to view all submissions
- Email notifications (via Resend)
- Stripe payment processing integration

✅ **Deployment**
- Ready for Vercel (recommended for Next.js)
- Environment variables configured
- Production-ready build

## 📋 Setup Instructions

### Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your credentials (see .env.example)
cp .env.example .env.local

# Start development server
npm run dev

# Visit http://localhost:3000
```

### Environment Variables Required

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ssr-restaurant
RESEND_API_KEY=re_your_resend_key
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-secret-key
ADMIN_EMAIL=admin@ssrrestaurant.com
ADMIN_PASSWORD=your-admin-password
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🌐 Deployment with Vercel

### Step 1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user and get connection string
4. Copy the `MONGODB_URI` to your .env.local

### Step 2: Setup Resend Email
1. Go to [Resend](https://resend.com)
2. Create account and get API key
3. Add domain verification (or use Resend domain)
4. Copy `RESEND_API_KEY` to .env.local

### Step 3: Setup Stripe (Optional - for payments)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get test mode keys (Secret and Publishable)
3. Add both `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Step 4: Deploy to Vercel
```bash
# Login to Vercel
npm install -g vercel
vercel login

# Deploy
vercel

# Follow prompts to:
# 1. Link to GitHub repo
# 2. Add environment variables in Vercel dashboard
# 3. Deploy
```

Or deploy directly from GitHub:
1. Push code to GitHub: `git init && git add . && git commit -m "initial" && git push`
2. Go to [Vercel.com](https://vercel.com)
3. Click "New Project" → Import your GitHub repo
4. Add environment variables in Settings
5. Deploy

## 📊 API Endpoints

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get all reservations (admin)

### Orders
- `POST /api/orders` - Create delivery order
- `GET /api/orders` - Get all orders (admin)

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - Get all messages (admin)

### Menu Items
- `GET /api/menu-items` - Get menu items
- `POST /api/menu-items` - Create menu item
- `PUT /api/menu-items/[id]` - Update menu item
- `DELETE /api/menu-items/[id]` - Delete menu item

## 👨‍💼 Admin Panel

Access the admin dashboard at `/admin` to view:
- All reservations with guest details
- All delivery orders with status
- Contact form submissions
- Menu management

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Email**: Resend
- **Payments**: Stripe
- **Hosting**: Vercel

## 📱 Pages

- **/** - Homepage with hero, features, dishes, testimonials
- **/about** - Company story, values, team, stats
- **/menu** - Full menu with filterable categories
- **/gallery** - Dish and ambience photos with lightbox
- **/reservations** - Table booking form
- **/delivery** - Online ordering and delivery
- **/contact** - Contact form and info
- **/admin** - Admin dashboard

## 🚦 Development

### Build for production
```bash
npm run build
npm start
```

### Run linting
```bash
npm run lint
```

### Check TypeScript
```bash
npm run type-check
```

## 📝 Database Models

### Reservation
- firstName, lastName, email, phone, date, time
- guests, occasion, specialRequests
- status (pending, confirmed, cancelled)
- timestamps

### Order
- fullName, phone, deliveryAddress, pinCode
- orderDescription, paymentMethod, preferredTime
- amount, stripePaymentId
- status (pending, confirmed, preparing, on_way, delivered, cancelled)
- timestamps

### Contact
- name, phone, email, subject, message
- status (new, read, replied)
- timestamps

### MenuItem
- emoji, name, description, price
- category (starters, tiffin, main_course, rice_biryani, desserts, drinks)
- isVegetarian, available
- timestamps

## 🔐 Security Notes

⚠️ **Important for Production:**
- Change `JWT_SECRET` to a strong random value
- Use production email addresses in Resend
- Enable email verification
- Use Stripe live keys (not test)
- Implement proper authentication for admin panel
- Add rate limiting to API routes
- Use HTTPS only
- Implement CORS properly

## 📞 Support

For issues or questions:
1. Check `.env.local` is properly configured
2. Verify MongoDB connection string
3. Check Resend API key is valid
4. View server logs on Vercel dashboard

## 📄 License

This project is ready for deployment and use.

---

**Website Status**: ✅ Ready for Production Deployment
