const LANG_STORAGE_KEY = 'officino_web_lang';
const SUPPORTED_LANGS = new Set(['en', 'es', 'ar']);

const I18N = {
  en: {
    'nav.features': 'Features',
    'nav.howItWorks': 'How It Works',
    'nav.support': 'Support',
    'buttons.windows': 'Windows',
    'buttons.downloadWindows': 'Download for Windows',
    'buttons.downloadOrder': 'Order Your Copy',
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
    'contact.subtitle': 'Need setup help or activation support? We are ready to assist.',
    'contact.whatsappTitle': 'WhatsApp Support',
    'contact.whatsappText': 'Fast reply for setup and activation questions.',
    'contact.whatsappAction': 'Chat on WhatsApp',
    'contact.emailTitle': 'Email Support',
    'contact.emailText': 'Send screenshots or detailed issues by email.',
    'contact.emailAction': 'Send Email',
    'contact.note': 'Support contact: +34 642 190 408 · assouljawad823@gmail.com',
    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms and Conditions',
    'order.title': 'Order Officino',
    'order.subtitle': 'Fill your details and we will contact you with activation info.',
    'order.firstName': 'First Name',
    'order.lastName': 'Last Name',
    'order.email': 'Email',
    'order.phone': 'Phone Number',
    'order.submit': 'Submit Order',
    'order.success': 'Order received successfully. We will contact you soon.',
    'order.error': 'Could not submit your order. Please try again.'
  },
  es: {
    'nav.features': 'Funciones',
    'nav.howItWorks': 'Cómo funciona',
    'nav.support': 'Soporte',
    'buttons.windows': 'Windows',
    'buttons.downloadWindows': 'Descargar para Windows',
    'buttons.downloadOrder': 'Solicitar tu copia',
    'hero.kicker': 'Flujo de oficina simplificado',
    'hero.title': 'Software de escritorio administrativo para trabajo diario rápido y seguro.',
    'hero.text': 'Gestiona clientes, solicitudes, escaneos, documentos y activación desde una plataforma limpia para oficinas reales.',
    'heroCard.title': 'Qué obtienes',
    'heroCard.li1': 'Aplicación de escritorio offline-first',
    'heroCard.li2': 'Compatibilidad de escáner (WIA/TWAIN + red)',
    'heroCard.li3': 'Herramientas PDF e historial del cliente',
    'heroCard.li4': 'Sincronización LAN con modos host/invitado',
    'heroCard.li5': 'Activación y validación de licencias',
    'features.title': 'Funciones increíbles para facilitar tu trabajo',
    'features.subtitle': 'Todo lo que tu oficina necesita para procesar archivos con rapidez y precisión.',
    'features.f1Title': 'Gestión de clientes',
    'features.f1Text': 'Sigue cada cliente con historial completo de solicitudes y estados.',
    'features.f2Title': 'Flujo de documentos inteligente',
    'features.f2Text': 'Importa, previsualiza, escanea y gestiona archivos en un solo lugar.',
    'features.f3Title': 'Productividad PDF',
    'features.f3Text': 'Une, comprime, recorta, divide y convierte con herramientas simples.',
    'features.f4Title': 'Colaboración en LAN',
    'features.f4Text': 'Usa modo host/invitado para que el equipo trabaje con una sola fuente.',
    'features.f6Title': 'Hecho para oficinas reales',
    'features.f6Text': 'Interfaz rápida, pasos claros y soporte multilingüe.',
    'how.title': 'Cómo funciona',
    'how.subtitle': 'Flujo simple para tu equipo desde la instalación hasta el trabajo diario.',
    'how.s1Title': 'Instala la app',
    'how.s1Text': 'Descarga e instala en los ordenadores de tu oficina.',
    'how.s2Title': 'Configura y activa',
    'how.s2Text': 'Elige modo, configura carpetas y activa tu licencia.',
    'how.s3Title': 'Empieza a trabajar',
    'how.s3Text': 'Gestiona clientes, escanea archivos y mantén todo organizado.',
    'contact.title': 'Sigamos conectados',
    'contact.subtitle': '¿Necesitas ayuda con la configuración o activación? Estamos listos para ayudarte.',
    'contact.whatsappTitle': 'Soporte por WhatsApp',
    'contact.whatsappText': 'Respuesta rápida para dudas de configuración y activación.',
    'contact.whatsappAction': 'Abrir WhatsApp',
    'contact.emailTitle': 'Soporte por email',
    'contact.emailText': 'Envía capturas o incidencias detalladas por correo.',
    'contact.emailAction': 'Enviar email',
    'contact.note': 'Contacto de soporte: +34 642 190 408 · assouljawad823@gmail.com',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'Política de privacidad',
    'footer.terms': 'Términos y condiciones',
    'order.title': 'Solicitar Officino',
    'order.subtitle': 'Completa tus datos y te contactaremos con la información de activación.',
    'order.firstName': 'Nombre',
    'order.lastName': 'Apellidos',
    'order.email': 'Correo electrónico',
    'order.phone': 'Número de teléfono',
    'order.submit': 'Enviar solicitud',
    'order.success': 'Solicitud recibida correctamente. Te contactaremos pronto.',
    'order.error': 'No se pudo enviar la solicitud. Inténtalo de nuevo.'
  },
  ar: {
    'nav.features': 'المميزات',
    'nav.howItWorks': 'طريقة العمل',
    'nav.support': 'الدعم',
    'buttons.windows': 'ويندوز',
    'buttons.downloadWindows': 'تحميل لويندوز',
    'buttons.downloadOrder': 'اطلب نسختك',
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
    'features.f6Title': 'مصمم للمكاتب الحقيقية',
    'features.f6Text': 'واجهة سريعة وخطوات واضحة ودعم متعدد اللغات.',
    'how.title': 'كيف يعمل',
    'how.subtitle': 'خطوات بسيطة من التثبيت إلى العمل اليومي.',
    'how.s1Title': 'ثبّت التطبيق',
    'how.s1Text': 'قم بالتحميل والتثبيت على أجهزة المكتب.',
    'how.s2Title': 'الإعداد والتفعيل',
    'how.s2Text': 'اختر الوضع وحدد المسارات ثم فعّل المفتاح.',
    'how.s3Title': 'ابدأ العمل',
    'how.s3Text': 'أدر العملاء وامسح الملفات ونظّم العمل اليومي.',
    'contact.title': 'لنبقَ على تواصل',
    'contact.subtitle': 'إذا احتجت دعماً في الإعداد أو التفعيل فنحن جاهزون للمساعدة.',
    'contact.whatsappTitle': 'دعم واتساب',
    'contact.whatsappText': 'رد سريع لأسئلة الإعداد والتفعيل.',
    'contact.whatsappAction': 'محادثة عبر واتساب',
    'contact.emailTitle': 'دعم البريد الإلكتروني',
    'contact.emailText': 'أرسل صور الشاشة أو تفاصيل المشكلة عبر البريد.',
    'contact.emailAction': 'إرسال بريد',
    'contact.note': 'الدعم: +34 642 190 408 · assouljawad823@gmail.com',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'الشروط والأحكام',
    'order.title': 'طلب Officino',
    'order.subtitle': 'املأ بياناتك وسنتواصل معك بمعلومات التفعيل.',
    'order.firstName': 'الاسم الأول',
    'order.lastName': 'الاسم الأخير',
    'order.email': 'البريد الإلكتروني',
    'order.phone': 'رقم الهاتف',
    'order.submit': 'إرسال الطلب',
    'order.success': 'تم استلام الطلب بنجاح. سنتواصل معك قريباً.',
    'order.error': 'تعذر إرسال الطلب. حاول مرة أخرى.'
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
  const windows = document.getElementById('downloadWindows');
  const windowsHero = document.getElementById('downloadWindowsHero');
  if (!windows && !windowsHero) return;
  try {
    const response = await fetch('/api/meta');
    const data = await response.json();
    if (!data || !data.ok) return;
    if (windows) windows.href = data.downloads.windows || '#';
    if (windowsHero) windowsHero.href = data.downloads.windows || '#';
  } catch (error) {
    // ignore
  }
}

function bindLanguageSelect() {
  const select = document.getElementById('langSelect');
  if (!select) return;
  select.addEventListener('change', () => applyLanguage(select.value));
}

function bindOrderForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;
  const result = document.getElementById('orderResult');
  const successBanner = document.getElementById('orderSuccessBanner');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      firstName: String(document.getElementById('orderFirstName')?.value || '').trim(),
      lastName: String(document.getElementById('orderLastName')?.value || '').trim(),
      email: String(document.getElementById('orderEmail')?.value || '').trim(),
      phone: String(document.getElementById('orderPhone')?.value || '').trim(),
      website: String(document.getElementById('website')?.value || '').trim()
    };
    const submitBtn = document.getElementById('orderSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    if (result) {
      result.className = 'small mt-3 text-muted';
      result.textContent = '';
    }
    if (successBanner) {
      successBanner.classList.add('d-none');
      successBanner.textContent = '';
    }
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        throw new Error((data && data.message) || I18N.en['order.error']);
      }
      form.reset();
      if (successBanner) {
        successBanner.classList.remove('d-none');
        successBanner.textContent = I18N[resolveLanguage()]['order.success'] || I18N.en['order.success'];
      }
    } catch (error) {
      if (result) {
        result.className = 'small mt-3 text-danger';
        result.textContent = String(error.message || I18N.en['order.error']);
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
}

const yearNode = document.getElementById('yearNow');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

bindLanguageSelect();
applyLanguage(resolveLanguage());
loadMeta();
bindOrderForm();
