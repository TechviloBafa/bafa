import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone, Crown, Award } from "lucide-react";

interface Member {
  name: string;
  designation: string;
  type: "executive" | "member";
  profession?: string;
  email?: string;
  phone?: string;
}

const governingBodyMembers: Member[] = [
  {
    name: "দিলসাত জাহান",
    designation: "জেনারেল ম্যানেজার",
    type: "executive",
  },
  {
    name: "তানজিনা আক্তার",
    designation: "পরিচালক",
    type: "member",
  },
  {
    name: "তাসলিমা আক্তার",
    designation: "পরিচালক",
    type: "member",
  },
  {
    name: "নিলুফা ইয়াছমিন",
    designation: "পরিচালক",
    type: "member",
  },
  {
    name: "শাহনাজ পারভিন",
    designation: "পরিচালক",
    type: "member",
  },
  {
    name: "জান্নাতুল ফেরদৌস",
    designation: "পরিচালক",
    type: "member",
  },
  {
    name: "সোহাগ হোসেন",
    designation: "পরিচালক",
    type: "member",
  },
];

export default function GoverningBody() {
  const executives = governingBodyMembers.filter(m => m.type === "executive");
  const members = governingBodyMembers.filter(m => m.type === "member");

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <Crown className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">পরিচালনা পর্ষদ</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            বাংলাদেশ বুলবুল ললিতকলা একাডেমী বাফার সম্মানিত পরিচালনা পর্ষদের সদস্যবৃন্দ
          </p>
        </div>
      </section>

      {/* Executive Members */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            নির্বাহী পর্ষদ
          </h2>
          <div className="flex justify-center">
            {executives.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all border-primary/20 max-w-sm w-full">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mb-4 ring-4 ring-primary/20">
                    <span className="text-4xl">👤</span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-bold text-base">
                    {member.designation}
                  </CardDescription>
                  {member.profession && (
                    <p className="text-sm text-muted-foreground mt-1">{member.profession}</p>
                  )}
                </CardHeader>
                {(member.email || member.phone) && (
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate text-xs">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* General Members */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            পরিচালকবৃন্দ
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <span className="text-3xl">👤</span>
                  </div>
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.designation}
                  </CardDescription>
                  {member.profession && (
                    <p className="text-xs text-muted-foreground mt-1">{member.profession}</p>
                  )}
                </CardHeader>
                {member.phone && (
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
