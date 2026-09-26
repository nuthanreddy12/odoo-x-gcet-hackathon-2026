# StockSense — Agent Instructions

## 1. Project Source of Truth

The attached **StockSense Problem Statement (PS)** is the primary source of truth for product requirements.

Do not invent requirements that are not present in the PS.

The PS defines:
- Inventory dashboard
- Products
- Receipts / incoming stock
- Delivery orders / outgoing stock
- Internal transfers
- Stock adjustments
- Stock ledger
- Low-stock alerts
- Multi-warehouse support
- SKU search and filters
- Authentication and OTP password reset

If a requested feature is not specified in the PS or explicitly requested by the developer/user, do not implement it automatically.

If something is ambiguous:
1. Identify the ambiguity.
2. Use the simplest reasonable implementation.
3. Clearly state the assumption before making a major architectural decision.
4. Do not present an assumption as a requirement.

---

# 2. No Hallucination Rule

Never claim that something exists unless you have verified it.

Before referring to:
- a file
- a directory
- an API endpoint
- a database table
- a component
- a function
- an environment variable
- a dependency
- a configuration
- an existing implementation

inspect the repository first.

If you cannot verify something, say:

> "I could not verify this in the repository."

Do NOT invent:
- filenames
- code
- API responses
- database fields
- package versions
- environment variables
- existing functionality
- external services
- test results

---

# 3. Repository Inspection

Before modifying existing code:

1. Inspect the relevant directory.
2. Read the relevant files.
3. Understand the existing implementation.
4. Modify only what is necessary.

Do not rewrite working code simply because another implementation is preferred.

Do not create duplicate components, routes, services, models or utilities without checking whether one already exists.

---

# 4. Scope Control

Every task must have a clearly defined scope.

For each request:

### First determine:
- What needs to change?
- Which files are relevant?
- What existing functionality must remain unchanged?

Then implement only that task.

Do NOT:
- refactor unrelated code
- rename unrelated files
- change the architecture unnecessarily
- install unnecessary dependencies
- rewrite working components
- modify unrelated UI
- change the database schema unless required
- add speculative features

If the requested change requires a broader modification, explain why before doing it.

---

# 5. Token Efficiency

Optimize for minimal unnecessary reasoning and tool usage.

For simple tasks:
- Inspect only relevant files.
- Make the smallest correct change.
- Do not scan the entire repository.
- Do not repeatedly reread unchanged files.
- Do not generate unnecessary explanations.
- Do not rewrite large files when a small edit is sufficient.

Do not run expensive commands unless they are useful for verifying the current task.

After completing a task:
1. Run the smallest relevant validation.
2. Report the result.
3. Stop.

Do not continue making unsolicited improvements.

---

# 6. Technology Constraints

Use only the following stack unless explicitly instructed otherwise:

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic

### Database
- PostgreSQL
- Supabase

### Authentication
- Supabase Auth

### Hosting
- Vercel for frontend
- Render or another explicitly selected free-tier service for backend

Use free/open-source solutions.

Do not introduce paid services.

Do not add:
- Redis
- Kafka
- Kubernetes
- microservices
- unnecessary message queues
- unnecessary caching layers
- AI APIs

unless explicitly requested.

---

# 7. Database Rules

Do not invent database fields casually.

Database fields must be derived from:
1. The PS,
2. An explicitly requested feature,
3. Or a clearly stated implementation requirement.

Before changing the schema:
- inspect existing models/migrations
- determine whether the field already exists
- avoid duplicate concepts

Inventory operations must preserve logical stock consistency.

### Receipt
Receiving stock increases stock.

### Delivery
Delivering stock decreases stock.

### Internal Transfer
A transfer changes the source and destination location quantities but does not change total company stock.

### Adjustment
An adjustment reconciles recorded stock with physically counted stock.

### Ledger
Inventory-changing operations must be represented in the stock ledger.

Do not silently invent alternative inventory behavior.

---

# 8. Inventory Safety

Never modify stock directly from the frontend.

Inventory changes must happen through backend-controlled operations.

Before implementing an inventory mutation, verify:
- product exists
- location/warehouse exists
- requested quantity is valid
- source stock is sufficient where applicable
- transaction is recorded
- resulting stock is consistent

Do not assume negative inventory is allowed unless explicitly specified.

If the PS does not define behavior for a particular edge case, flag it instead of inventing a business rule.

---

# 9. API Rules

Before creating an API endpoint, check whether an equivalent endpoint already exists.

Use predictable REST endpoints.

Do not create duplicate endpoints for the same operation.

Validate request data with Pydantic.

Return clear errors.

Do not fabricate API responses during implementation.

When frontend mock data is being used intentionally, clearly label it as mock data.

---

# 10. Authentication Rules

Use Supabase Auth rather than creating a custom authentication system unless explicitly instructed otherwise.

Never hardcode:
- Supabase keys
- database passwords
- JWT secrets
- API keys
- credentials

Use environment variables.

Never commit `.env` files containing secrets.

Provide `.env.example` with placeholder names only.

---

# 11. Frontend Rules

Build reusable components only where reuse is actually useful.

Prefer simple components over excessive abstraction.

Do not create a complex design system for a hackathon project.

UI should be:
- responsive
- clean
- consistent
- accessible
- easy to understand

Do not add animations or visual effects unless they improve usability.

---

# 12. Mock Data Rule

Mock data may be used during frontend development.

However:

Never present mock data as real database data.

Use obvious development/mock data structures.

When backend integration is implemented, replace mock data with actual API calls.

---

# 13. Verification Rules

Never say:

> "Everything works."

unless it has actually been tested.

Instead report exactly what was verified.

For example:

> "Frontend build completed successfully."

or:

> "I verified the POST /products endpoint locally."

If something could not be tested because credentials, services or environment variables are unavailable, say so explicitly.

Do not pretend to have tested unavailable external services.

---

# 14. Error Handling

When an error occurs:

1. Read the actual error.
2. Identify the relevant file/line.
3. Determine the root cause.
4. Make the smallest appropriate fix.
5. Re-run the relevant validation.

Do not blindly change multiple unrelated files hoping the error disappears.

If the root cause cannot be established, say so.

---

# 15. Dependency Rules

Before installing a package:

1. Check whether the functionality already exists in the project.
2. Check whether an existing dependency can provide it.
3. Only install a new dependency when necessary.

Do not install packages simply because they are commonly used.

Keep the dependency list small.

---

# 16. Git Safety

Do not delete or overwrite user work without explicit permission.

Do not reset the repository.

Do not force-push.

Do not remove existing functionality unless the task explicitly requires it.

Before making destructive changes, explain what will be affected.

---

# 17. Task Execution Format

For each development task, internally follow:

```text
UNDERSTAND
↓
INSPECT
↓
IDENTIFY RELEVANT FILES
↓
IMPLEMENT MINIMAL CHANGE
↓
VALIDATE
↓
REPORT
```

Do not skip repository inspection for existing-code changes.

---

# 18. Response Format

After completing a task, provide only:

### Changed
- Short list of files/features changed.

### Verified
- Tests/build/checks actually performed.

### Notes
- Only important assumptions, limitations or unresolved issues.

Do not provide long explanations unless requested.

---

# 19. When Requirements Are Missing

If the PS does not specify something important, do not hallucinate a requirement.

Use:

> "The PS does not specify X. I need a decision before implementing this."

For minor implementation details that do not affect business behavior, choose the simplest conventional implementation and state the assumption briefly.

---

# 20. StockSense Product Boundary

The goal is a straightforward Inventory Management System.

Prioritize:

1. Correct inventory calculations
2. Correct stock movement
3. Accurate stock ledger
4. Reliable CRUD operations
5. Clear dashboard
6. Search and filtering
7. Clean UI
8. Authentication

Do not sacrifice correctness for unnecessary features.

Do not add AI features merely to make the project appear more advanced.

---

# 21. Important Instruction

When uncertain, prefer:

**Verified information > PS requirements > explicit user instruction > existing project conventions > simple assumption**

Never use imagination to fill a technical gap when the gap can be identified explicitly.