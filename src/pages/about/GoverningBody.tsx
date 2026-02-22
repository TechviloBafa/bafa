import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone, Crown, Award } from "lucide-react";

const governingBodyMembers = [
  {
    name: "জনাব আব্দুল করিম",
    designation: "সভাপতি",
    profession: "সাবেক সচিব, সংস্কৃতি মন্ত্রণালয়",
    email: "chairman@bulbullolitakola.edu.bd",
    phone: "+880 1711-XXXXXX",
    type: "president",
  },
  {
    name: "জনাব মোহাম্মদ হাসান",
    designation: "সহ-সভাপতি",
    profession: "ব্যবসায়ী ও সমাজসেবক",
    email: "vicepresident@bulbullolitakola.edu.bd",
    phone: "+880 1712-XXXXXX",
    type: "vice-president",
  },
  {
    name: "মোঃ আব্দুর রহমান",
    designation: "সাধারণ সম্পাদক",
    profession: "অধ্যক্ষ, বুলবুল ললিতকলা একাডেমী",
    email: "secretary@bulbullolitakola.edu.bd",
    phone: "+880 1713-XXXXXX",
    type: "secretary",
  },
  {
    name: "জনাব কামরুল ইসলাম",
    designation: "কোষাধ্যক্ষ",
    profession: "ব্যাংকার (অবসরপ্রাপ্ত)",
    email: "treasurer@bulbullolitakola.edu.bd",
    phone: "+880 1714-XXXXXX",
    type: "treasurer",
  },
  {
    name: "শিল্পী রফিকুল ইসলাম",
    designation: "সদস্য",
    profession: "বিশিষ্ট চিত্রশিল্পী",
    email: "member1@bulbullolitakola.edu.bd",
    phone: "+880 1715-XXXXXX",
    type: "member",
  },
  {
    name: "উস্তাদ আলী আকবর",
    designation: "সদস্য",
    profession: "সংগীত পরিচালক",
    email: "member2@bulbullolitakola.edu.bd",
    phone: "+880 1716-XXXXXX",
    type: "member",
  },
  {
    name: "নৃত্যশিল্পী শামীমা আক্তার",
    designation: "সদস্য",
    profession: "নৃত্য পরিচালক, বাংলাদেশ শিল্পকলা একাডেমী",
    email: "member3@bulbullolitakola.edu.bd",
    phone: "+880 1717-XXXXXX",
    type: "member",
  },
  {
    name: "ড. আনিসুর রহমান",
    designation: "সদস্য",
    profession: "অধ্যাপক, সংগীত বিভাগ, ঢাকা বিশ্ববিদ্যালয়",
    email: "member4@bulbullolitakola.edu.bd",
    phone: "+880 1718-XXXXXX",
    type: "member",
  },
];

export default function GoverningBody() {
  const executives = governingBodyMembers.filter(m => m.type !== "member");
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
            বুলবুল ললিতকলা একাডেমীর সম্মানিত পরিচালনা পর্ষদের সদস্যবৃন্দ
          </p>
        </div>
      </section>

      {/* Executive Members */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            নির্বাহী কমিটি
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {executives.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-primary/20">
                <CardHeader>
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mb-4 ring-4 ring-primary/20">
                    <span className="text-4xl">👤</span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-bold text-base">
                    {member.designation}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">{member.profession}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate text-xs">{member.email}</span>
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

      {/* General Members */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            সাধারণ সদস্যবৃন্দ
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <span className="text-3xl">👤</span>
                  </div>
                  <CardTitle className="text-base">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.designation}
                  </CardDescription>
                  <p className="text-xs text-muted-foreground mt-1">{member.profession}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
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
