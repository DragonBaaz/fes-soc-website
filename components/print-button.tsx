"use client"

import { Printer } from "lucide-react"

export function PrintButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="print:hidden flex items-center gap-2 px-3 py-2 border-2 border-[#1B4332] text-[#1B4332] rounded-lg hover:bg-[#1B4332]/5 transition-colors text-sm font-semibold"
      aria-label="Print Report"
    >
      <Printer className="w-4 h-4" />
      Print Report
    </button>
  )
}
