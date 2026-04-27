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
    'hero.card1Title': 'Offline First',
    'hero.card1Text': 'Works without internet',
    'hero.card2Title': 'All-in-One',
    'hero.card2Text': 'Clients, documents, calendar & more',
    'hero.card3Title': 'Secure',
    'hero.card3Text': 'Your data stays on your device',
    'hero.card4Title': 'Productive',
    'hero.card4Text': 'Built for speed and efficiency',
    'reports.title': 'Client Packages & Business Reports',
    'reports.subtitle': 'Import/export clients and generate key office reports in seconds.',
    'reports.importExportTitle': 'Client Import / Export',
    'reports.importExportText': 'Export a single client with full history and files, or import a package safely.',
    'reports.paymentTitle': 'Payments & Activity Reports',
    'reports.paymentText': 'Generate payment and activity reports by date range for quick financial and workflow tracking.',
    'compare.titleA': 'From daily chaos to',
    'compare.titleB': 'office control.',
    'compare.subtitle': 'See what your office misses without Officino, and what you gain with it.',
    'compare.leftHead': 'WITHOUT OFFICINO',
    'compare.left1': 'Client data spread across folders, chats, and notes',
    'compare.left2': 'Manual status tracking and missed application deadlines',
    'compare.left3': 'No clear call follow-up history for each client',
    'compare.left4': 'Scanning and documents handled in separate tools',
    'compare.left5': 'Slow report preparation for payments and activities',
    'compare.leftImpactValue': '-10h/week',
    'compare.leftImpactText': 'lost in manual work',
    'compare.rightHead': 'WITH OFFICINO',
    'compare.right1': 'One client profile with complete application history',
    'compare.right2': 'Clear status workflow and deadline visibility',
    'compare.right3': 'Call status tracking (not called / answered / no answer)',
    'compare.right4': 'Built-in scan, document preview, and PDF tools',
    'compare.right5': 'Fast payment and activity reports by date range',
    'compare.rightImpactValue': '+20h/week',
    'compare.rightImpactText': 'saved and recovered',
    'gallery.title': 'Officino Gallery',
    'gallery.subtitle': 'Showcase of real app screens.',
    'gallery.prev': '<',
    'gallery.next': '>',
    'gallery.counter': 'Slide {current} / {total}',
    'features.title': 'Amazing features to make your work easier',
    'features.subtitle': 'Everything your office needs to process files quickly and accurately.',
    'features.f1Title': 'Offline-first desktop app',
    'features.f1Text': 'Reliable daily workflow even without internet connection.',
    'features.f2Title': 'Scanner support (WIA/TWAIN + network)',
    'features.f2Text': 'Use local and LAN scanners in one integrated workflow.',
    'features.f3Title': 'PDF tools and client history',
    'features.f3Text': 'Handle files and track application history in one place.',
    'features.f4Title': 'LAN sync with host/guest modes',
    'features.f4Text': 'Connect office devices to collaborate over local network.',
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
    'contact.subtitle': "Need setup help or activation support? We're ready to assist.",
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
    'hero.card1Title': 'Sin conexión',
    'hero.card1Text': 'Funciona sin internet',
    'hero.card2Title': 'Todo en uno',
    'hero.card2Text': 'Clientes, documentos, calendario y más',
    'hero.card3Title': 'Seguro',
    'hero.card3Text': 'Tus datos permanecen en tu dispositivo',
    'hero.card4Title': 'Productivo',
    'hero.card4Text': 'Diseñado para velocidad y eficiencia',
    'reports.title': 'Paquetes de clientes e informes',
    'reports.subtitle': 'Importa/exporta clientes y genera informes clave de oficina en segundos.',
    'reports.importExportTitle': 'Importación / Exportación de clientes',
    'reports.importExportText': 'Exporta un cliente con historial completo y archivos, o importa un paquete de forma segura.',
    'reports.paymentTitle': 'Informes de pagos y actividad',
    'reports.paymentText': 'Genera informes de pagos y actividad por rango de fechas para control financiero y operativo.',
    'compare.titleA': 'Del caos diario al',
    'compare.titleB': 'control de oficina.',
    'compare.subtitle': 'Mira lo que tu oficina pierde sin Officino y lo que gana con él.',
    'compare.leftHead': 'SIN OFFICINO',
    'compare.left1': 'Datos de clientes repartidos entre carpetas, chats y notas',
    'compare.left2': 'Estados manuales y plazos de solicitudes perdidos',
    'compare.left3': 'Sin historial claro de seguimiento de llamadas',
    'compare.left4': 'Escaneo y documentos en herramientas separadas',
    'compare.left5': 'Preparación lenta de reportes de pagos y actividad',
    'compare.leftImpactValue': '-10h/semana',
    'compare.leftImpactText': 'perdidas en trabajo manual',
    'compare.rightHead': 'CON OFFICINO',
    'compare.right1': 'Un perfil por cliente con historial completo de solicitudes',
    'compare.right2': 'Flujo de estados claro y visibilidad de plazos',
    'compare.right3': 'Seguimiento de llamadas (no llamado / contestado / sin respuesta)',
    'compare.right4': 'Escaneo, vista previa de documentos y herramientas PDF integradas',
    'compare.right5': 'Reportes rápidos de pagos y actividad por rango de fechas',
    'compare.rightImpactValue': '+20h/semana',
    'compare.rightImpactText': 'ahorradas y recuperadas',
    'gallery.title': 'Galería Officino',
    'gallery.subtitle': 'Muestra de pantallas reales de la app.',
    'gallery.prev': '<',
    'gallery.next': '>',
    'gallery.counter': 'Diapositiva {current} / {total}',
    'features.title': 'Funciones increíbles para facilitar tu trabajo',
    'features.subtitle': 'Todo lo que tu oficina necesita para procesar archivos con rapidez y precisión.',
    'features.f1Title': 'App de escritorio sin conexión',
    'features.f1Text': 'Flujo diario confiable incluso sin internet.',
    'features.f2Title': 'Escáner (WIA/TWAIN + red)',
    'features.f2Text': 'Usa escáner local y de red en un solo flujo.',
    'features.f3Title': 'Herramientas PDF e historial',
    'features.f3Text': 'Gestiona archivos y el historial del cliente en un lugar.',
    'features.f4Title': 'Sincronización LAN host/invitado',
    'features.f4Text': 'Conecta equipos de oficina y colabora en red local.',
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
    'hero.card1Title': 'بدون إنترنت',
    'hero.card1Text': 'يعمل بدون اتصال',
    'hero.card2Title': 'الكل في واحد',
    'hero.card2Text': 'عملاء وملفات وتقويم وأكثر',
    'hero.card3Title': 'آمن',
    'hero.card3Text': 'بياناتك تبقى على جهازك',
    'hero.card4Title': 'إنتاجي',
    'hero.card4Text': 'مصمم للسرعة والكفاءة',
    'reports.title': 'حزم العملاء وتقارير المكتب',
    'reports.subtitle': 'استيراد/تصدير العملاء وإنشاء التقارير المهمة بسرعة.',
    'reports.importExportTitle': 'استيراد / تصدير العميل',
    'reports.importExportText': 'تصدير عميل واحد مع السجل الكامل والملفات، أو استيراد حزمة بشكل آمن.',
    'reports.paymentTitle': 'تقارير المدفوعات والنشاط',
    'reports.paymentText': 'إنشاء تقارير المدفوعات والنشاط حسب التاريخ لمتابعة مالية وتشغيلية سريعة.',
    'compare.titleA': 'من الفوضى اليومية إلى',
    'compare.titleB': 'التحكم في المكتب.',
    'compare.subtitle': 'شاهد ما تخسره المكاتب بدون Officino وما تكسبه معه.',
    'compare.leftHead': 'بدون OFFICINO',
    'compare.left1': 'بيانات العملاء موزعة بين المجلدات والمحادثات والملاحظات',
    'compare.left2': 'تتبع يدوي للحالات وضياع مواعيد الطلبات',
    'compare.left3': 'لا يوجد سجل واضح لمتابعة مكالمات العملاء',
    'compare.left4': 'المسح الضوئي والملفات في أدوات منفصلة',
    'compare.left5': 'بطء في إعداد تقارير المدفوعات والنشاط',
    'compare.leftImpactValue': '-10 ساعات/أسبوع',
    'compare.leftImpactText': 'مهدورة في العمل اليدوي',
    'compare.rightHead': 'مع OFFICINO',
    'compare.right1': 'ملف عميل واحد مع سجل كامل للطلبات',
    'compare.right2': 'سير عمل واضح للحالات مع متابعة المواعيد',
    'compare.right3': 'تتبع حالة المكالمة (غير متصل / تم الرد / لا إجابة)',
    'compare.right4': 'مسح ضوئي ومعاينة ملفات وأدوات PDF مدمجة',
    'compare.right5': 'تقارير سريعة للمدفوعات والنشاط حسب التاريخ',
    'compare.rightImpactValue': '+20 ساعة/أسبوع',
    'compare.rightImpactText': 'تم توفيرها واسترجاعها',
    'gallery.title': 'معرض Officino',
    'gallery.subtitle': 'عرض للشاشات الحقيقية للتطبيق.',
    'gallery.prev': '<',
    'gallery.next': '>',
    'gallery.counter': 'شريحة {current} / {total}',
    'features.title': 'مميزات قوية لتسهيل عملك',
    'features.subtitle': 'كل ما يحتاجه مكتبك لمعالجة الملفات بسرعة ودقة.',
    'features.f1Title': 'تطبيق مكتبي يعمل دون إنترنت',
    'features.f1Text': 'سير عمل يومي موثوق حتى بدون اتصال.',
    'features.f2Title': 'دعم الماسح (WIA/TWAIN + الشبكة)',
    'features.f2Text': 'استخدام الماسح المحلي وماسح الشبكة في تدفق واحد.',
    'features.f3Title': 'أدوات PDF وسجل العميل',
    'features.f3Text': 'إدارة الملفات وسجل الطلبات في مكان واحد.',
    'features.f4Title': 'مزامنة LAN بوضع مضيف/ضيف',
    'features.f4Text': 'ربط أجهزة المكتب والتعاون عبر الشبكة المحلية.',
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
  select.addEventListener('change', () => {
    applyLanguage(select.value);
    updateGalleryCounter();
  });
}

let galleryState = {
  index: 0,
  slides: []
};

function getGalleryCounterText(current, total) {
  const lang = resolveLanguage();
  const template = (I18N[lang] && I18N[lang]['gallery.counter']) || I18N.en['gallery.counter'];
  return template.replace('{current}', String(current)).replace('{total}', String(total));
}

function updateGalleryCounter() {
  const counter = document.getElementById('galleryCounter');
  if (!counter || !galleryState.slides.length) return;
  counter.textContent = getGalleryCounterText(galleryState.index + 1, galleryState.slides.length);
}

function bindGallery() {
  const image = document.getElementById('galleryImage');
  const dotsWrap = document.getElementById('galleryDots');
  const prev = document.getElementById('galleryPrev');
  const next = document.getElementById('galleryNext');
  if (!image || !dotsWrap || !prev || !next) return;

  galleryState.slides = Array.from({ length: 14 }, (_, i) => `/slidshow/slide-${String(i + 1).padStart(2, '0')}.png`);
  galleryState.index = 0;

  const dotButtons = galleryState.slides.map((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-dot';
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => {
      galleryState.index = i;
      render();
    });
    dotsWrap.appendChild(btn);
    return btn;
  });

  const render = () => {
    image.src = galleryState.slides[galleryState.index];
    updateGalleryCounter();
    dotButtons.forEach((btn, i) => btn.classList.toggle('active', i === galleryState.index));
  };

  const goNext = () => {
    galleryState.index = (galleryState.index + 1) % galleryState.slides.length;
    render();
  };

  prev.addEventListener('click', () => {
    galleryState.index = (galleryState.index - 1 + galleryState.slides.length) % galleryState.slides.length;
    render();
  });
  next.addEventListener('click', goNext);

  setInterval(goNext, 6000);
  render();
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
    if (submitBtn) submitBtn.disabled = true;
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
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

const yearNode = document.getElementById('yearNow');
if (yearNode) yearNode.textContent = String(new Date().getFullYear());

bindLanguageSelect();
applyLanguage(resolveLanguage());
loadMeta();
bindGallery();
bindOrderForm();
