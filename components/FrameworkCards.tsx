import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FrameworkCards = () => {
  const tests = [
    {
      id: "T1",
      title: "Resource is a Commons",
      description: "The primary resource must be publicly or community owned with majority expenditure on non-private assets.",
      borderColor: "border-[#1B4332]"
    },
    {
      id: "T2",
      title: "Dwellers Benefit",
      description: "At least 70% local beneficiaries, 40% marginalised (SC/ST/Women), with a mandatory community governance body.",
      borderColor: "border-[#1B4332]"
    },
    {
      id: "T3",
      title: "Economic Opportunity",
      description: "Commons access must translate to measurable income — minimum ₹5,000/household/year — with institutional offtake.",
      borderColor: "border-[#D97706]"
    },
    {
      id: "T4",
      title: "Sustainability Lock",
      description: "A legally mandated replenishment obligation with annual monitoring and a financial penalty or O&M fund.",
      borderColor: "border-[#D97706]"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B4332]">The 4-Point SOC Test</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          A scheme must pass all four to qualify as a Shared-Outcome Commons
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {tests.map((test) => (
          <Card key={test.id} className={`border border-gray-200 border-l-[4px] ${test.borderColor} bg-white rounded-lg shadow-sm`}>
            <CardHeader className="pb-2">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{test.id}</span>
              <CardTitle className="text-xl font-bold text-[#1B4332]">
                {test.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {test.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FrameworkCards;
