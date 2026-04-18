// Düzenlenebilir alan tanımları. Her field bir CSS selector ile şablonda hedefleniyor.
// type: "text" → tek satır, "textarea" → çok satır, "html" → HTML içeriği (örn. <span> içeren başlıklar)

export type FieldType = "text" | "textarea" | "html" | "url" | "image";

export interface FieldDef {
  id: string;
  label: string;
  selector: string; // CSS selector (her zaman ilk eşleşme)
  type: FieldType;
  // attribute setlenecekse (örn. href, src). Yoksa innerHTML/innerText.
  attr?: string;
  group?: string;
  helper?: string;
}

export interface PageDef {
  id: string;
  title: string;
  fileName: string; // indirildiğinde kullanılacak isim
  templateKey: "index" | "hakkimda" | "hizmetler" | "portfolyo" | "iletisim";
  fields: FieldDef[];
}

// Ortak: tüm sayfalarda nav, footer, meta — paylaşılan "shared" düzenleme
export const SHARED_FIELDS: FieldDef[] = [
  { id: "logo_main", label: "Logo - Ana Yazı", selector: "nav a.logo", type: "html", group: "Logo & Navigasyon", helper: 'Ör: SERDAR<span>ŞEKER</span>' },
  { id: "nav_home", label: "Menü: Ana Sayfa", selector: 'nav .nav-links li:nth-child(1) a', type: "text", group: "Logo & Navigasyon" },
  { id: "nav_about", label: "Menü: Hakkımda", selector: 'nav .nav-links li:nth-child(2) a', type: "text", group: "Logo & Navigasyon" },
  { id: "nav_services", label: "Menü: Hizmetler", selector: 'nav .nav-links li:nth-child(3) a', type: "text", group: "Logo & Navigasyon" },
  { id: "nav_portfolio", label: "Menü: Projeler", selector: 'nav .nav-links li:nth-child(4) a', type: "text", group: "Logo & Navigasyon" },
  { id: "nav_contact", label: "Menü: İletişim", selector: 'nav .nav-links li:nth-child(5) a', type: "text", group: "Logo & Navigasyon" },

  { id: "footer_tagline", label: "Footer - Slogan", selector: "footer .footer-col:nth-child(1) p", type: "textarea", group: "Footer" },
  { id: "footer_linkedin", label: "Footer - LinkedIn URL", selector: 'footer .footer-col:nth-child(1) a[href*="linkedin"]', type: "url", attr: "href", group: "Footer" },
  { id: "footer_instagram", label: "Footer - Instagram URL", selector: 'footer .footer-col:nth-child(1) a[href*="instagram"]', type: "url", attr: "href", group: "Footer" },

  { id: "footer_email", label: "Footer - E-posta", selector: "footer .footer-col:nth-child(4) li:nth-child(1)", type: "text", group: "Footer İletişim" },
  { id: "footer_address", label: "Footer - Adres", selector: "footer .footer-col:nth-child(4) li:nth-child(2)", type: "text", group: "Footer İletişim" },
  { id: "footer_whatsapp", label: "Footer - WhatsApp Linki", selector: 'footer .footer-col:nth-child(4) a[href*="wa.me"]', type: "url", attr: "href", group: "Footer İletişim" },

  { id: "copyright", label: "Telif Yazısı", selector: "footer .copyright", type: "html", group: "Footer" },
];

export const PAGES: PageDef[] = [
  {
    id: "index",
    title: "Ana Sayfa",
    fileName: "index.html",
    templateKey: "index",
    fields: [
      { id: "hero_title", label: "Hero Başlık", selector: "header h1", type: "html", group: "Hero", helper: 'HTML kullanabilirsiniz: <br>, <span class="accent-text">' },
      { id: "hero_slogan", label: "Hero Slogan", selector: "header .slogan", type: "textarea", group: "Hero" },
      { id: "hero_btn", label: "Hero Buton Yazısı", selector: "header a.btn", type: "text", group: "Hero" },

      { id: "vision_card1_title", label: "Vizyon Kart 1 - Başlık", selector: "#vision .card:nth-child(1) h3", type: "text", group: "Vizyon Kartları" },
      { id: "vision_card1_desc", label: "Vizyon Kart 1 - Açıklama", selector: "#vision .card:nth-child(1) p", type: "textarea", group: "Vizyon Kartları" },
      { id: "vision_card2_title", label: "Vizyon Kart 2 - Başlık", selector: "#vision .card:nth-child(2) h3", type: "text", group: "Vizyon Kartları" },
      { id: "vision_card2_desc", label: "Vizyon Kart 2 - Açıklama", selector: "#vision .card:nth-child(2) p", type: "textarea", group: "Vizyon Kartları" },

      { id: "process_title", label: "Süreç - Başlık", selector: "#process-tech > div:first-child h2", type: "html", group: "Süreç Bölümü" },
      { id: "process_subtitle", label: "Süreç - Alt Başlık", selector: "#process-tech > div:first-child p", type: "text", group: "Süreç Bölümü" },
      { id: "process_step1", label: "Süreç Adım 1 - Açıklama", selector: "#process-tech .grid .card:nth-child(1) p", type: "textarea", group: "Süreç Bölümü" },
      { id: "process_step2", label: "Süreç Adım 2 - Açıklama", selector: "#process-tech .grid .card:nth-child(2) p", type: "textarea", group: "Süreç Bölümü" },
      { id: "process_step3", label: "Süreç Adım 3 - Açıklama", selector: "#process-tech .grid .card:nth-child(3) p", type: "textarea", group: "Süreç Bölümü" },

      { id: "analysis_title", label: "Analiz Form - Başlık", selector: ".analysis-box h2", type: "html", group: "Analiz Formu" },
      { id: "analysis_desc", label: "Analiz Form - Açıklama", selector: ".analysis-box > p", type: "text", group: "Analiz Formu" },
      { id: "analysis_placeholder", label: "Analiz Form - Input Placeholder", selector: ".analysis-box input", type: "text", attr: "placeholder", group: "Analiz Formu" },
      { id: "analysis_btn", label: "Analiz Form - Buton", selector: ".analysis-box button", type: "text", group: "Analiz Formu" },
      { id: "analysis_target", label: "Analiz Form - Hedef URL", selector: ".analysis-box form", type: "url", attr: "action", group: "Analiz Formu" },
    ],
  },
  {
    id: "hakkimda",
    title: "Hakkımda",
    fileName: "hakkimda.html",
    templateKey: "hakkimda",
    fields: [
      { id: "about_title", label: "Sayfa Başlığı", selector: "header.about-header h1", type: "html", group: "Başlık" },
      { id: "about_card_title", label: "Kart Başlığı", selector: ".about-card h2", type: "text", group: "İçerik" },
      { id: "about_p1", label: "Paragraf 1", selector: ".about-card p:nth-of-type(1)", type: "textarea", group: "İçerik" },
      { id: "about_p2", label: "Paragraf 2", selector: ".about-card p:nth-of-type(2)", type: "textarea", group: "İçerik" },
      { id: "about_p3", label: "Paragraf 3", selector: ".about-card p:nth-of-type(3)", type: "textarea", group: "İçerik" },
    ],
  },
  {
    id: "hizmetler",
    title: "Hizmetler",
    fileName: "hizmetler.html",
    templateKey: "hizmetler",
    fields: [
      { id: "svc_title", label: "Sayfa Başlığı", selector: "header.services-header h1", type: "html", group: "Başlık" },
      { id: "svc_subtitle", label: "Alt Başlık", selector: "header.services-header p", type: "text", group: "Başlık" },

      { id: "svc1_title", label: "Hizmet 1 - Başlık", selector: ".services-grid .service-card:nth-child(1) h3", type: "text", group: "Hizmet 1" },
      { id: "svc1_desc", label: "Hizmet 1 - Açıklama", selector: ".services-grid .service-card:nth-child(1) p", type: "textarea", group: "Hizmet 1" },
      { id: "svc2_title", label: "Hizmet 2 - Başlık", selector: ".services-grid .service-card:nth-child(2) h3", type: "text", group: "Hizmet 2" },
      { id: "svc2_desc", label: "Hizmet 2 - Açıklama", selector: ".services-grid .service-card:nth-child(2) p", type: "textarea", group: "Hizmet 2" },
      { id: "svc3_title", label: "Hizmet 3 - Başlık", selector: ".services-grid .service-card:nth-child(3) h3", type: "text", group: "Hizmet 3" },
      { id: "svc3_desc", label: "Hizmet 3 - Açıklama", selector: ".services-grid .service-card:nth-child(3) p", type: "textarea", group: "Hizmet 3" },

      { id: "svc_cta_text", label: "CTA Yazısı", selector: ".cta-container p", type: "text", group: "CTA" },
      { id: "svc_cta_btn", label: "CTA Buton", selector: ".cta-container a.btn", type: "text", group: "CTA" },
    ],
  },
  {
    id: "portfolyo",
    title: "Portfolyo",
    fileName: "portfolyo.html",
    templateKey: "portfolyo",
    fields: [
      { id: "pf_title", label: "Sayfa Başlığı", selector: "header.portfolio-header h1", type: "html", group: "Başlık" },
      { id: "pf_subtitle", label: "Alt Başlık", selector: "header.portfolio-header p", type: "text", group: "Başlık" },

      { id: "pf1_tag", label: "Proje 1 - Etiket", selector: ".portfolio-grid .project-card:nth-child(1) .project-tag", type: "text", group: "Proje 1" },
      { id: "pf1_title", label: "Proje 1 - Başlık", selector: ".portfolio-grid .project-card:nth-child(1) h3", type: "text", group: "Proje 1" },
      { id: "pf1_desc", label: "Proje 1 - Açıklama", selector: ".portfolio-grid .project-card:nth-child(1) p", type: "textarea", group: "Proje 1" },
      { id: "pf1_link", label: "Proje 1 - Link URL", selector: ".portfolio-grid .project-card:nth-child(1) .project-link", type: "url", attr: "href", group: "Proje 1" },

      { id: "pf2_tag", label: "Proje 2 - Etiket", selector: ".portfolio-grid .project-card:nth-child(2) .project-tag", type: "text", group: "Proje 2" },
      { id: "pf2_title", label: "Proje 2 - Başlık", selector: ".portfolio-grid .project-card:nth-child(2) h3", type: "text", group: "Proje 2" },
      { id: "pf2_desc", label: "Proje 2 - Açıklama", selector: ".portfolio-grid .project-card:nth-child(2) p", type: "textarea", group: "Proje 2" },
      { id: "pf2_link", label: "Proje 2 - Link URL", selector: ".portfolio-grid .project-card:nth-child(2) .project-link", type: "url", attr: "href", group: "Proje 2" },
    ],
  },
  {
    id: "iletisim",
    title: "İletişim",
    fileName: "iletisim.html",
    templateKey: "iletisim",
    fields: [
      { id: "ct_title", label: "Sayfa Başlığı", selector: ".page-header h1", type: "html", group: "Başlık" },
      { id: "ct_subtitle", label: "Alt Başlık", selector: ".page-header p", type: "text", group: "Başlık" },

      { id: "ct_card1_title", label: "Kart 1 - Başlık", selector: ".contact-grid .contact-card:nth-child(1) h3", type: "text", group: "İletişim Bilgileri" },
      { id: "ct_email", label: "E-posta", selector: ".contact-grid .contact-card:nth-child(1) .contact-info-item:nth-child(2) span", type: "text", group: "İletişim Bilgileri" },
      { id: "ct_address", label: "Adres", selector: ".contact-grid .contact-card:nth-child(1) .contact-info-item:nth-child(3) span", type: "text", group: "İletişim Bilgileri" },
      { id: "ct_hours", label: "Çalışma Saatleri", selector: ".contact-grid .contact-card:nth-child(1) .contact-info-item:nth-child(4) span", type: "text", group: "İletişim Bilgileri" },

      { id: "ct_card2_title", label: "Kart 2 - Başlık", selector: ".contact-grid .contact-card:nth-child(2) h3", type: "text", group: "Hızlı Erişim" },
      { id: "ct_card2_desc", label: "Kart 2 - Açıklama", selector: ".contact-grid .contact-card:nth-child(2) p", type: "textarea", group: "Hızlı Erişim" },
      { id: "ct_wp_btn", label: "WhatsApp Buton Yazısı", selector: ".contact-grid .contact-card:nth-child(2) a.btn-action", type: "html", group: "Hızlı Erişim" },
      { id: "ct_wp_url", label: "WhatsApp URL", selector: ".contact-grid .contact-card:nth-child(2) a.btn-action", type: "url", attr: "href", group: "Hızlı Erişim" },
    ],
  },
];

// Site geneli tema değişkenleri
export interface ThemeSettings {
  bg: string;
  accent: string;
  text: string;
  textDim: string;
  fontFamily: string;
  baseFontSize: number; // px (16 default)
}

export const DEFAULT_THEME: ThemeSettings = {
  bg: "#05070a",
  accent: "#007AFF",
  text: "#f8fafc",
  textDim: "#94a3b8",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  baseFontSize: 16,
};

export const FONT_OPTIONS = [
  { label: "Plus Jakarta Sans (varsayılan)", value: "'Plus Jakarta Sans', sans-serif", googleName: "Plus+Jakarta+Sans:wght@300;400;600;800" },
  { label: "Inter", value: "'Inter', sans-serif", googleName: "Inter:wght@300;400;600;800" },
  { label: "Poppins", value: "'Poppins', sans-serif", googleName: "Poppins:wght@300;400;600;800" },
  { label: "Montserrat", value: "'Montserrat', sans-serif", googleName: "Montserrat:wght@300;400;600;800" },
  { label: "Roboto", value: "'Roboto', sans-serif", googleName: "Roboto:wght@300;400;500;700" },
  { label: "Open Sans", value: "'Open Sans', sans-serif", googleName: "Open+Sans:wght@300;400;600;700" },
  { label: "Lato", value: "'Lato', sans-serif", googleName: "Lato:wght@300;400;700;900" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif", googleName: "Space+Grotesk:wght@300;400;500;700" },
];
