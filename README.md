# 💰 Expense Tracker Premium

<video src="./demo.mp4" width="100%" controls autoplay loop muted></video>

A polished, high-performance personal expense tracker built with **React Native (Expo)** and **Firebase**. Designed with a focus on premium aesthetics, real-time analytics, and secure data management.

---

## ✨ Features

### 🔐 Multi-Flow Authentication
- **Google Sign-In**: Native OAuth flow integrated using `expo-auth-session`.
- **Email/Password**: Tabbed Sign In & Sign Up interface with robust validation.
- **Secure Persistence**: Session management with `@react-native-async-storage/async-storage`.
- **Logout**: Seamless session termination with instant redirection.

### 📊 Real-time Dashboard & Analytics
- **Premium Dashboard**: `LinearGradient` balance cards featuring total monthly spending and trend chips.
- **Spending Analytics**: Interactive **Pie Charts** (via `react-native-chart-kit`) visualizing category-wise distribution.
- **Monthly Insights**: Numerical breakdown of expenses with percentage calculations.
- **Real-time Sync**: Firestore `onSnapshot` listeners ensure data is always up-to-date across devices.

### ✍️ Smart Expense Management
- **One-Tap Addition**: Floating Action Button (FAB) for quick access.
- **Data Guardrails**: Robust validation to prevent ₹0, negative, or absurdly large entries (max ₹1M).
- **Categorization**: Mandatory category tagging for accurate analytics.

### 🎨 Premium UI/UX
- **Modern Design**: Dark-themed login and light-themed dashboard using `react-native-paper`.
- **Fluid Layouts**: `SafeAreaView` fixes for Android status bar compatibility.
- **Iconography**: Clean, professional icons from `lucide-react-native`.

---

## 🛠 Tech Stack

- **Frontend**: React Native, Expo SDK 53
- **Database**: Firebase Firestore (Real-time NoSQL)
- **Auth**: Firebase Authentication (Google & Email/Password)
- **UI Framework**: React Native Paper
- **Analytics**: React Native Chart Kit
- **Navigation**: React Navigation (Stack)
- **Styling**: Vanilla CSS-in-JS + Expo Linear Gradient
- **Icons**: Lucide React Native

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Expo Go app (Android/iOS)

### 2. Installation
```bash
# Clone or move into the project directory
cd ExpenseTracker

# Install dependencies
npm install
```

### 3. Server Configuration (Done ✅)
The project is already connected to:
- **Project ID**: `expense-tracker-codestormx`
- **Region**: `asia-south1` (Mumbai)

*If you need to change the project, update credentials in `src/api/firebase.ts`.*

### 4. Run the App
```bash
npx expo start --clear
```
Scan the QR code with **Expo Go** to start tracking!

---

## 📂 Project Structure

```text
src/
├── api/          # Firebase & Firestore initialization
├── components/   # Reusable UI (ExpenseCard, TotalBalance)
├── context/      # AuthContext (Global state & logout)
├── navigation/   # Stack Navigator & Auth logic
├── screens/      # Main Screens (Login, List, Add, Analytics)
└── assets/       # Icons & Splash screens
```

---

## 📖 Documentation
- **[Technical Architecture](./architecture.md)**: Detailed breakdown of the app's internal design, data flows, and security.

---

## 🔒 Security Rules (Firestore)
The database is secured to ensure data isolation:
```javascript
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---
