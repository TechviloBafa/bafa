import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Phone } from "lucide-react";

interface StaffMember {
  name: string;
  designation: string;
  department: string;
  experience: string;
  phone: string;
  image: string;
}

const staffMembers: StaffMember[] = [
  {
    name: "মোঃ আবুল কালাম",
    designation: "অফিস সহকারী",
    department: "প্রশাসন",
    experience: "১৫ বছর",
    phone: "+880 1720-XXXXXX",
    image: "/staff/kalam.jpg"
  },
  {
    name: "জনাব শফিকুল ইসলাম",
    designation: "হিসাব রক্ষক",
    department: "অর্থ বিভাগ",
    experience: "১২ বছর",
    phone: "+880 1721-XXXXXX",
    image: "/staff/shafiqul.jpg"
  },
  {
    name: "মোঃ জাহিদুল ইসলাম",
    designation: "কম্পিউটার অপারেটর",
    department: "আইটি বিভাগ",
    experience: "৮ বছর",
    phone: "+880 1722-XXXXXX",
    image: "/staff/jahidul.jpg"
  },
  {
    name: "মোঃ রফিকুল ইসলাম",
    designation: "লাইব্রেরিয়ান",
    department: "গ্রন্থাগার",
    experience: "১০ বছর",
    phone: "+880 1723-XXXXXX",
    image: "/staff/rafiqul.jpg"
  },
  {
    name: "মোঃ আলমগীর হোসেন",
    designation: "ল্যাব সহকারী",
    department: "মিউজিক ল্যাব",
    experience: "৬ বছর",
    phone: "+880 1724-XXXXXX",
    image: "/staff/alamgir.jpg"
  },
  {
    name: "জনাব করিম উদ্দিন",
    designation: "নিরাপত্তা প্রধান",
    department: "নিরাপত্তা",
    experience: "২০ বছর",
    phone: "+880 1725-XXXXXX",
    image: "/staff/karim.jpg"
  },
  {
    name: "মোঃ সোহেল রানা",
    designation: "পরিচ্ছন্নতা কর্মী",
    department: "পরিচ্ছন্নতা",
    experience: "৫ বছর",
    phone: "+880 1726-XXXXXX",
    image: "/staff/sohel.jpg"
  },
  {
    name: "জনাব আব্দুল মান্নান",
    designation: "মালামাল রক্ষক",
    department: "ভাণ্ডার",
    experience: "১৮ বছর",
    phone: "+880 1727-XXXXXX",
    image: "/staff/mannan.jpg"
  },
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
          <h1 className="text-3xl md:text-4xl font-bold mb-4">কর্মচারী তথ্য</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            আমাদের নিবেদিতপ্রাণ কর্মচারীবৃন্দের সাথে পরিচিত হোন
          </p>
        </div>
      </section>

      {/* Staff Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {staffMembers.map((staff, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center mb-3 overflow-hidden">
                    {staff.image ? (
                      <img
                        src={staff.image}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.querySelector('.fallback-icon')!.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <span className={`text-3xl fallback-icon ${staff.image ? '' : ''}`} style={{ display: staff.image ? 'none' : 'block' }}>👤</span>
                  </div>
                  <CardTitle className="text-base">{staff.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {staff.designation}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-center">
                  <Badge variant="secondary">{staff.department}</Badge>
                  <div className="text-sm text-muted-foreground">
                    <p>অভিজ্ঞতা: {staff.experience}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{staff.phone}</span>
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
