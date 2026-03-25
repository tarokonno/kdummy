/**
 * Standard page container: matches Profiles → Generate (max width + padding rhythm).
 * Use for all primary app pages so content aligns with the sidebar layout.
 */
export default function PageShell({ children }) {
  return (
    <main className="max-w-7xl mx-auto w-full py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0 w-full">{children}</div>
    </main>
  )
}
