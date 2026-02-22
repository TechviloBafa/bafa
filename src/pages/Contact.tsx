import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    toast({
      title: "বার্তা পাঠানো হয়েছে!",
      description: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16">
        <div className="container text-center text-primary-foreground">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <Phone className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">যোগাযোগ করুন</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            আমাদের সাথে যোগাযোগ করতে নিচের তথ্য ব্যবহার করুন অথবা সরাসরি বার্তা পাঠান
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">যোগাযোগের তথ্য</h2>
                <div className="space-y-6">
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">ঠিকানা</h3>
                        <p className="text-muted-foreground">
                          778 West Shewrapara, Beside Metro Station<br />
                          Dhaka, Bangladesh, 1216
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  |
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <Phone className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">ফোন</h3>
                        <p className="text-muted-foreground">
                          +880 1912-888418
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Mail className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">ইমেইল</h3>
                        <p className="text-muted-foreground">
                          info@bdbafa.com
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <Clock className="h-6 w-6 text-gold-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">অফিস সময়</h3>
                        <p className="text-muted-foreground">
                          শনিবার - বৃহস্পতিবার<br />
                          সকাল ৯:০০ - বিকাল ৬:০০<br />
                          <span className="text-primary">শুক্রবার বন্ধ</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>বার্তা পাঠান</CardTitle>
                  <CardDescription>
                    আপনার প্রশ্ন বা মতামত জানাতে নিচের ফর্মটি পূরণ করুন
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">নাম *</Label>
                        <Input id="name" placeholder="আপনার নাম" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">ফোন *</Label>
                        <Input id="phone" type="tel" placeholder="01XXXXXXXXX" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">ইমেইল</Label>
                      <Input id="email" type="email" placeholder="email@example.com" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">বিষয়</Label>
                      <Input id="subject" placeholder="বার্তার বিষয়" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">বার্তা *</Label>
                      <Textarea
                        id="message"
                        placeholder="আপনার বার্তা লিখুন..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="pb-16">
        <div className="container">
          <Card className="overflow-hidden">
            <div className="aspect-[21/9] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                <p className="text-muted-foreground">গুগল ম্যাপ</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
