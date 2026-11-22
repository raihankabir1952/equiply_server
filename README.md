# Equiply | Backend API

<p align="center">
  **Powering the Equiply Equipment Rental Platform**
</p>

The backend API for Equiply, responsible for authentication, equipment management, rental operations, availability tracking, payments, and analytics.

**API Base URL:** https://equiply-server.vercel.app/

## ✨ Features

- **Authentication & Authorization:** Better Auth integration with JWT verification and role-based access control.
- **User Management:** Manage user profiles and user information.
- **Equipment Management:** Create, update, delete, and retrieve equipment listings.
- **Admin Approval:** Admins can approve or reject equipment submissions.
- **Search & Filtering:** Search equipment by name, category, price, availability, and sorting options.
- **Favorites:** Add and remove favorite equipment.
- **Rental Management:** Create bookings, view rental history, and manage rental statuses.
- **Availability Tracking:** Calculate available stock based on overlapping rental dates.
- **Secure Payments:** Stripe Checkout integration with webhook-based payment confirmation.
- **Image Upload:** Upload equipment and profile images using ImgBB.
- **Analytics:** Provide dashboard statistics for rental and equipment activities.
- **Automated Rental Updates:** Vercel Cron Job automatically updates expired active rentals to completed.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Language | JavaScript (ES Modules) |
| Database | MongoDB |
| Authentication | Better Auth, JWT |
| JWT Verification | jose |
| Payments | Stripe |
| Image Hosting | ImgBB |
| Deployment | Vercel |

## 📌 API Routes

| Endpoint | Description |
|---|---|
| `/auth/*` | Authentication |
| `/users` | User management |
| `/equipment` | Equipment management |
| `/upload` | Image uploads |
| `/favorites` | Favorite equipment |
| `/rentals` | Rental management |
| `/payments` | Payment operations |
| `/analytics` | Dashboard analytics |
| `/cron/complete-rentals` | Automated rental status updates |

Protected routes require valid authentication and appropriate user roles.

## ⚙️ Getting Started

**1. Clone the repository**

```bash
git clone <your-server-repository-url>
cd equiply_server
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_auth_secret
CLIENT_URL=http://localhost:3000

IMGBB_API_KEY=your_imgbb_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

CRON_SECRET=your_cron_secret
```

**4. Run the development server**

```bash
npm run dev
```

The API will be available at http://localhost:5000.

## ⏰ Automated Rental Updates

Equiply uses Vercel Cron Jobs to automatically complete expired active rentals.

**Schedule:** Daily at 00:05 UTC (06:05 AM Bangladesh time).

The endpoint is protected using `CRON_SECRET`.

## 🌐 Deployment

The backend is deployed on Vercel.

**API URL:** https://equiply-server.vercel.app/

---

<p align="center">
  Built with ❤️ for Equiply.
</p>
