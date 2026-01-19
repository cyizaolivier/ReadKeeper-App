# 📚 ReadKeeper: Minimalist Library Management

**ReadKeeper** is a high-end, minimalist Library Management System designed with a strictly two-color monochrome aesthetic. Built for speed, clarity, and professional-grade utility, it provides a seamless experience for both administrators and library members.

---

## 🎨 Design Philosophy: Brutalist Minimalism
The application follows a "Senior Developer" design standard:
- **Strict Monochrome**: A high-contrast palette of Midnight Black (`#000000`) and Pure White (`#ffffff`).
- **Typography**: Optimized with the **Inter** typeface for maximum legibility.
- **Precision Layout**: Zero-radius corners, bold brutalist borders, and consistent spacing for a premium SaaS feel.

---

## 🚀 Core Modules

### 1. Unified Dashboard
A central hub for real-time monitoring.
- **Admin**: Monitor borrow requests, manage the global book repository, and track library health.
- **User**: Quick overview of recent borrowings and personal library status.

### 2. My Collection (Personal Library)
Dual-pane interface for managing personal bibliographies.
- **Live Search**: Integrated instant filtering across title, author, and category.
- **CRUD Operations**: Complete management of book records with a refined table view.

### 3. Member Directory (Admin Only)
A protected module for user governance.
- **User Management**: View all registered users with distinctive role badges.
- **Access Control**: Ability to remove users and audit library membership.

### 4. Smart Settings & Preferences
Profile and application-level controls.
- **Security**: Manage and update personal authentication credentials.
- **Danger Zone**: Admin-only feature to reset application databases (books/borrows).
- **Persistent States**: Locked minimalist theme ensures consistent professional branding.

---

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5
- **Aesthetics**: Vanilla CSS3 (Custom Design System, Variable-driven)
- **Engine**: Vanilla JavaScript (ES6+)
- **Icons**: [Feather Icons](https://feathericons.com/)
- **Typography**: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- **Persistance**: `localStorage` (Browser-based DB)

---

## 📦 Installation & Setup

1. **Clone the Project**
   ```bash
   git clone https://github.com/cyizaolivier/readkeeper.git
   ```

2. **Launch Application**
   Simply open `index.html` in any modern web browser. No server environment or build step is required.

### 🔑 Admin Credentials (Default)
- **Username**: `admin`
- **Password**: `admin123`

---

## 🔄 Smart Borrowing Workflow
ReadKeeper features advanced logic for borrowing automation:
- **Request Cycle**: Members request books directly from the collection.
- **Approval Engine**: Admins evaluate requests with a single click.
- **Auto-Returns**: On approval, the system **automatically calculates a 14-day return window** and notifies the user in their dashboard.

---

## 📂 Project Architecture
```text
readkeeper/
├── index.html       # Auth & Dual-Role Dashboard
├── library.html     # Collection Management Module
├── members.html     # User Directory Module
├── settings.html    # Profile & Preference Module
├── style.css        # Minimalist Design System
└── script.js        # Core Application Engine
```

---

## Author
**Cyiza Olivier** – *Frontend Architect & UI/UX Specialist*
- GitHub: [@cyizaolivier](https://github.com/cyizaolivier)
