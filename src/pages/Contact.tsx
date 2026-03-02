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
                          bafamusicschool@gmail.com 
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
                          শনিবার - শুক্রবার<br />
                          সকাল ৯:০০ - বিকাল ৬:০০
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

      <section className="pb-16">
        <div className="container">
          <Card className="overflow-hidden border-none shadow-lg rounded-2xl">
            <div className="aspect-[21/9] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27720.540493756158!2d90.34019557543584!3d23.802889100000016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7007aeb08b7%3A0xebcc7d7e98201586!2zQnVsYnVsIEFjYWRlbXkgQmFmYSBTZXdyYXBhcmEs4Kas4KeB4Kay4Kas4KeB4KayIOCmj-CmleCmvuCmoeCnh-CmruCmvyDgpqzgpr7gpqvgpr4g4Ka24KeH4KaT4Kec4Ka-4Kaq4Ka-4Kec4Ka-IOCmtuCmvuCmluCmvg!5e1!3m2!1sen!2sbd!4v1772230976387!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
