# BrewCart AI Agent Rules

**Read before every task. 30 seconds only.**

---

## 🚫 NEVER MODIFY (Unless Explicitly Asked):
- `src/lib/storage.ts` - Database layer
- `src/context/StoreContext.tsx` - State management  
- `src/hooks/useAuth.ts` - Authentication
- `supabase/migrations/*` - Database schema

---

## ✅ MUST PRESERVE:
- **Multi-tenant isolation** (CRITICAL!)
- Existing functionality
- TypeScript compilation
- Dark theme consistency

---

## 🔧 FIXING BUGS:

**DO:**
- Use `str_replace` for surgical edits
- Change ONLY the broken code
- Test after changes

**DON'T:**
- Refactor unrelated code
- Add new dependencies without asking
- Change file structure

---

## 🎨 UI GUIDELINES:
- Dark: `bg-slate-900`, `text-white`
- Mobile: Test at 375px width
- Style: Match existing patterns

---

## ⚡ QUICK VERIFY:
After ANY change:
- [ ] Only changed requested file?
- [ ] Multi-tenant still isolated?
- [ ] TypeScript compiles?
- [ ] No new console errors?

---

## ❓ WHEN UNSURE:
**STOP and ASK** before touching:
- Core files (listed above)
- Database schema
- Authentication logic
- Multi-tenant isolation

Better to ask than break production! 🛑

---

**That's it. Keep changes minimal. 🎯**
