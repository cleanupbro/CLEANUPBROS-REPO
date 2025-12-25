# Learning Log - Clean Up Bros Portal

**Purpose:** Track lessons learned to prevent repeating mistakes.

---

## LESSON-001: React.lazy() Requires Default Exports

**Date:** 2025-12-25
**Category:** CRITICAL
**Task:** Fix Gift Cards page crash
**Error:** `TypeError: Cannot convert object to primitive value`
**Root Cause:** `React.lazy()` expects a default export, but components only had named exports
**Lesson:** When using lazy loading, always ensure components have `export default ComponentName`
**Prevention:**
- Check if component has default export before using React.lazy()
- Add `export default ComponentName;` at end of lazy-loaded components
**Applied To:** GiftCardPurchaseView.tsx, AdminGiftCardsView.tsx

---

## LESSON-002: Mobile Navigation Requires Hamburger Menu

**Date:** 2025-12-25
**Category:** UI/UX
**Task:** Fix mobile navigation
**Error:** No way to navigate between pages on tablet/phone
**Root Cause:** All nav buttons had `hidden md:block` class, no mobile alternative
**Lesson:** Always implement hamburger menu for mobile when using responsive hiding
**Prevention:**
- When hiding desktop nav, add mobile hamburger menu
- Test on mobile viewport before deployment
- Use useState for menu open/close state
**Applied To:** Header.tsx

---

## LESSON-003: Native Drag-and-Drop vs Libraries

**Date:** 2025-12-25
**Category:** WORKFLOW
**Task:** Implement Kanban board
**Error:** None (prevention)
**Root Cause:** N/A
**Lesson:** HTML5 native drag-and-drop works well for simple Kanban without extra dependencies
**Prevention:**
- Use native `draggable`, `onDragStart`, `onDragOver`, `onDrop` for basic drag-and-drop
- Only add libraries (react-beautiful-dnd) if needing complex features
**Applied To:** PipelineBoard.tsx

---

## LESSON-004: jsPDF Already Available

**Date:** 2025-12-25
**Category:** API
**Task:** Invoice PDF generation
**Error:** None (prevention)
**Root Cause:** N/A
**Lesson:** Check existing dependencies before adding new ones - jsPDF was already used in contractService.ts
**Prevention:**
- Search codebase for existing PDF/export functionality before implementing
- Reuse patterns from existing code (contractService.ts was a good reference)
**Applied To:** InvoiceGenerator.tsx

---

## Statistics

- **Total Lessons:** 4
- **Critical:** 1
- **UI/UX:** 1
- **Workflow:** 1
- **API:** 1

---

*Last Updated: December 25, 2025*
