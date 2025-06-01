# Reflection on REST API Design and React Filtering

## 1. How do sub-resource routes like `/journalists/:id/articles` help in designing a clear and organized API?

Sub-resource routes clearly express the relationship between resources in a RESTful way. For example, `/journalists/:id/articles` indicates that we want to retrieve articles **belonging to a specific journalist**. This approach improves **readability**, **maintainability**, and **consistency** in API design.

**Benefits of nested routes:**
- Clearly represent **hierarchical data** (e.g., articles under a journalist).
- Make the API more **intuitive** for frontend developers.
- Encourage **modular controller logic** on the backend (e.g., a route handler just for journalist-specific articles).
- Enable **easy expansion** for related features like `/categories/:id/articles`.

---

## 2. What challenges did you face when managing multiple filter states (journalist and category) in React?

Managing multiple filters meant keeping track of multiple `useState()` variables and ensuring the component re-renders correctly whenever any filter is applied or reset.

**Challenges:**
- Synchronizing `selectedJournalist` and `selectedCategory` changes.
- Making sure filtered data doesn't overwrite the full dataset (used `allArticles` as a backup).
- Avoiding unnecessary re-renders or inconsistent filtering when filters changed quickly.

**Solutions:**
- Stored all articles in `allArticles` and used `articles` only for filtered results.
- Used controlled `<select>` elements to keep form input in sync with state.
- Applied filters in one central `applyFilters()` function that checks both conditions.
- Used `resetFilters()` to cleanly restore original data and UI state.

---

## 3. What would be the advantages and disadvantages of handling the filtering entirely on the frontend versus using API-based filtering?

### Frontend Filtering (Client-side, In-Memory)

**Advantages:**
- Faster filtering after the initial data is loaded.
- No need for additional API requests, reducing network load.
- Better user experience with instant feedback.
- Simplified backend (no need to handle complex filter logic).

**Disadvantages:**
- All articles must be fetched upfront, which increases initial load time.
- Not scalable for large datasets (memory and performance issues).
- Less secure—users can access all data, even if not needed.
- More complex logic on the client side for managing state and filtering.

---

### Backend Filtering (Server-side, via query params or nested routes)

**Advantages:**
- Scales well for large datasets—only relevant data is sent.
- Reduces memory usage and improves performance on the client.
- Enables pagination, sorting, and complex filtering via database queries.
- Keeps sensitive data on the server.

**Disadvantages:**
- More API calls may be needed for different filter combinations.
- Adds complexity to backend API (needs to handle dynamic query logic).
- Filtering isn’t instant; it depends on API response time.
- Slightly more difficult to test and debug in the frontend.

---

## 4. If you needed to allow filtering by both journalist and category at the same time on the backend, how would you modify the API structure?

To support combined filtering on the backend, I would modify the existing `/articles` endpoint to accept query parameters:

**Example:**
```http
GET /articles?journalistId=2&categoryId=5

---

## 5. How did this exercise help you understand the interaction between React state, form controls, and RESTful API data?

This exercise deepened my understanding of how **React state**, **form elements**, and **API data** work together in a web application.

### Key Takeaways:
- **State control:** Using `useState()` to track form inputs allowed me to build controlled components that responded instantly to user interactions.
- **Form integration:** Each filter input (select elements) was directly connected to state variables (`selectedJournalist`, `selectedCategory`), ensuring reliable two-way binding.
- **UI reactivity:** Changing a form control triggered a function (`applyFilters`) that updated the displayed articles, demonstrating how state changes drive UI logic.
- **Data flow:** I saw how data fetched from a REST API could be manipulated locally or fetched again with different query parameters, depending on the filtering strategy.
- **Resetting and filtering:** Implementing both `applyFilters()` and `resetFilters()` helped clarify the importance of maintaining a backup of original data for clean UI/UX.

Overall, this practical exercise showed how frontend and backend coordination is essential when building a responsive and user-friendly filter system.

