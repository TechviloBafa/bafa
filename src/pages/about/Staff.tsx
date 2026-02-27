import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Phone } from "lucide-react";

interface StaffMember {
  name: string;
  designation: string;
  branch?: string;
}

const staffMembers: StaffMember[] = [
  { name: "তানজিনা আক্তার", designation: "এডমিন অফিসার", branch: "মিরপুর ১৩ নম্বর ও আদাবর শাখা" },
  { name: "নিলুফা ইয়াছমিন", designation: "এডমিন অফিসার", branch: "শেওড়াপাড়া শাখা" },
  { name: "মৌসুমী খাতুন", designation: "এডমিন অফিসার", branch: "মিরপুর ১০ নম্বর ও বনানী শাখা" },
  { name: "নওশীন নাজিম", designation: "এডমিন অফিসার", branch: "মিরপুর ১৪ নম্বর শাখা" },
  { name: "চাঁদ মিয়া বেপারী", designation: "এডমিন অফিসার", branch: "মিরপুর ২ নম্বর ও আফতাব নগর শাখা" },
  { name: "সুরাইয়া আক্তার", designation: "এডমিন অফিসার", branch: "কাফরুল শাখা" },
  { name: "শাতিল শারমিন", designation: "এডমিন অফিসার", branch: "বসুন্ধরা শাখা" },
  { name: "সুবাসিতা ইসলাম", designation: "এডমিন অফিসার", branch: "পল্লবী শাখা" },
  { name: "কারিমুন্নেছা মনি", designation: "এডমিন অফিসার", branch: "উত্তরা ৭ নম্বর সেক্টর শাখা" },
  { name: "মোঃ সাইদুজ্জামান", designation: "এডমিন অফিসার", branch: "আদাবর শাখা" },
  { name: "মীর পারভেজ", designation: "সহকারী এডমিন অফিসার" },
  { name: "মোঃ হাবিবুল্লাহ", designation: "সহকারী এডমিন অফিসার" },
  { name: "নিশি ইসলাম", designation: "সহকারী এডমিন অফিসার" },
  { name: "লিয়া মনি", designation: "এডমিন অফিসার", branch: "মিরপুর ১৪ শাখা" },
  { name: "শাহানাজ পারভিন", designation: "হিসাব রক্ষক" },
  { name: "সুবহা বিনতে মতিন", designation: "এডমিন অফিসার", branch: "আফতাব নগর শাখা" },
  { name: "রেজোয়ানা নাজনীন রুম্পা", designation: "এডমিন অফিসার", branch: "মিরপুর ১৩ নম্বর শাখা" },
  { name: "সাগরিকা", designation: "এডমিন অফিসার", branch: "উত্তরা ৫ নম্বর সেক্টর শাখা" },
  { name: "ইয়াছমিন রুনা", designation: "হিসাব রক্ষক" },
  { name: "সারিকা খন্দকার", designation: "হিসাব রক্ষক" },
];

export default function Staff() {
  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">কর্মকর্তা তথ্য</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            বাংলাদেশ বুলবুল ললিতকলা একাডেমী বাফার সম্মানিত কর্মকর্তাবৃন্দ
          </p>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staffMembers.map((staff, index) => (
              <Card key={index} className="hover:shadow-lg transition-all border-primary/10">
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 ring-2 ring-primary/5">
                    <span className="text-3xl">👤</span>
                  </div>
                  <CardTitle className="text-base font-bold">{staff.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">
                    {staff.designation}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  {staff.branch && (
                    <Badge variant="outline" className="font-normal text-muted-foreground border-primary/20">
                      {staff.branch}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
