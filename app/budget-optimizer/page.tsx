import BudgetOptimizer from "@/components/wealth/budget-optimizer"

export default function BudgetOptimizerPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Intelligent Budget Optimizer</h1>
      <div className="mb-6 max-w-3xl">
        <p className="text-gray-500 dark:text-gray-400">
          Our intelligent system analyzes your transaction patterns to provide personalized savings recommendations. The
          analyzer identifies spending patterns, potential areas for reduction, and calculates estimated savings based
          on your unique financial behavior.
        </p>
      </div>
      <BudgetOptimizer />
    </div>
  )
}

