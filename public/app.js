const LANG_STORAGE_KEY = 'officino_web_lang';
const SUPPORTED_LANGS = new Set(['en', 'es', 'ar']);

const I18N = {
  en: {
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.support': 'Support',
    'buttons.windows': 'Windows',
    'buttons.mac': 'macOS',
    'buttons.downloadWindows': 'Download for Windows',
    'buttons.downloadMac': 'Download for macOS',
    'hero.kicker': 'Office workflow made simple',
    'hero.title': 'Administrative desktop software for fast, secure daily work.',
    'hero.text': 'Manage clients, applications, scans, documents, and activation from one clean platform designed for real offices.',
    'heroCard.title': 'What You Get',
    'heroCard.li1': 'Offline-first desktop app',
    'heroCard.li2': 'Scanner support (WIA/TWAIN + network)',
    'heroCard.li3': 'PDF tools and client history',
    'heroCard.li4': 'LAN sync with host/guest modes',
    'heroCard.li5': 'Activation and license validation',
    'features.title': 'Amazing features to make your work easier',
    'features.subtitle': 'Everything your office needs to process files quickly and accurately.',
    'features.f1Title': 'Client Management',
    'features.f1Text': 'Track each customer with full application history and statuses.',
    'features.f2Title': 'Smart Document Flow',
    'features.f2Text': 'Import, preview, scan, and manage files from one place.',
    'features.f3Title': 'PDF Productivity',
    'features.f3Text': 'Merge, compress, crop, split, and convert with simple tools.',
    'features.f4Title': 'LAN Collaboration',
    'features.f4Text': 'Run host/guest mode so your team works from one shared source.',
    'features.f5Title': 'Activation Security',
    'features.f5Text': 'License key checks with admin control for activate/deactivate.',
    'features.f6Title': 'Built for Real Offices',
    'features.f6Text': 'Fast interface, clear steps, and multilingual support.',
    'how.title': 'How it Works',
    'how.subtitle': 'Simple flow for your team from installation to daily work.',
    'how.s1Title': 'Install the App',
    'how.s1Text': 'Download and install on your office computers.',
    'how.s2Title': 'Setup and Activate',
    'how.s2Text': 'Choose mode, configure folders, and activate your license key.',
    'how.s3Title': 'Start Working',
    'how.s3Text': 'Manage clients, scan files, and keep operations organized.',
    'contact.title': "Let's Stay Connected",
    'contact.subtitle': 'Need setup help or activation support? We’re ready to assist.',
    'contact.whatsappTitle': 'WhatsApp Support',
    'contact.whatsappText': 'Fast reply for setup and activation questions.',
    'contact.whatsappAction': 'Chat on WhatsApp',
    'contact.emailTitle': 'Email Support',
    'contact.emailText': 'Send screenshots or detailed issues by email.',
    'contact.emailAction': 'Send Email',
    'contact.note': 'Support contact: +34 642 190 408 · assouljawad823@gmail.com',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms and Conditions'
  },
  es: {
    'nav.features': 'Funciones',
    'nav.howItWorks': 'Cómo Funciona',
    'nav.support': 'Soporte',
    'buttons.windows': 'Windows',
    'buttons.mac': 'macOS',
    'buttons.downloadWindows': 'Descargar para Windows',
    'buttons.downloadMac': 'Descargar para macOS',
    'hero.kicker': 'Flujo de oficina simplificado',
    'hero.title': 'Software de escritorio administrativo para trabajo diario rápido y seguro.',
    'hero.text': 'Gestiona clientes, solicitudes, escaneos, documentos y activación desde una plataforma limpia para oficinas reales.',
    'heroCard.title': 'Qué Obtienes',
    'heroCard.li1': 'Aplicación de escritorio offline-first',
    'heroCard.li2': 'Compatibilidad de escáner (WIA/TWAIN + red)',
    'heroCard.li3': 'Herramientas PDF e historial del cliente',
    'heroCard.li4': 'Sincronización LAN con modos host/invitado',
    'heroCard.li5': 'Activación y validación de licencias',
    'features.title': 'Funciones increíbles para facilitar tu trabajo',
    'features.subtitle': 'Todo lo que tu oficina necesita para procesar archivos con rapidez y precisión.',
    'features.f1Title': 'Gestión de Clientes',
    'features.f1Text': 'Sigue cada cliente con historial completo de solicitudes y estados.',
    'features.f2Title': 'Flujo de Documentos Inteligente',
    'features.f2Text': 'Importa, previsualiza, escanea y gestiona archivos en un solo lugar.',
    'features.f3Title': 'Productividad PDF',
    'features.f3Text': 'Une, comprime, recorta, divide y convierte con herramientas simples.',
    'features.f4Title': 'Colaboración en LAN',
    'features.f4Text': 'Usa modo host/invitado para que el equipo trabaje con una sola fuente.',
    'features.f5Title': 'Seguridad de Activación',
    'features.f5Text': 'Verificación de licencias con control de activar/desactivar desde admin.',
    'features.f6Title': 'Hecho para Oficinas Reales',
    'features.f6Text': 'Interfaz rápida, pasos claros y soporte multilingüe.',
    'how.title': 'Cómo Funciona',
    'how.subtitle': 'Flujo simple para tu equipo desde la instalación hasta el trabajo diario.',
    'how.s1Title': 'Instala la App',
    'how.s1Text': 'Descarga e instala en los ordenadores de tu oficina.',
    'how.s2Title': 'Configura y Activa',
    'how.s2Text': 'Elige modo, configura carpetas y activa tu licencia.',
    'how.s3Title': 'Empieza a Trabajar',
    'how.s3Text': 'Gestiona clientes, escanea archivos y mantén todo organizado.',
    'contact.title': 'Sigamos Conectados',
    'contact.subtitle': '¿Necesitas ayuda con la configuración o activación? Estamos listos para ayudarte.',
    'contact.whatsappTitle': 'Soporte por WhatsApp',
    'contact.whatsappText': 'Respuesta rápida para dudas de configuración y activación.',
    'contact.whatsappAction': 'Abrir WhatsApp',
    'contact.emailTitle': 'Soporte por Email',
    'contact.emailText': 'Envía capturas o incidencias detalladas por correo.',
    'contact.emailAction': 'Enviar Email',
    'contact.note': 'Contacto de soporte: +34 642 190 408 · assouljawad823@gmail.com',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos y Condiciones'
  },
  ar: {
    'nav.features': 'المميزات',
    'nav.howItWorks': 'طريقة العمل',
    'nav.support': 'الدعم',
    'buttons.windows': 'ويندوز',
    'buttons.mac': 'ماك',
    'buttons.downloadWindows': 'تحميل لويندوز',
    'buttons.downloadMac': 'تحميل لماك',
    'hero.kicker': 'تنظيم العمل المكتبي بشكل أسهل',
    'hero.title': 'برنامج مكتبي إداري للعمل اليومي بسرعة وأمان.',
    'hero.text': 'إدارة العملاء والطلبات والمسح الضوئي والملفات والتفعيل من منصة واحدة واضحة ومناسبة للمكاتب.',
    'heroCard.title': 'ماذا ستحصل',
    'heroCard.li1': 'تطبيق مكتبي يعمل بدون إنترنت',
    'heroCard.li2': 'دعم الماسحات (WIA/TWAIN + شبكة)',
    'heroCard.li3': 'أدوات PDF وتاريخ العميل',
    'heroCard.li4': 'مزامنة LAN بوضع المضيف والضيف',
    'heroCard.li5': 'تفعيل الرخص والتحقق منها',
    'features.title': 'مميزات قوية لتسهيل عملك',
    'features.subtitle': 'كل ما يحتاجه مكتبك لمعالجة الملفات بسرعة ودقة.',
    'features.f1Title': 'إدارة العملاء',
    'features.f1Text': 'متابعة كل عميل مع سجل كامل للطلبات والحالات.',
    'features.f2Title': 'إدارة ذكية للملفات',
    'features.f2Text': 'استيراد ومعاينة ومسح وتنظيم الملفات من مكان واحد.',
    'features.f3Title': 'إنتاجية PDF',
    'features.f3Text': 'دمج وضغط وقص وتقسيم وتحويل بسهولة.',
    'features.f4Title': 'العمل عبر الشبكة',
    'features.f4Text': 'وضع المضيف والضيف ليعمل الفريق على مصدر واحد.',
    'features.f5Title': 'أمان التفعيل',
    'features.f5Text': 'التحكم في التفعيل والتعطيل من لوحة الإدارة.',
    'features.f6Title': 'مصمم للمكاتب الحقيقية',
    'features.f6Text': 'واجهة سريعة وخطوات واضحة ودعم متعدد اللغات.',
    'how.title': 'كيف يعمل',
    'how.subtitle': 'خطوات بسيطة من التثبيت إلى العمل اليومي.',
    'how.s1Title': 'ثبّت التطبيق',
    'how.s1Text': 'قم بالتحميل والتثبيت على أجهزة المكتب.',
    'how.s2Title': 'الإعداد والتفعيل',
    'how.s2Text': 'اختر الوضع، وحدد المسارات، ثم فعّل المفتاح.',
    'how.s3Title': 'ابدأ العمل',
    'how.s3Text': 'أدر العملاء وامسح الملفات ونظّم العمل اليومي.',
    'contact.title': 'لنحافظ على التواصل',
    'contact.subtitle': 'إذا احتجت دعمًا في الإعداد أو التفعيل فنحن جاهزون للمساعدة.',
    'contact.whatsappTitle': 'دعم واتساب',
    'contact.whatsappText': 'رد سريع لأسئلة الإعداد والتفعيل.',
    'contact.whatsappAction': 'محادثة عبر واتساب',
    'contact.emailTitle': 'دعم البريد الإلكتروني',
    'contact.emailText': 'أرسل صور الشاشة أو تفاصيل المشكلة عبر البريد.',
    'contact.emailAction': 'إرسال بريد',
    'contact.note': 'الدعم: +34 642 190 408 · assouljawad823@gmail.com',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'الشروط والأحكام'
  }
};

function resolveLanguage() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  if (SUPPORTED_LANGS.has(stored)) return stored;
  return 'en';
}

function applyLanguage(lang) {
  const language = SUPPORTED_LANGS.has(lang) ? lang : 'en';
  document.documentElement.lang = language;
  localStorage.setItem(LANG_STORAGE_KEY, language);
  const dictionary = I18N[language] || I18N.en;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (!key) return;
    node.textContent = dictionary[key] || I18N.en[key] || node.textContent;
  });
  const select = document.getElementById('langSelect');
  if (select) select.value = language;
}

async function loadMeta() {
  try {
    const response = await fetch('/api/meta');
    const data = await response.json();
    if (!data || !data.ok) return;
    const windows = document.getElementById('downloadWindows');
    const mac = document.getElementById('downloadMac');
    const windowsHero = document.getElementById('downloadWindowsHero');
    const macHero = document.getElementById('downloadMacHero');
    if (windows) windows.href = data.downloads.windows || '#';
    if (mac) mac.href = data.downloads.mac || '#';
    if (windowsHero) windowsHero.href = data.downloads.windows || '#';
    if (macHero) macHero.href = data.downloads.mac || '#';
  } catch (error) {
    // ignore
  }
}

function bindLanguageSelect() {
  const select = document.getElementById('langSelect');
  if (!select) return;
  select.addEventListener('change', () => {
    applyLanguage(select.value);
  });
}

const yearNode = document.getElementById('yearNow');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

bindLanguageSelect();
applyLanguage(resolveLanguage());
loadMeta();
