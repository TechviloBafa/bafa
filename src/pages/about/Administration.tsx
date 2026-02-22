import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone } from "lucide-react";

const governingBody = [
  {
    name: "জনাব আব্দুল করিম",
    designation: "চেয়ারম্যান",
    email: "chairman@bulbullolitakola.edu.bd",
    phone: "+880 1711-XXXXXX",
  },
  {
    name: "মোঃ আব্দুর রহমান",
    designation: "অধ্যক্ষ",
    email: "principal@bulbullolitakola.edu.bd",
    phone: "+880 1712-XXXXXX",
  },
  {
    name: "জনাব শফিকুল ইসলাম",
    designation: "উপাধ্যক্ষ",
    email: "viceprincipal@bulbullolitakola.edu.bd",
    phone: "+880 1713-XXXXXX",
  },
  {
    name: "জনাব মোস্তফা কামাল",
    designation: "প্রশাসনিক কর্মকর্তা",
    email: "admin@bulbullolitakola.edu.bd",
    phone: "+880 1714-XXXXXX",
  },
];

export default function Administration() {
  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">প্রশাসন</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            বুলবুল ললিতকলা একাডেমীর প্রশাসনিক দলের সাথে পরিচিত হোন
          </p>
        </div>
      </section>

      {/* Governing Body */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">পরিচালনা পর্ষদ</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {governingBody.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <span className="text-4xl">👤</span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.designation}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
