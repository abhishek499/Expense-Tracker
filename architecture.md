# 🏗 Architecture Documentation - Expense Tracker

This document provides a technical overview of the Expense Tracker app's internal architecture, data flow, and security model.

---

## 🧭 System Overview

The app is built on a **Clean Architecture** inspired approach, separating the UI from business logic and data providers.

### 1. Component Hierarchy
- **App.tsx**: Entry point, initializes `AuthProvider` and `PaperProvider`.
- **RootNavigator**: Handles conditional routing based on the `user` state from `AuthContext`.
- **Screens**: Each screen consumes the `AuthContext` and interacts with Firestore via the `src/api/` layer.
- **Shared Components**: Reusable UI elements like `TotalBalance` and `ExpenseCard`.

---

## 🔄 Data Flow

### Authentication Flow (Native OAuth)
1. **Request**: UI triggers `promptAsync()` from `expo-auth-session`.
2. **Handle**: The OAuth response provides an `id_token`.
3. **Link**: The `id_token` is exchanged for a Firebase `GoogleAuthProvider.credential`.
4. **Persist**: `signInWithCredential` updates the Firebase local state, which is caught by `onAuthStateChanged` in the `AuthContext`.

### Real-time Sync Flow (Firestore)
1. **Listener**: `ExpenseListScreen` initializes an `onSnapshot` listener on the user's specific sub-collection: `users/{uid}/expenses`.
2. **Update**: Whenever a change occurs (add/delete/edit) in Firestore, the listener pulses the new data.
3. **State**: The UI updates React state immediately, providing a "no-refresh" experience.

---

## 💾 Data Model (Firestore)

The data is structured to optimize per-user security and query performance.

### Root Collection: `users`
- **Document ID**: `{uid}` (Firebase Auth User ID)
    - **Sub-collection**: `expenses`
        - **Document ID**: `{auto-generated-id}`
            - `amount`: `number` (float)
            - `category`: `string`
            - `note`: `string` (optional)
            - `createdAt`: `timestamp` (Server-side)

---

## 🔐 Security Architecture

### Firestore Security Rules
We use **Attribute-Based Access Control (ABAC)** where access is granted only if the requester's `uid` matches the path ID:

```javascript
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

### Input Validation
The app implements a **multi-layered validation** approach:
- **Frontend**: Prevents sending invalid types, ₹0 amounts, or missing categories using UI alerts.
- **Backend (Future)**: Firebase functions can further enforce schema constraints (optional).

---

## 📈 Analytics Engine

The Analytics screen performs a **Client-Side Aggregate** of the expense data:
- Uses `Array.reduce()` to group expenses by category.
- Normalizes data for `react-native-chart-kit` input.
- Calculates percentages based on the total sum of the current dataset.

---
