const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/(apps)/finance-tracker/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove import
content = content.replace("import { LoginScreen } from './components/login-screen'\n", "");

// 2. Remove demo data functions (parseCSV and loadDemoData)
content = content.replace(/\/\/ CSV parsing utilities for demo mode[\s\S]*?export default function MobileFinanceTracker\(\) \{/, 'export default function MobileFinanceTracker() {');

// 3. Remove isDemoMode state
content = content.replace(/  \/\/ Demo mode state\n  const \[isDemoMode, setIsDemoMode\] = useState\(false\)\n/, "");

// 4. Remove initializeDemo function
content = content.replace(/  \/\/ Initialize demo mode[\s\S]*?  \/\/ Fetch data from PostgreSQL database with caching/, '  // Fetch data from PostgreSQL database with caching');

// 5. Clean up fetchData
content = content.replace(/    if \(\!session && \!isDemoMode\) \{/, '    if (!session) {');

// 6. Clean up useEffects
content = content.replace(/    if \(status === 'authenticated' \|\| isDemoMode\) \{/, "    if (status === 'authenticated') {");
content = content.replace(/      if \(\!isDemoMode\) \{\n        fetchUserCategories\(\)\n        fetchData\(\)\n      \}\n      \/\/ Demo mode initialization is handled separately\n    \} else if \(status === 'unauthenticated' && \!isDemoMode\) \{/, "      fetchUserCategories()\n      fetchData()\n    } else if (status === 'unauthenticated') {");
content = content.replace(/  \}, \[session, status, isDemoMode\]\)/, "  }, [session, status])");

content = content.replace(/    if \(\(status === 'authenticated' \|\| isDemoMode\) && \!loading && \!budgetsLoaded\) \{/, "    if (status === 'authenticated' && !loading && !budgetsLoaded) {");
content = content.replace(/      if \(\!isDemoMode\) \{\n        fetchAllBudgets\(\)\n      \}\n      \/\/ Budgets are loaded in demo mode via initializeDemo\n/, "      fetchAllBudgets()\n");
content = content.replace(/  \}, \[status, loading, budgetsLoaded, isDemoMode\]\)/, "  }, [status, loading, budgetsLoaded])");

// 7. Clean up render logic
content = content.replace(/  \/\/ Show loading skeleton when authentication status is loading and not in demo mode\n  if \(status === 'loading' && \!isDemoMode\) \{\n    return <LoadingSkeleton \/>\n  \}\n\n  \/\/ Show login screen when not authenticated and not in demo mode\n  if \(status === 'unauthenticated' && \!isDemoMode\) \{\n    return \([\s\S]*?    \)\n  \}/, `  // Show loading skeleton when authentication status is loading
  if (status === 'loading') {
    return <LoadingSkeleton />
  }

  // If unauthenticated, redirect or return nothing while redirecting
  // Middleware should catch this, but just in case
  if (status === 'unauthenticated') {
    return <LoadingSkeleton />
  }`);

// 8. Remove isDemoMode prop from ExpenseForm
content = content.replace(/                  isDemoMode=\{isDemoMode\}\n/, "");

fs.writeFileSync(filePath, content);
console.log('Cleanup complete.');
