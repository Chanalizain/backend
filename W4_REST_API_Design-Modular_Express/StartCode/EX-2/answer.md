## Reflection Questions

### 1. How do sub-resource routes (e.g., `/journalists/:id/articles`) improve the organization and clarity of your API?
Sub-resource routes clearly represent relationships between resources. In this case, `/journalists/:id/articles` shows that articles are associated with a specific journalist. This makes the API more intuitive, readable, and RESTful, which helps both backend and frontend developers understand the data structure and how resources are linked.

### 2. What are the pros and cons of using in-memory dummy data instead of a real database during development?

**Pros:**
- Easy to set up; no need for external database installation or configuration.
- Fast for testing and prototyping.
- Simplifies debugging since all data is stored in variables.

**Cons:**
- Data is not persistent; it resets every time the server restarts.
- Not scalable or suitable for production.
- Lacks validation, relationships, and constraints that databases provide.

### 3. How would you modify the current structure if you needed to add user authentication for journalists to manage only their own articles?
I would:
- Add an `auth` middleware to verify the identity of journalists using JWT (JSON Web Tokens).
- Add a login route for journalists to authenticate and receive a token.
- Modify the `POST`, `PUT`, and `DELETE` article routes to check the token and ensure the logged-in journalist is only managing their own articles (`req.user.id === article.journalistId`).
- Store login credentials and tokens securely (e.g., using bcrypt for passwords).

### 4. What challenges did you face when linking related resources (e.g., matching `journalistId` in articles), and how did you resolve them?
One challenge was ensuring that `journalistId` in an article actually referred to an existing journalist. This was resolved by checking the `journalists` array before creating or updating an article. If the `journalistId` or `categoryId` did not exist, the API would return a 400 error with a clear message. This ensured data consistency across resources.

### 5. If your API were connected to a front-end application, how would RESTful design help the frontend developer understand how to interact with your API?
RESTful design provides a clear and consistent structure. Frontend developers can predict the endpoints and HTTP methods (e.g., `GET /articles`, `POST /articles`, `GET /articles/:id`). Using meaningful URLs, standardized methods, and status codes helps developers understand how to fetch, create, update, or delete resources without constantly referring to documentation. This speeds up integration and reduces confusion.
