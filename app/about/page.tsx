import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { allDepartments } from "@/lib/data"
import Link from "next/link"

export default function AboutPage() {
  const methodologyCards = [
    {
      title: "Data Collection",
      description: "Scheme guidelines sourced from official Chhattisgarh NIC portals and the Yojana Darshika 2019 compendium. Each scheme was assessed against the SOC Framework Specifications document."
    },
    {
      title: "Scoring",
      description: "Each of the 4 SOC tests is evaluated on 3–5 sub-parameters. PASS/FAIL is determined by sub-parameter thresholds defined in the framework. Estimates are flagged explicitly when source documents lack specific data."
    },
    {
      title: "Reporting",
      description: "Reports follow a mandatory 5-part structure: Framework Overview, Results Matrix, Scheme-Wise Analysis, Structural Findings, and Conclusion."
    }
  ]

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-[#1B4332] mb-3">
            About This Project
          </h1>
          <p className="text-lg text-gray-600">
            Understanding how Chhattisgarh's government schemes can better serve commons-based livelihoods.
          </p>
        </div>

        {/* Project Overview */}
        <div className="mb-16 bg-white p-10 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-6">Project Overview</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            This diagnostic website presents the findings of an <strong>SOC Policy Analysis</strong> conducted as part of an internship 
            with the <strong>Foundation for Ecological Security (FES)</strong> at <strong>IIM Raipur</strong>. The analysis applies the 
            <strong> Shared-Outcome Commons (SOC) framework</strong> to evaluate <strong>71+ government schemes</strong> across 
            <strong> 8 departments</strong> of the Chhattisgarh state government.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            The goal is to assess whether these schemes structurally function as commons-based economic opportunities—delivering 
            sustainable livelihoods, ensuring equitable local benefit capture, and protecting resource bases for intergenerational use.
          </p>
        </div>

        {/* Methodology */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8">Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methodologyCards.map((card, idx) => (
              <Card key={idx} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-1 bg-[#2D6A4F]" />
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#1B4332]">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* About FES */}
        <div className="mb-16 bg-white p-10 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-6">About Foundation for Ecological Security (FES)</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            <strong>Foundation for Ecological Security (FES)</strong> is a national-level organisation working on commons governance, 
            natural resource management, and rural livelihoods across India. It operates in 10+ states supporting gram sabha-led 
            natural resource management, strengthening community-based resource stewardship, and advocating for policy frameworks 
            that recognize the rights and capacities of local communities.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg mt-4">
            This SOC Policy Analysis aligns with FES's mission to evaluate and strengthen the commons-based architecture of 
            government development schemes.
          </p>
        </div>

        {/* Author */}
        <div className="mb-16 bg-[#1B4332]/5 p-10 rounded-xl border border-[#1B4332]/10">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8">Author & Researcher</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Name</p>
              <p className="text-xl font-bold text-[#1B4332]">Vaibhav Kumar Singh</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Role</p>
              <p className="text-lg text-gray-700">Intern, Foundation for Ecological Security</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Institution</p>
              <p className="text-lg text-gray-700">IIM Raipur</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Period</p>
              <p className="text-lg text-gray-700">April-May 2026</p>
            </div>
          </div>
        </div>

        {/* Departments Covered */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-8">Departments Covered</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {allDepartments.map((dept) => (
              <Link key={dept.slug} href={`/departments/${dept.slug}`}>
                <div className="px-4 py-2 bg-[#1B4332] text-white rounded-full text-sm font-semibold hover:bg-[#2D6A4F] transition-colors cursor-pointer">
                  {dept.department.replace(" Department", "")}
                </div>
              </Link>
            ))}
          </div>
          <p className="text-gray-600 text-sm italic border-t border-gray-200 pt-6">
            Analysis ongoing — departments will be added as SOC reports are completed.
          </p>
        </div>

        {/* Footer Credits */}
        <div className="text-center text-gray-500 text-sm border-t border-gray-200 pt-8">
          <p className="font-semibold text-gray-600 mb-2">Developed by</p>
          <p className="mb-1">Vaibhav Kumar Singh</p>
          <p>MBA student, IIM Raipur | April 2026</p>
        </div>
      </main>
    </div>
  )
}
