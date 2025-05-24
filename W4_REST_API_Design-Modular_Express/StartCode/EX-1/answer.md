Reflective Questions
1. Why is separating concerns (routes, controllers, models, middleware) important in backend development?
Separating concerns helps organize code by function. Routes handle endpoint definitions, controllers handle business logic, models manage data, and middleware handles reusable tasks like logging or authentication. This structure makes the codebase easier to read, maintain, and scale. It also improves collaboration, as different team members can work on specific parts independently.

2. What challenges did you face when refactoring the monolithic server.js into multiple files?
Some challenges include understanding how to properly structure import/export statements, keeping track of file paths, and ensuring all modules are correctly linked. Debugging also becomes slightly more complex since logic is spread across files. Another challenge is deciding what logic belongs where, especially when transitioning from a single file structure.

3. How does moving business logic into controllers improve the readability and testability of your code?
Moving business logic into controllers separates it from the routing layer, which improves readability by reducing clutter in route files. It also enhances testability since controller functions can be tested independently from the HTTP layer. This separation allows for better unit testing and makes the logic easier to maintain and update.

4. If this project were to grow to support authentication, database integration, and logging, how would this folder structure help manage that growth?
A modular folder structure allows for clean expansion. Authentication logic can be placed in an auth folder, database setup in a config folder, and additional middleware in the middleware folder. This keeps the codebase organized and scalable. Each feature can grow independently without affecting unrelated parts of the application. It also encourages code reuse and easier debugging.