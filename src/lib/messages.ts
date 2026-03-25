import type { Locale } from "@/lib/locale";
import { isLocale } from "@/lib/locale";

export type Messages = typeof messages.en;

export const messages = {
  en: {
    nav: {
      animals: "Animals",
      war: "War-Affected",
      reports: "Reports",
      team: "Team",
      blog: "Updates",
      donate: "Donate",
      dashboard: "Dashboard",
      signIn: "Sign In",
    },
    hero: {
      headline: "Saving Lives That Cannot Speak",
      subheadline:
        "Premium transparency for a brutal reality: rescues, medical reports, and recovery timelines — especially from war zones.",
      donate: "Donate Now",
      monthly: "Become a Monthly Supporter",
    },
    stats: {
      rescued: "Animals rescued",
      treated: "Animals treated",
      countries: "Countries helped",
      donated: "Total donated",
    },
    war: {
      headline: "War-Affected Animals",
      banner:
        "Emergency support keeps field clinics supplied with antibiotics, anesthesia, and food.",
      cta: "Emergency Donation",
    },
  },
  ar: {
    nav: {
      animals: "الحيوانات",
      war: "حيوانات مناطق الحرب",
      reports: "التقارير",
      team: "الفريق",
      blog: "التحديثات",
      donate: "تبرع",
      dashboard: "لوحة التحكم",
      signIn: "تسجيل الدخول",
    },
    hero: {
      headline: "إنقاذ أرواح لا تستطيع الكلام",
      subheadline:
        "شفافية بمعايير عالية: عمليات إنقاذ، تقارير طبية، وخط زمني للتعافي — وخاصة من مناطق الحرب.",
      donate: "تبرع الآن",
      monthly: "ادعم شهرياً",
    },
    stats: {
      rescued: "حيوانات تم إنقاذها",
      treated: "حيوانات تم علاجها",
      countries: "بلدان تمت المساعدة فيها",
      donated: "إجمالي التبرعات",
    },
    war: {
      headline: "حيوانات متأثرة بالحرب",
      banner:
        "الدعم العاجل يزوّد عيادات الميدان بالمضادات الحيوية والتخدير والغذاء.",
      cta: "تبرع عاجل",
    },
  },
} as const;

export function getMessages(locale: Locale | string) {
  if (typeof locale === "string") {
    return isLocale(locale) ? messages[locale] : messages.en;
  }
  return messages[locale] ?? messages.en;
}
