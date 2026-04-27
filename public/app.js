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
    'gallery.title': 'Officino Gallery',
    'gallery.subtitle': 'A quick look at the real screens your team uses every day.',
    'gallery.prev': '<',
    'gallery.next': '>',
    'gallery.counter': 'Slide {current} / {total}',
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
    'contact.subtitle': 'Need setup help or activation support? We are ready to assist.',
    'contact.whatsappTitle': 'WhatsApp Support',
    'contact.whatsappText': 'Fast reply for setup and activation questions.',
    'contact.whatsappAction': 'Chat on WhatsApp',
    'contact.emailTitle': 'Email Support',
    'contact.emailText': 'Send screenshots or detailed issues by email.',
    'contact.emailAction': 'Send Email',
    'contact.note': 'Support contact: +34 642 190 408 Â· assouljawad823@gmail.com',
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
    'nav.howItWorks': 'CÃ³mo funciona',
    'nav.support': 'Soporte',
    'buttons.windows': 'Windows',
    'buttons.downloadWindows': 'Descargar para Windows',
    'buttons.downloadOrder': 'Solicitar tu copia',
    'hero.kicker': 'Flujo de oficina simplificado',
    'hero.title': 'Software de escritorio administrativo para trabajo diario rÃ¡pido y seguro.',
    'hero.text': 'Gestiona clientes, solicitudes, escaneos, documentos y activaciÃ³n desde una plataforma limpia para oficinas reales.',
    'hero.card1Title': 'Sin conexiÃ³n',
    'hero.card1Text': 'Funciona sin internet',
    'hero.card2Title': 'Todo en uno',
    'hero.card2Text': 'Clientes, documentos, calendario y mÃ¡s',
    'hero.card3Title': 'Seguro',
    'hero.card3Text': 'Tus datos permanecen en tu dispositivo',
    'hero.card4Title': 'Productivo',
    'hero.card4Text': 'DiseÃ±ado para velocidad y eficiencia',
    'reports.title': 'Paquetes de clientes e informes',
    'reports.subtitle': 'Importa/exporta clientes y genera informes clave de oficina en segundos.',
    'reports.importExportTitle': 'ImportaciÃ³n / ExportaciÃ³n de clientes',
    'reports.importExportText': 'Exporta un cliente con historial completo y archivos, o importa un paquete de forma segura.',
    'reports.paymentTitle': 'Informes de pagos y actividad',
    'reports.paymentText': 'Genera informes de pagos y actividad por rango de fechas para control financiero y operativo.',
    'gallery.title': 'GalerÃ­a Officino',
    'gallery.subtitle': 'Una vista rÃ¡pida de las pantallas reales que usa tu equipo cada dÃ­a.',
    'gallery.prev': '<',
    'gallery.next': '>',
    'gallery.counter': 'Slide {current} / {total}',
        'compare.titleA': 'Del caos diario al',
    'compare.titleB': 'control de oficina.',
    'compare.subtitle': 'Mira lo que tu oficina pierde sin Officino y lo que gana con Ã©l.',
    'compare.leftHead': 'SIN OFFICINO',
    'compare.left1': 'Datos de clientes repartidos entre carpetas, chats y notas',
    'compare.left2': 'Estados manuales y plazos de solicitudes perdidos',
    'compare.left3': 'Sin historial claro de seguimiento de llamadas',
    'compare.left4': 'Escaneo y documentos en herramientas separadas',
    'compare.left5': 'PreparaciÃ³n lenta de reportes de pagos y actividad',
    'compare.leftImpactValue': '-10h/semana',
    'compare.leftImpactText': 'perdidas en trabajo manual',
    'compare.rightHead': 'CON OFFICINO',
    'compare.right1': 'Un perfil por cliente con historial completo de solicitudes',
    'compare.right2': 'Flujo de estados claro y visibilidad de plazos',
    'compare.right3': 'Seguimiento de llamadas (no llamado / contestado / sin respuesta)',
    'compare.right4': 'Escaneo, vista previa de documentos y herramientas PDF integradas',
    'compare.right5': 'Reportes rÃ¡pidos de pagos y actividad por rango de fechas',
    'compare.rightImpactValue': '+20h/semana',
    'compare.rightImpactText': 'ahorradas y recuperadas',
    'features.title': 'Funciones increÃ­bles para facilitar tu trabajo',
    'features.subtitle': 'Todo lo que tu oficina necesita para procesar archivos con rapidez y precisiÃ³n.',
    'features.f1Title': 'App de escritorio sin conexiÃ³n',
    'features.f1Text': 'Flujo diario confiable incluso sin internet.',
    'features.f2Title': 'EscÃ¡ner (WIA/TWAIN + red)',
    'features.f2Text': 'Usa escÃ¡ner local y de red en un solo flujo.',
    'features.f3Title': 'Herramientas PDF e historial',
    'features.f3Text': 'Gestiona archivos y el historial del cliente en un lugar.',
    'features.f4Title': 'SincronizaciÃ³n LAN host/invitado',
    'features.f4Text': 'Conecta equipos de oficina y colabora en red local.',
    'features.f6Title': 'Hecho para oficinas reales',
    'features.f6Text': 'Interfaz rÃ¡pida, pasos claros y soporte multilingÃ¼e.',
    'how.title': 'CÃ³mo funciona',
    'how.subtitle': 'Flujo simple para tu equipo desde la instalaciÃ³n hasta el trabajo diario.',
    'how.s1Title': 'Instala la app',
    'how.s1Text': 'Descarga e instala en los ordenadores de tu oficina.',
    'how.s2Title': 'Configura y activa',
    'how.s2Text': 'Elige modo, configura carpetas y activa tu licencia.',
    'how.s3Title': 'Empieza a trabajar',
    'how.s3Text': 'Gestiona clientes, escanea archivos y mantÃ©n todo organizado.',
    'contact.title': 'Sigamos conectados',
    'contact.subtitle': 'Â¿Necesitas ayuda con la configuraciÃ³n o activaciÃ³n? Estamos listos para ayudarte.',
    'contact.whatsappTitle': 'Soporte por WhatsApp',
    'contact.whatsappText': 'Respuesta rÃ¡pida para dudas de configuraciÃ³n y activaciÃ³n.',
    'contact.whatsappAction': 'Abrir WhatsApp',
    'contact.emailTitle': 'Soporte por email',
    'contact.emailText': 'EnvÃ­a capturas o incidencias detalladas por correo.',
    'contact.emailAction': 'Enviar email',
    'contact.note': 'Contacto de soporte: +34 642 190 408 Â· assouljawad823@gmail.com',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'PolÃ­tica de privacidad',
    'footer.terms': 'TÃ©rminos y condiciones',
    'order.title': 'Solicitar Officino',
    'order.subtitle': 'Completa tus datos y te contactaremos con la informaciÃ³n de activaciÃ³n.',
    'order.firstName': 'Nombre',
    'order.lastName': 'Apellidos',
    'order.email': 'Correo electrÃ³nico',
    'order.phone': 'NÃºmero de telÃ©fono',
    'order.submit': 'Enviar solicitud',
    'order.success': 'Solicitud recibida correctamente. Te contactaremos pronto.',
    'order.error': 'No se pudo enviar la solicitud. IntÃ©ntalo de nuevo.'
  },
  ar: {
    'nav.features': 'Ø§Ù„Ù…Ù…ÙŠØ²Ø§Øª',
    'nav.howItWorks': 'Ø·Ø±ÙŠÙ‚Ø© Ø§Ù„Ø¹Ù…Ù„',
    'nav.support': 'Ø§Ù„Ø¯Ø¹Ù…',
    'buttons.windows': 'ÙˆÙŠÙ†Ø¯ÙˆØ²',
    'buttons.downloadWindows': 'ØªØ­Ù…ÙŠÙ„ Ù„ÙˆÙŠÙ†Ø¯ÙˆØ²',
    'buttons.downloadOrder': 'Ø§Ø·Ù„Ø¨ Ù†Ø³Ø®ØªÙƒ',
    'hero.kicker': 'ØªÙ†Ø¸ÙŠÙ… Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„Ù…ÙƒØªØ¨ÙŠ Ø¨Ø´ÙƒÙ„ Ø£Ø³Ù‡Ù„',
    'hero.title': 'Ø¨Ø±Ù†Ø§Ù…Ø¬ Ù…ÙƒØªØ¨ÙŠ Ø¥Ø¯Ø§Ø±ÙŠ Ù„Ù„Ø¹Ù…Ù„ Ø§Ù„ÙŠÙˆÙ…ÙŠ Ø¨Ø³Ø±Ø¹Ø© ÙˆØ£Ù…Ø§Ù†.',
    'hero.text': 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ ÙˆØ§Ù„Ø·Ù„Ø¨Ø§Øª ÙˆØ§Ù„Ù…Ø³Ø­ Ø§Ù„Ø¶ÙˆØ¦ÙŠ ÙˆØ§Ù„Ù…Ù„ÙØ§Øª ÙˆØ§Ù„ØªÙØ¹ÙŠÙ„ Ù…Ù† Ù…Ù†ØµØ© ÙˆØ§Ø­Ø¯Ø© ÙˆØ§Ø¶Ø­Ø© ÙˆÙ…Ù†Ø§Ø³Ø¨Ø© Ù„Ù„Ù…ÙƒØ§ØªØ¨.',
    'hero.card1Title': 'Ø¨Ø¯ÙˆÙ† Ø¥Ù†ØªØ±Ù†Øª',
    'hero.card1Text': 'ÙŠØ¹Ù…Ù„ Ø¨Ø¯ÙˆÙ† Ø§ØªØµØ§Ù„',
    'hero.card2Title': 'Ø§Ù„ÙƒÙ„ ÙÙŠ ÙˆØ§Ø­Ø¯',
    'hero.card2Text': 'Ø¹Ù…Ù„Ø§Ø¡ ÙˆÙ…Ù„ÙØ§Øª ÙˆØªÙ‚ÙˆÙŠÙ… ÙˆØ£ÙƒØ«Ø±',
    'hero.card3Title': 'Ø¢Ù…Ù†',
    'hero.card3Text': 'Ø¨ÙŠØ§Ù†Ø§ØªÙƒ ØªØ¨Ù‚Ù‰ Ø¹Ù„Ù‰ Ø¬Ù‡Ø§Ø²Ùƒ',
    'hero.card4Title': 'Ø¥Ù†ØªØ§Ø¬ÙŠ',
    'hero.card4Text': 'Ù…ØµÙ…Ù… Ù„Ù„Ø³Ø±Ø¹Ø© ÙˆØ§Ù„ÙƒÙØ§Ø¡Ø©',
    'reports.title': 'Ø­Ø²Ù… Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ ÙˆØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ù…ÙƒØªØ¨',
    'reports.subtitle': 'Ø§Ø³ØªÙŠØ±Ø§Ø¯/ØªØµØ¯ÙŠØ± Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ ÙˆØ¥Ù†Ø´Ø§Ø¡ Ø§Ù„ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ù…Ù‡Ù…Ø© Ø¨Ø³Ø±Ø¹Ø©.',
    'reports.importExportTitle': 'Ø§Ø³ØªÙŠØ±Ø§Ø¯ / ØªØµØ¯ÙŠØ± Ø§Ù„Ø¹Ù…ÙŠÙ„',
    'reports.importExportText': 'ØªØµØ¯ÙŠØ± Ø¹Ù…ÙŠÙ„ ÙˆØ§Ø­Ø¯ Ù…Ø¹ Ø§Ù„Ø³Ø¬Ù„ Ø§Ù„ÙƒØ§Ù…Ù„ ÙˆØ§Ù„Ù…Ù„ÙØ§ØªØŒ Ø£Ùˆ Ø§Ø³ØªÙŠØ±Ø§Ø¯ Ø­Ø²Ù…Ø© Ø¨Ø´ÙƒÙ„ Ø¢Ù…Ù†.',
    'reports.paymentTitle': 'ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª ÙˆØ§Ù„Ù†Ø´Ø§Ø·',
    'reports.paymentText': 'Ø¥Ù†Ø´Ø§Ø¡ ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª ÙˆØ§Ù„Ù†Ø´Ø§Ø· Ø­Ø³Ø¨ Ø§Ù„ØªØ§Ø±ÙŠØ® Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ù…Ø§Ù„ÙŠØ© ÙˆØªØ´ØºÙŠÙ„ÙŠØ© Ø³Ø±ÙŠØ¹Ø©.',
    'gallery.title': 'Ù…Ø¹Ø±Ø¶ Officino',
    'gallery.subtitle': 'Ù†Ø¸Ø±Ø© Ø³Ø±ÙŠØ¹Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø´Ø§Ø´Ø§Øª Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ© Ø§Ù„ØªÙŠ ÙŠØ³ØªØ®Ø¯Ù…Ù‡Ø§ ÙØ±ÙŠÙ‚Ùƒ ÙŠÙˆÙ…ÙŠÙ‹Ø§.',
    'gallery.prev': '<',
    'gallery.next': '>',
    'gallery.counter': 'Slide {current} / {total}',
        'compare.titleA': 'Ù…Ù† Ø§Ù„ÙÙˆØ¶Ù‰ Ø§Ù„ÙŠÙˆÙ…ÙŠØ© Ø¥Ù„Ù‰',
    'compare.titleB': 'Ø§Ù„ØªØ­ÙƒÙ… ÙÙŠ Ø§Ù„Ù…ÙƒØªØ¨.',
    'compare.subtitle': 'Ø´Ø§Ù‡Ø¯ Ù…Ø§ ØªØ®Ø³Ø±Ù‡ Ø§Ù„Ù…ÙƒØ§ØªØ¨ Ø¨Ø¯ÙˆÙ† Officino ÙˆÙ…Ø§ ØªÙƒØ³Ø¨Ù‡ Ù…Ø¹Ù‡.',
    'compare.leftHead': 'Ø¨Ø¯ÙˆÙ† OFFICINO',
    'compare.left1': 'Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ Ù…ÙˆØ²Ø¹Ø© Ø¨ÙŠÙ† Ø§Ù„Ù…Ø¬Ù„Ø¯Ø§Øª ÙˆØ§Ù„Ù…Ø­Ø§Ø¯Ø«Ø§Øª ÙˆØ§Ù„Ù…Ù„Ø§Ø­Ø¸Ø§Øª',
    'compare.left2': 'ØªØªØ¨Ø¹ ÙŠØ¯ÙˆÙŠ Ù„Ù„Ø­Ø§Ù„Ø§Øª ÙˆØ¶ÙŠØ§Ø¹ Ù…ÙˆØ§Ø¹ÙŠØ¯ Ø§Ù„Ø·Ù„Ø¨Ø§Øª',
    'compare.left3': 'Ù„Ø§ ÙŠÙˆØ¬Ø¯ Ø³Ø¬Ù„ ÙˆØ§Ø¶Ø­ Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ù…ÙƒØ§Ù„Ù…Ø§Øª Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡',
    'compare.left4': 'Ø§Ù„Ù…Ø³Ø­ Ø§Ù„Ø¶ÙˆØ¦ÙŠ ÙˆØ§Ù„Ù…Ù„ÙØ§Øª ÙÙŠ Ø£Ø¯ÙˆØ§Øª Ù…Ù†ÙØµÙ„Ø©',
    'compare.left5': 'Ø¨Ø·Ø¡ ÙÙŠ Ø¥Ø¹Ø¯Ø§Ø¯ ØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª ÙˆØ§Ù„Ù†Ø´Ø§Ø·',
    'compare.leftImpactValue': '-10 Ø³Ø§Ø¹Ø§Øª/Ø£Ø³Ø¨ÙˆØ¹',
    'compare.leftImpactText': 'Ù…Ù‡Ø¯ÙˆØ±Ø© ÙÙŠ Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„ÙŠØ¯ÙˆÙŠ',
    'compare.rightHead': 'Ù…Ø¹ OFFICINO',
    'compare.right1': 'Ù…Ù„Ù Ø¹Ù…ÙŠÙ„ ÙˆØ§Ø­Ø¯ Ù…Ø¹ Ø³Ø¬Ù„ ÙƒØ§Ù…Ù„ Ù„Ù„Ø·Ù„Ø¨Ø§Øª',
    'compare.right2': 'Ø³ÙŠØ± Ø¹Ù…Ù„ ÙˆØ§Ø¶Ø­ Ù„Ù„Ø­Ø§Ù„Ø§Øª Ù…Ø¹ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ù…ÙˆØ§Ø¹ÙŠØ¯',
    'compare.right3': 'ØªØªØ¨Ø¹ Ø­Ø§Ù„Ø© Ø§Ù„Ù…ÙƒØ§Ù„Ù…Ø© (ØºÙŠØ± Ù…ØªØµÙ„ / ØªÙ… Ø§Ù„Ø±Ø¯ / Ù„Ø§ Ø¥Ø¬Ø§Ø¨Ø©)',
    'compare.right4': 'Ù…Ø³Ø­ Ø¶ÙˆØ¦ÙŠ ÙˆÙ…Ø¹Ø§ÙŠÙ†Ø© Ù…Ù„ÙØ§Øª ÙˆØ£Ø¯ÙˆØ§Øª PDF Ù…Ø¯Ù…Ø¬Ø©',
    'compare.right5': 'ØªÙ‚Ø§Ø±ÙŠØ± Ø³Ø±ÙŠØ¹Ø© Ù„Ù„Ù…Ø¯ÙÙˆØ¹Ø§Øª ÙˆØ§Ù„Ù†Ø´Ø§Ø· Ø­Ø³Ø¨ Ø§Ù„ØªØ§Ø±ÙŠØ®',
    'compare.rightImpactValue': '+20 Ø³Ø§Ø¹Ø©/Ø£Ø³Ø¨ÙˆØ¹',
    'compare.rightImpactText': 'ØªÙ… ØªÙˆÙÙŠØ±Ù‡Ø§ ÙˆØ§Ø³ØªØ±Ø¬Ø§Ø¹Ù‡Ø§',
    'features.title': 'Ù…Ù…ÙŠØ²Ø§Øª Ù‚ÙˆÙŠØ© Ù„ØªØ³Ù‡ÙŠÙ„ Ø¹Ù…Ù„Ùƒ',
    'features.subtitle': 'ÙƒÙ„ Ù…Ø§ ÙŠØ­ØªØ§Ø¬Ù‡ Ù…ÙƒØªØ¨Ùƒ Ù„Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ù…Ù„ÙØ§Øª Ø¨Ø³Ø±Ø¹Ø© ÙˆØ¯Ù‚Ø©.',
    'features.f1Title': 'ØªØ·Ø¨ÙŠÙ‚ Ù…ÙƒØªØ¨ÙŠ ÙŠØ¹Ù…Ù„ Ø¯ÙˆÙ† Ø¥Ù†ØªØ±Ù†Øª',
    'features.f1Text': 'Ø³ÙŠØ± Ø¹Ù…Ù„ ÙŠÙˆÙ…ÙŠ Ù…ÙˆØ«ÙˆÙ‚ Ø­ØªÙ‰ Ø¨Ø¯ÙˆÙ† Ø§ØªØµØ§Ù„.',
    'features.f2Title': 'Ø¯Ø¹Ù… Ø§Ù„Ù…Ø§Ø³Ø­ (WIA/TWAIN + Ø§Ù„Ø´Ø¨ÙƒØ©)',
    'features.f2Text': 'Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ù…Ø§Ø³Ø­ Ø§Ù„Ù…Ø­Ù„ÙŠ ÙˆÙ…Ø§Ø³Ø­ Ø§Ù„Ø´Ø¨ÙƒØ© ÙÙŠ ØªØ¯ÙÙ‚ ÙˆØ§Ø­Ø¯.',
    'features.f3Title': 'Ø£Ø¯ÙˆØ§Øª PDF ÙˆØ³Ø¬Ù„ Ø§Ù„Ø¹Ù…ÙŠÙ„',
    'features.f3Text': 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ù…Ù„ÙØ§Øª ÙˆØ³Ø¬Ù„ Ø§Ù„Ø·Ù„Ø¨Ø§Øª ÙÙŠ Ù…ÙƒØ§Ù† ÙˆØ§Ø­Ø¯.',
    'features.f4Title': 'Ù…Ø²Ø§Ù…Ù†Ø© LAN Ø¨ÙˆØ¶Ø¹ Ù…Ø¶ÙŠÙ/Ø¶ÙŠÙ',
    'features.f4Text': 'Ø±Ø¨Ø· Ø£Ø¬Ù‡Ø²Ø© Ø§Ù„Ù…ÙƒØªØ¨ ÙˆØ§Ù„ØªØ¹Ø§ÙˆÙ† Ø¹Ø¨Ø± Ø§Ù„Ø´Ø¨ÙƒØ© Ø§Ù„Ù…Ø­Ù„ÙŠØ©.',
    'features.f6Title': 'Ù…ØµÙ…Ù… Ù„Ù„Ù…ÙƒØ§ØªØ¨ Ø§Ù„Ø­Ù‚ÙŠÙ‚ÙŠØ©',
    'features.f6Text': 'ÙˆØ§Ø¬Ù‡Ø© Ø³Ø±ÙŠØ¹Ø© ÙˆØ®Ø·ÙˆØ§Øª ÙˆØ§Ø¶Ø­Ø© ÙˆØ¯Ø¹Ù… Ù…ØªØ¹Ø¯Ø¯ Ø§Ù„Ù„ØºØ§Øª.',
    'how.title': 'ÙƒÙŠÙ ÙŠØ¹Ù…Ù„',
    'how.subtitle': 'Ø®Ø·ÙˆØ§Øª Ø¨Ø³ÙŠØ·Ø© Ù…Ù† Ø§Ù„ØªØ«Ø¨ÙŠØª Ø¥Ù„Ù‰ Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„ÙŠÙˆÙ…ÙŠ.',
    'how.s1Title': 'Ø«Ø¨Ù‘Øª Ø§Ù„ØªØ·Ø¨ÙŠÙ‚',
    'how.s1Text': 'Ù‚Ù… Ø¨Ø§Ù„ØªØ­Ù…ÙŠÙ„ ÙˆØ§Ù„ØªØ«Ø¨ÙŠØª Ø¹Ù„Ù‰ Ø£Ø¬Ù‡Ø²Ø© Ø§Ù„Ù…ÙƒØªØ¨.',
    'how.s2Title': 'Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯ ÙˆØ§Ù„ØªÙØ¹ÙŠÙ„',
    'how.s2Text': 'Ø§Ø®ØªØ± Ø§Ù„ÙˆØ¶Ø¹ ÙˆØ­Ø¯Ø¯ Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª Ø«Ù… ÙØ¹Ù‘Ù„ Ø§Ù„Ù…ÙØªØ§Ø­.',
    'how.s3Title': 'Ø§Ø¨Ø¯Ø£ Ø§Ù„Ø¹Ù…Ù„',
    'how.s3Text': 'Ø£Ø¯Ø± Ø§Ù„Ø¹Ù…Ù„Ø§Ø¡ ÙˆØ§Ù…Ø³Ø­ Ø§Ù„Ù…Ù„ÙØ§Øª ÙˆÙ†Ø¸Ù‘Ù… Ø§Ù„Ø¹Ù…Ù„ Ø§Ù„ÙŠÙˆÙ…ÙŠ.',
    'contact.title': 'Ù„Ù†Ø¨Ù‚ÙŽ Ø¹Ù„Ù‰ ØªÙˆØ§ØµÙ„',
    'contact.subtitle': 'Ø¥Ø°Ø§ Ø§Ø­ØªØ¬Øª Ø¯Ø¹Ù…Ø§Ù‹ ÙÙŠ Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯ Ø£Ùˆ Ø§Ù„ØªÙØ¹ÙŠÙ„ ÙÙ†Ø­Ù† Ø¬Ø§Ù‡Ø²ÙˆÙ† Ù„Ù„Ù…Ø³Ø§Ø¹Ø¯Ø©.',
    'contact.whatsappTitle': 'Ø¯Ø¹Ù… ÙˆØ§ØªØ³Ø§Ø¨',
    'contact.whatsappText': 'Ø±Ø¯ Ø³Ø±ÙŠØ¹ Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯ ÙˆØ§Ù„ØªÙØ¹ÙŠÙ„.',
    'contact.whatsappAction': 'Ù…Ø­Ø§Ø¯Ø«Ø© Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨',
    'contact.emailTitle': 'Ø¯Ø¹Ù… Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ',
    'contact.emailText': 'Ø£Ø±Ø³Ù„ ØµÙˆØ± Ø§Ù„Ø´Ø§Ø´Ø© Ø£Ùˆ ØªÙØ§ØµÙŠÙ„ Ø§Ù„Ù…Ø´ÙƒÙ„Ø© Ø¹Ø¨Ø± Ø§Ù„Ø¨Ø±ÙŠØ¯.',
    'contact.emailAction': 'Ø¥Ø±Ø³Ø§Ù„ Ø¨Ø±ÙŠØ¯',
    'contact.note': 'Ø§Ù„Ø¯Ø¹Ù…: +34 642 190 408 Â· assouljawad823@gmail.com',
    'footer.rights': 'Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø­Ù‚ÙˆÙ‚ Ù…Ø­ÙÙˆØ¸Ø©.',
    'footer.privacy': 'Ø³ÙŠØ§Ø³Ø© Ø§Ù„Ø®ØµÙˆØµÙŠØ©',
    'footer.terms': 'Ø§Ù„Ø´Ø±ÙˆØ· ÙˆØ§Ù„Ø£Ø­ÙƒØ§Ù…',
    'order.title': 'Ø·Ù„Ø¨ Officino',
    'order.subtitle': 'Ø§Ù…Ù„Ø£ Ø¨ÙŠØ§Ù†Ø§ØªÙƒ ÙˆØ³Ù†ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ø¨Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØªÙØ¹ÙŠÙ„.',
    'order.firstName': 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„Ø£ÙˆÙ„',
    'order.lastName': 'Ø§Ù„Ø§Ø³Ù… Ø§Ù„Ø£Ø®ÙŠØ±',
    'order.email': 'Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ',
    'order.phone': 'Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ',
    'order.submit': 'Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨',
    'order.success': 'ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­. Ø³Ù†ØªÙˆØ§ØµÙ„ Ù…Ø¹Ùƒ Ù‚Ø±ÙŠØ¨Ø§Ù‹.',
    'order.error': 'ØªØ¹Ø°Ø± Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨. Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.'
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

function bindGallery() {
  const image = document.getElementById('galleryImage');
  const counter = document.getElementById('galleryCounter');
  const dotsWrap = document.getElementById('galleryDots');
  const prev = document.getElementById('galleryPrev');
  const next = document.getElementById('galleryNext');
  if (!image || !counter || !dotsWrap || !prev || !next) return;

  const slides = [
    '/slidshow/slide-01.png',
    '/slidshow/slide-02.png',
    '/slidshow/slide-03.png',
    '/slidshow/slide-04.png',
    '/slidshow/slide-05.png',
    '/slidshow/slide-06.png',
    '/slidshow/slide-07.png',
    '/slidshow/slide-08.png',
    '/slidshow/slide-09.png',
    '/slidshow/slide-10.png',
    '/slidshow/slide-11.png',
    '/slidshow/slide-12.png',
    '/slidshow/slide-13.png',
    '/slidshow/slide-14.png'
  ];
  let index = 0;

  const dotButtons = slides.map((_, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-dot';
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => {
      index = i;
      render();
    });
    dotsWrap.appendChild(btn);
    return btn;
  });

  const getCounterText = () => {
    const lang = resolveLanguage();
    const template = (I18N[lang] && I18N[lang]['gallery.counter']) || I18N.en['gallery.counter'];
    return template
      .replace('{current}', String(index + 1))
      .replace('{total}', String(slides.length));
  };

  const render = () => {
    image.src = slides[index];
    counter.textContent = getCounterText();
    dotButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  };

  const goNext = () => {
    index = (index + 1) % slides.length;
    render();
  };

  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    render();
  });
  next.addEventListener('click', () => {
    goNext();
  });

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
bindGallery();


