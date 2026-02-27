import { Music, Palette, Mic, Guitar, Swords, User } from "lucide-react";

export const COURSES = [
    {
        id: "music",
        title: "সংগীত",
        description: "রবীন্দ্রসংগীত, নজরুলগীতি, ভক্তিগীতি ও আধুনিক গান শিক্ষা।",
        icon: Music,
        color: "bg-primary/10 text-primary",
    },
    {
        id: "dance",
        title: "নৃত্য",
        description: "আধুনিক, ভরতনাট্যম, কত্থক, মণিপুরী ও লোকনৃত্য প্রশিক্ষণ।",
        icon: User,
        color: "bg-secondary/10 text-secondary",
    },
    {
        id: "art",
        title: "চিত্রাংকন",
        description: "জলরং, তেলরং, পেন্সিল স্কেচ ও চিত্রাঙ্কন প্রশিক্ষণ।",
        icon: Palette,
        color: "bg-accent/10 text-accent",
    },
    {
        id: "recitation",
        title: "আবৃত্তি",
        description: "শুদ্ধ উচ্চারণ, বাচনভঙ্গি ও আবৃত্তি কলা শিক্ষা।",
        icon: Mic,
        color: "bg-gold/10 text-gold-foreground",
    },
    {
        id: "guitar",
        title: "গীটার",
        description: "আধুনিক গীটার প্রশিক্ষণ।",
        icon: Guitar,
        color: "bg-primary/10 text-primary",
    },
    {
        id: "karate",
        title: "কারাতে",
        description: "আত্মরক্ষা, শারীরিক গঠন ও শৃঙ্খলা ভিত্তিক কারাতে প্রশিক্ষণ।",
        icon: Swords,
        color: "bg-secondary/10 text-secondary",
    },
    {
        id: "tabla",
        title: "তবলা",
        description: "তবলা প্রশিক্ষন",
        icon: Music, // Using Music instead of Swords for Tabla as it's more appropriate
        color: "bg-secondary/10 text-secondary",
    },
];
