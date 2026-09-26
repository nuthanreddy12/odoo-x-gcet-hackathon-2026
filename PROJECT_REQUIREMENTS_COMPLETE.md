# StockSense — Complete Project Requirements

> **Purpose of this file:** This is the primary requirements/context document for AI coding agents working on StockSense.
>
> Before changing code, read this file and inspect the existing implementation. Preserve working functionality and do not invent requirements that are not supported by this document or the existing project.

---

## 1. Project Goal

Build a modular **Inventory Management System (IMS)** that digitizes and streamlines stock-related operations within a business.

StockSense should replace manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

---

## 2. Target Users

- **Inventory Managers** — manage incoming and outgoing stock.
- **Warehouse Staff** — perform transfers, picking, shelving, and counting.

---

## 3. Authentication

Required:

- User signup.
- User login.
- OTP-based password reset.
- After successful login, redirect to the Inventory Dashboard.

The UI mockup also shows:
- Login ID
- Password
- Sign Up
- Forgot Password
- Sign-up fields for login ID, email, password, and password confirmation.

---

## 4. Dashboard

The landing page should provide a snapshot of inventory operations.

### Dashboard KPIs

- Total Products in Stock
- Low Stock / Out of Stock Items
- Pending Receipts
- Pending Deliveries
- Internal Transfers Scheduled

### Dashboard information shown in the mockup

The dashboard includes receipt and delivery operation summaries, including:

- Number of receipts to receive.
- Number of deliveries to deliver.
- Late operations.
- Waiting operations.

The mockup notes that:
- A later/scheduled date can be compared with today's date to identify late operations.
- Waiting indicates waiting for stock.

### Dynamic Filters

Filtering should support:

- Document type:
  - Receipts
  - Delivery
  - Internal
  - Adjustments
- Status:
  - Draft
  - Waiting
  - Ready
  - Done
  - Canceled
- Warehouse or location.
- Product category.

---

## 5. Navigation

The requirements specify navigation for:

### Products

- Create/update products.
- Stock availability per location.
- Product categories.
- Reordering rules.

### Operations

1. Receipts (Incoming Stock)
2. Delivery Orders (Outgoing Stock)
3. Inventory Adjustment
4. Move History
5. Dashboard
6. Settings
   - Warehouse

### Profile Menu

- My Profile
- Logout

The UI mockups use a top navigation containing items such as:

`Dashboard | Operations | Products | Move History | Settings`

---

# 6. Warehouse & Location Management

The mockups show a dedicated warehouse/settings area.

## Warehouse

A warehouse should contain:

- Name
- Short Code
- Address

Example concept shown:

`Warehouse`

## Locations

A warehouse can contain multiple locations, rooms, racks, etc.

A location should contain:

- Name
- Short Code
- Warehouse

Example concept:

`Warehouse → Location`

The mockup explicitly describes locations as holding multiple warehouse locations/rooms/etc.

---

# 7. Product Management

Products should support:

- Name
- SKU / Code
- Category
- Unit of Measure
- Initial stock (optional)

Products should also support:

- Stock availability per location.
- Reordering rules.

The system should support SKU search and smart filters.

---

# 8. Stock View

The UI mockup shows a stock table containing:

- Product
- Per-unit cost
- On hand
- Free to Use

The mockup explicitly states:

> User must be able to update the stock from here.

Stock information is associated with warehouse/location inventory.

---

# 9. Receipts — Incoming Goods

Receipts are used when items arrive from vendors.

## Receipt List

The receipt list should:

- Be the default landing view when the user opens receipt operations.
- Show receipt references.
- Show source/vendor.
- Show destination/location.
- Show contact.
- Show scheduled date.
- Show status.
- Support searching receipts based on reference and contacts.
- Allow switching to a Kanban view based on status.

The mockup shows example references such as:

`WH/IN/0001`
`WH/IN/0002`

The reference convention shown is:

`WH/IN/001`

and follows the concept:

`<Warehouse>/<Operation>/<ID>`

where:
- `WH` = warehouse
- `IN` / `OUT` = operation
- `ID` = automatically incremented unique ID

The exact final reference-generation implementation should follow the existing application architecture unless the requirement is explicitly being implemented.

## Receipt Workflow

Required basic process:

1. Create a new receipt.
2. Add supplier/vendor.
3. Add products.
4. Input quantities received.
5. Validate.
6. Stock increases automatically.

Example:

- Receive 50 units of Steel Rods → stock increases by 50.

The mockup shows:

`Draft → Ready → Done`

and indicates:

- Draft = initial state.
- Ready = ready to receive.
- Done = received.

The mockup also shows:

- Validate
- Print
- Cancel
- New Product
- Product lines with quantity
- Receive From
- Schedule Date
- Responsible

The logged-in user is intended to be automatically populated as the responsible user.

The mockup also states that the receipt can be printed once it is Done.

---

# 10. Delivery Orders — Outgoing Goods

Delivery orders are used when stock leaves the warehouse for customer shipment.

## Delivery List

The delivery list should:

- Be the default landing view when the user opens delivery operations.
- Show delivery references.
- Show source/location.
- Show destination/vendor/customer.
- Show contact.
- Show scheduled date.
- Show status.
- Support searching based on reference and contacts.
- Allow switching to a Kanban view based on status.

Example references shown:

`WH/OUT/0001`
`WH/OUT/0002`

## Delivery Workflow

Required basic process:

1. Pick items.
2. Pack items.
3. Validate.
4. Stock decreases automatically.

Example:

- Delivery of 10 chairs → chair stock decreases by 10.

The mockup shows a delivery status progression:

`Draft → Waiting → Ready → Done`

The mockup defines these states conceptually:

- Draft = initial state.
- Waiting = waiting for out-of-stock products to become available.
- Ready = ready to deliver.
- Done = delivered.

The delivery detail view shows:

- Validate
- Print
- Cancel
- Delivery address
- Scheduled date
- Responsible
- Operation type
- Product lines
- Product quantity
- New Product

The mockup indicates that the system should alert/notify and visually mark the operation when a product is not in stock.

---

# 11. Internal Transfers

Internal transfers move stock within the company.

Examples:

- Main Warehouse → Production Floor
- Rack A → Rack B
- Warehouse 1 → Warehouse 2
- Main Store → Production Rack

Requirements:

- Source and destination locations must be represented.
- Total company stock should remain unchanged during a pure internal transfer.
- The destination/source location quantities must update.
- Every movement must be logged in the Stock Ledger / Move History.

---

# 12. Stock Adjustments

Stock adjustments fix mismatches between:

1. Recorded stock.
2. Physical count.

Workflow:

1. Select product/location.
2. Enter counted quantity.
3. System automatically updates stock.
4. System logs the adjustment.

Example from the requirements:

- 3 kg steel damaged → stock decreases by 3.

---

# 13. Move History / Stock Ledger

The system must maintain a history of stock movements.

Movements include:

- Receipts.
- Deliveries.
- Internal transfers.
- Stock adjustments.

The inventory flow should be traceable through the ledger/history.

Example:

1. Receive 100 kg Steel → +100.
2. Move Steel from Main Store → Production Rack → total stock unchanged, location changes.
3. Deliver 20 → -20.
4. Adjust 3 damaged kg → -3.

Everything is logged in the Stock Ledger.

---

# 14. Alerts & Inventory Intelligence Requirements

The source requirements explicitly require:

- Low-stock alerts.
- Smart SKU search/filters.
- Reordering rules.
- Multi-warehouse support.

Do not invent additional AI functionality unless it is explicitly requested later.

---

# 15. Inventory Flow — Reference Scenario

Use this scenario when testing the system:

### Step 1 — Receive Goods

Receive:

`100 kg Steel`

Expected:

`Stock +100`

### Step 2 — Internal Transfer

Move:

`Main Store → Production Rack`

Expected:

- Total stock unchanged.
- Location quantities updated.
- Movement logged.

### Step 3 — Delivery

Deliver:

`20 steel`

Expected:

`Stock -20`

### Step 4 — Adjustment

Damaged:

`3 kg steel`

Expected:

`Stock -3`

All movements must appear in Stock Ledger / Move History.

---

# 16. UI / UX Reference

The supplied mockups are the visual/interaction reference for the intended application.

Important patterns shown in the mockups:

- Dark interface.
- Red/pink hand-drawn style outlines and labels in the mockup.
- Top navigation.
- List-based operation screens.
- Search controls.
- List/Kanban switching.
- Status-based operation workflow.
- Dedicated detail views for receipts and deliveries.
- Warehouse → Location hierarchy.
- Stock table with inventory quantities.
- Dashboard operation summaries.

**Important:** The mockups are requirements/reference material, not instructions to blindly reproduce the exact visual style. Preserve the existing StockSense design system unless a UI redesign is explicitly requested.

---

# 17. Status Definitions From the Mockups

Where applicable:

### Receipt

`Draft → Ready → Done`

- Draft: initial state.
- Ready: ready to receive.
- Done: received.

### Delivery

`Draft → Waiting → Ready → Done`

- Draft: initial state.
- Waiting: waiting for stock.
- Ready: ready to deliver.
- Done: delivered.

`Canceled` is also listed as a supported status in the dashboard/filter requirements.

---

# 18. Functional Acceptance Criteria

A working implementation should support the following end-to-end behavior:

### Product

- Create/update product.
- Store SKU/code, category, UOM, and optional initial stock.
- View stock by location.
- Apply reordering rules.

### Receipt

- Create receipt.
- Add supplier/vendor.
- Add products and quantities.
- Validate receipt.
- Increase stock automatically.
- Record movement in ledger/history.
- Support receipt reference.
- Support scheduled date.
- Support responsible user.
- Support print/cancel behavior as implemented by the application.

### Delivery

- Create delivery.
- Add products and quantities.
- Pick/pack workflow where implemented.
- Validate delivery.
- Decrease stock automatically.
- Handle insufficient stock according to the Waiting/Ready behavior.
- Record movement in ledger/history.
- Support scheduled date.
- Support responsible user.
- Support print/cancel behavior as implemented by the application.

### Transfer

- Move stock between locations.
- Update source/destination quantities.
- Keep total stock unchanged.
- Log the movement.

### Adjustment

- Compare recorded quantity with physical count.
- Update stock to the counted quantity.
- Log the adjustment.

### Dashboard

- Reflect current inventory state.
- Show required KPIs.
- Show receipt/delivery operation status.
- Support required filters.

---

# 19. Rules for AI Coding Agents

This section is important.

Before making any code changes:

1. Read `PROJECT_REQUIREMENTS.md`.
2. Inspect the existing frontend and backend.
3. Understand the current architecture before modifying it.
4. Compare existing behavior against the requirements.
5. Preserve working functionality.
6. Fix confirmed issues before introducing unrelated features.
7. Do not rewrite functioning modules unnecessarily.
8. Do not invent requirements.
9. Do not change backend/API/database behavior unless required by the task.
10. Keep changes minimal and consistent with the existing architecture.
11. Verify frontend build/type checks after code changes.
12. Verify affected backend functionality when backend code changes.
13. When a requirement is ambiguous, inspect the existing implementation and this document rather than guessing.
14. When a mockup conflicts with an already-established working implementation, flag the conflict instead of silently replacing working behavior.
15. Do not add AI features, complex architecture, or unnecessary dependencies unless explicitly requested.

---

# 20. Current Project Context

This repository already contains an implementation of StockSense.

The AI agent's job is **not** to rebuild StockSense from scratch.

The correct workflow is:

`Requirements → Inspect existing implementation → Audit → Identify gaps → Fix/implement required functionality → Test → Report`

When taking over the project, first determine what is already implemented and what remains incomplete.

---

# 21. Reference Material

The original written project brief is the source for the functional requirements.

The supplied UI mockups are the source for additional UI/interaction details such as:

- Warehouse/location screens.
- Stock table.
- Receipt list/detail flow.
- Delivery list/detail flow.
- Dashboard summaries.
- Login/signup screens.
- Status transitions.
- Search/Kanban controls.
- Reference numbering concepts.

Reference mockup:

https://link.excalidraw.com/l/65VNvwy7c4X/3ENvQFu9o8R

---

## Final Instruction to the AI Agent

**Do not modify anything just because you found this file.**

First inspect the current StockSense implementation and report:

1. What requirements are already implemented.
2. What requirements are partially implemented.
3. What requirements are missing.
4. What confirmed bugs exist.
5. What should be worked on next.

Only make changes after the task is explicitly given.
