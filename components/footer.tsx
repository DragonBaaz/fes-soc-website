import Link from "next/link"
import { allDepartments } from "@/lib/data"

// External links: always use target="_blank" rel="noopener noreferrer"

export function Footer() {
  // Compute stats
  const totalSchemes = allDepartments.reduce((sum, d) => sum + d.totalSchemes, 0)
  const totalSoc = allDepartments.reduce((sum, d) => sum + d.summary.soc, 0)
  const totalNearSoc = allDepartments.reduce((sum, d) => sum + d.summary.nearSoc, 0)
  const socRate = ((totalSoc / totalSchemes) * 100).toFixed(1)

  return (
    <footer className="bg-[#1B4332] text-white">
      {/* Stats Bar */}
      <div className="border-t border-[#2D6A4F] py-6 px-6">
        <div className="container mx-auto">
          <div className="flex justify-center gap-8 flex-wrap text-center">
            <div>
              <div className="text-white font-bold text-lg">{totalSchemes}</div>
              <div className="text-gray-300 text-xs">Schemes</div>
            </div>
            <div className="border-r border-[#2D6A4F]" />
            <div>
              <div className="text-white font-bold text-lg">{totalSoc}</div>
              <div className="text-gray-300 text-xs">Full SOC</div>
            </div>
            <div className="border-r border-[#2D6A4F]" />
            <div>
              <div className="text-white font-bold text-lg">{totalNearSoc}</div>
              <div className="text-gray-300 text-xs">Near-SOC</div>
            </div>
            <div className="border-r border-[#2D6A4F]" />
            <div>
              <div className="text-white font-bold text-lg">{socRate}%</div>
              <div className="text-gray-300 text-xs">SOC Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tricolor Stripe */}
      <div className="h-0.75 flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Copyright */}
      <div className="bg-[#111827] py-3 px-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 text-xs">
            © 2026 Foundation for Ecological Security · IIM Raipur Internship · Vaibhav Kumar Singh
          </p>
          <p className="text-gray-600 text-xs mt-1">
            SOC Diagnostic Analysis — Chhattisgarh Commons Policy Research
          </p>
        </div>
      </div>
    </footer>
  )
}
