import { ContactItem } from "../types";
import { Mail, Phone, Twitter, Instagram } from "lucide-angular";

export const SUPPORT_X = "pocket_pilot";
export const SUPPORT_TIKTOK = "pocket_pilot";
export const SUPPORT_INSTAGRAM = "pocketpilot";
export const SUPPORT_PHONE = "+1(555)123-4567";
export const SUPPORT_EMAIL = "support@pocketpilot.com";

export const CONTACT_ITEMS: ContactItem[] = [
    {
        id: "email",
        icon: Mail,
        value: SUPPORT_EMAIL,
        link: `mailto:${SUPPORT_EMAIL}`,
    },
    {
        id: "phone",
        icon: Phone,
        value: SUPPORT_PHONE,
        link: `tel:${SUPPORT_PHONE}`,
    },
    {
        id: "tiktok",
        icon: Twitter,
        value: SUPPORT_X,
        link: `https://x.com/${SUPPORT_X}`,
    },
    {
        id: "instagram",
        icon: Instagram,
        value: SUPPORT_INSTAGRAM,
        link: `https://www.instagram.com/${SUPPORT_INSTAGRAM}`,
    },
].reverse();
