
type TranslationKeys = {
  [key: string]: string;
};

type Translations = {
  English: TranslationKeys;
  Spanish: TranslationKeys;
  Portuguese: TranslationKeys;
  Vietnamese: TranslationKeys;
  Russian: TranslationKeys;
  Arabic: TranslationKeys;
};

export const translations: Translations = {
  English: {
    // General
    home: "Home",
    shop: "Shop",
    orderHistory: "Order History",
    topProducts: "Top Products",
    downloads: "Downloads",
    paymentMethods: "Payment Methods",
    invoices: "Invoices",
    wallet: "Wallet",
    login: "Login",
    register: "Register",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    promocodes: "Promo Codes",
    shopNow: "Shop Now",
    
    // Login/Register
    welcomeBack: "Welcome back",
    signInToAccount: "Sign in to your account",
    email: "Email",
    username: "Username",
    password: "Password",
    enterEmail: "Enter your email",
    enterUsername: "Enter your username",
    enterPassword: "Enter your password",
    forgotPassword: "Forgot password?",
    signIn: "Sign in",
    signingIn: "Signing in...",
    dontHaveAccount: "Don't have an account?",
    signUp: "Sign up",
    
    // Profile
    profileSettings: "Profile Settings",
    changeUsername: "Change Username",
    currentUsername: "Current Username",
    newUsername: "New Username",
    usernameChangeLimit: "You can change your username once every 30 days",
    save: "Save",
    changePassword: "Change Password", 
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    updatePassword: "Update Password",
    
    // Settings
    generalSettings: "General Settings",
    userInformation: "User Information",
    joined: "Joined",
    id: "ID",
    accessOS: "Access Operating System",
    accessingIP: "Accessing IP",
    theme: "Theme",
    dark: "Dark",
    light: "Light",
    language: "Language",
    
    // Promo codes
    enterPromoCode: "Enter Promo Code",
    code: "Code",
    redeem: "Redeem",
    
    // Success messages
    languageUpdated: "Language updated",
    languageChangedTo: "Language has been changed to {language}",
    
    // Cart
    cart: "Cart",
    yourCartIsEmpty: "Your cart is empty",
    total: "Total",
    viewCart: "View Cart",
    
    // Admin
    adminPanel: "Admin Panel",
    ownerPanel: "Owner Panel",
    users: "Users",
    announcements: "Announcements",
    promocodesManager: "Promocodes Manager",
    
    // Promocodes manager
    createPromoCode: "Create Promo Code",
    promoCodeAmount: "Amount",
    maxRedemptions: "Max Redemptions",
    active: "Active",
    create: "Create",
    promoCodeList: "Promo Code List",
    redemptions: "Redemptions",
    actions: "Actions",
    noPromoCodes: "No promo codes found",
    
    // Search
    searchProducts: "Search products...",
    
    // Downloads
    noDownloads: "You don't have any purchases yet",
    browseShop: "Browse Shop",
    downloadIPA: "Download IPA",
    requestKey: "Request Key",
    
    // Payment Methods
    paypal: "PayPal",
    zelle: "Zelle",
    cashApp: "Cash App",
    creditCard: "Credit Card",
    buyNow: "Buy Now",
  },
  Spanish: {
    // General
    home: "Inicio",
    shop: "Tienda",
    orderHistory: "Historial de Pedidos",
    topProducts: "Productos Destacados",
    downloads: "Descargas",
    paymentMethods: "Métodos de Pago",
    invoices: "Facturas",
    wallet: "Billetera",
    login: "Iniciar Sesión",
    register: "Registrarse",
    profile: "Perfil",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    promocodes: "Códigos Promocionales",
    shopNow: "Comprar Ahora",
    
    // Login/Register
    welcomeBack: "Bienvenido de nuevo",
    signInToAccount: "Inicia sesión en tu cuenta",
    email: "Correo electrónico",
    username: "Nombre de usuario",
    password: "Contraseña",
    enterEmail: "Introduce tu correo electrónico",
    enterUsername: "Introduce tu nombre de usuario",
    enterPassword: "Introduce tu contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    dontHaveAccount: "¿No tienes una cuenta?",
    signUp: "Regístrate",
    
    // Profile
    profileSettings: "Configuración del Perfil",
    changeUsername: "Cambiar Nombre de Usuario",
    currentUsername: "Nombre de Usuario Actual",
    newUsername: "Nuevo Nombre de Usuario",
    usernameChangeLimit: "Puedes cambiar tu nombre de usuario una vez cada 30 días",
    save: "Guardar",
    changePassword: "Cambiar Contraseña", 
    currentPassword: "Contraseña Actual",
    newPassword: "Nueva Contraseña",
    confirmPassword: "Confirmar Contraseña",
    updatePassword: "Actualizar Contraseña",
    
    // Settings
    generalSettings: "Configuración General",
    userInformation: "Información del Usuario",
    joined: "Registrado",
    id: "ID",
    accessOS: "Sistema Operativo",
    accessingIP: "IP de Acceso",
    theme: "Tema",
    dark: "Oscuro",
    light: "Claro",
    language: "Idioma",
    
    // Promo codes
    enterPromoCode: "Introducir Código Promocional",
    code: "Código",
    redeem: "Canjear",
    
    // Success messages
    languageUpdated: "Idioma actualizado",
    languageChangedTo: "El idioma se ha cambiado a {language}",
    
    // Cart
    cart: "Carrito",
    yourCartIsEmpty: "Tu carrito está vacío",
    total: "Total",
    viewCart: "Ver Carrito",
    
    // Admin
    adminPanel: "Panel de Administrador",
    ownerPanel: "Panel de Propietario",
    users: "Usuarios",
    announcements: "Anuncios",
    promocodesManager: "Gestor de Códigos Promocionales",
    
    // Promocodes manager
    createPromoCode: "Crear Código Promocional",
    promoCodeAmount: "Cantidad",
    maxRedemptions: "Máximo de Canjes",
    active: "Activo",
    create: "Crear",
    promoCodeList: "Lista de Códigos Promocionales",
    redemptions: "Canjes",
    actions: "Acciones",
    noPromoCodes: "No se encontraron códigos promocionales",
    
    // Search
    searchProducts: "Buscar productos...",
    
    // Downloads
    noDownloads: "No tienes ninguna compra todavía",
    browseShop: "Explorar Tienda",
    downloadIPA: "Descargar IPA",
    requestKey: "Solicitar Clave",
    
    // Payment Methods
    paypal: "PayPal",
    zelle: "Zelle",
    cashApp: "Cash App",
    creditCard: "Tarjeta de Crédito",
    buyNow: "Comprar Ahora",
  },
  Portuguese: {
    // General
    home: "Início",
    shop: "Loja",
    orderHistory: "Histórico de Pedidos",
    topProducts: "Produtos em Destaque",
    downloads: "Downloads",
    paymentMethods: "Métodos de Pagamento",
    invoices: "Faturas",
    wallet: "Carteira",
    login: "Entrar",
    register: "Registrar",
    profile: "Perfil",
    settings: "Configurações",
    logout: "Sair",
    promocodes: "Códigos Promocionais",
    shopNow: "Comprar Agora",
    
    // Login/Register
    welcomeBack: "Bem-vindo de volta",
    signInToAccount: "Entre na sua conta",
    email: "Email",
    username: "Nome de usuário",
    password: "Senha",
    enterEmail: "Digite seu email",
    enterUsername: "Digite seu nome de usuário",
    enterPassword: "Digite sua senha",
    forgotPassword: "Esqueceu a senha?",
    signIn: "Entrar",
    signingIn: "Entrando...",
    dontHaveAccount: "Não tem uma conta?",
    signUp: "Registre-se",
    
    // Profile
    profileSettings: "Configurações do Perfil",
    changeUsername: "Alterar Nome de Usuário",
    currentUsername: "Nome de Usuário Atual",
    newUsername: "Novo Nome de Usuário",
    usernameChangeLimit: "Você pode alterar seu nome de usuário uma vez a cada 30 dias",
    save: "Salvar",
    changePassword: "Alterar Senha", 
    currentPassword: "Senha Atual",
    newPassword: "Nova Senha",
    confirmPassword: "Confirmar Senha",
    updatePassword: "Atualizar Senha",
    
    // Settings
    generalSettings: "Configurações Gerais",
    userInformation: "Informações do Usuário",
    joined: "Registrado em",
    id: "ID",
    accessOS: "Sistema Operacional",
    accessingIP: "Endereço IP",
    theme: "Tema",
    dark: "Escuro",
    light: "Claro",
    language: "Idioma",
    
    // Promo codes
    enterPromoCode: "Inserir Código Promocional",
    code: "Código",
    redeem: "Resgatar",
    
    // Success messages
    languageUpdated: "Idioma atualizado",
    languageChangedTo: "O idioma foi alterado para {language}",
    
    // Cart
    cart: "Carrinho",
    yourCartIsEmpty: "Seu carrinho está vazio",
    total: "Total",
    viewCart: "Ver Carrinho",
    
    // Admin
    adminPanel: "Painel do Administrador",
    ownerPanel: "Painel do Proprietário",
    users: "Usuários",
    announcements: "Anúncios",
    promocodesManager: "Gerenciador de Códigos Promocionais",
    
    // Promocodes manager
    createPromoCode: "Criar Código Promocional",
    promoCodeAmount: "Valor",
    maxRedemptions: "Máximo de Resgates",
    active: "Ativo",
    create: "Criar",
    promoCodeList: "Lista de Códigos Promocionais",
    redemptions: "Resgates",
    actions: "Ações",
    noPromoCodes: "Nenhum código promocional encontrado",
    
    // Search
    searchProducts: "Buscar produtos...",
    
    // Downloads
    noDownloads: "Você ainda não tem nenhuma compra",
    browseShop: "Explorar Loja",
    downloadIPA: "Baixar IPA",
    requestKey: "Solicitar Chave",
    
    // Payment Methods
    paypal: "PayPal",
    zelle: "Zelle",
    cashApp: "Cash App",
    creditCard: "Cartão de Crédito",
    buyNow: "Comprar Agora",
  },
  Vietnamese: {
    // General
    home: "Trang chủ",
    shop: "Cửa hàng",
    orderHistory: "Lịch sử đơn hàng",
    topProducts: "Sản phẩm nổi bật",
    downloads: "Tải xuống",
    paymentMethods: "Phương thức thanh toán",
    invoices: "Hóa đơn",
    wallet: "Ví",
    login: "Đăng nhập",
    register: "Đăng ký",
    profile: "Hồ sơ",
    settings: "Cài đặt",
    logout: "Đăng xuất",
    promocodes: "Mã khuyến mãi",
    shopNow: "Mua ngay",
    
    // Login/Register
    welcomeBack: "Chào mừng trở lại",
    signInToAccount: "Đăng nhập vào tài khoản của bạn",
    email: "Email",
    username: "Tên người dùng",
    password: "Mật khẩu",
    enterEmail: "Nhập email của bạn",
    enterUsername: "Nhập tên người dùng của bạn",
    enterPassword: "Nhập mật khẩu của bạn",
    forgotPassword: "Quên mật khẩu?",
    signIn: "Đăng nhập",
    signingIn: "Đang đăng nhập...",
    dontHaveAccount: "Chưa có tài khoản?",
    signUp: "Đăng ký",
    
    // Profile
    profileSettings: "Cài đặt hồ sơ",
    changeUsername: "Thay đổi tên người dùng",
    currentUsername: "Tên người dùng hiện tại",
    newUsername: "Tên người dùng mới",
    usernameChangeLimit: "Bạn có thể thay đổi tên người dùng một lần mỗi 30 ngày",
    save: "Lưu",
    changePassword: "Thay đổi mật khẩu", 
    currentPassword: "Mật khẩu hiện tại",
    newPassword: "Mật khẩu mới",
    confirmPassword: "Xác nhận mật khẩu",
    updatePassword: "Cập nhật mật khẩu",
    
    // Settings
    generalSettings: "Cài đặt chung",
    userInformation: "Thông tin người dùng",
    joined: "Tham gia",
    id: "ID",
    accessOS: "Hệ điều hành",
    accessingIP: "Địa chỉ IP",
    theme: "Giao diện",
    dark: "Tối",
    light: "Sáng",
    language: "Ngôn ngữ",
    
    // Promo codes
    enterPromoCode: "Nhập mã khuyến mãi",
    code: "Mã",
    redeem: "Đổi",
    
    // Success messages
    languageUpdated: "Đã cập nhật ngôn ngữ",
    languageChangedTo: "Ngôn ngữ đã được thay đổi thành {language}",
    
    // Cart
    cart: "Giỏ hàng",
    yourCartIsEmpty: "Giỏ hàng của bạn trống",
    total: "Tổng cộng",
    viewCart: "Xem giỏ hàng",
    
    // Admin
    adminPanel: "Bảng điều khiển quản trị",
    ownerPanel: "Bảng điều khiển chủ sở hữu",
    users: "Người dùng",
    announcements: "Thông báo",
    promocodesManager: "Quản lý mã khuyến mãi",
    
    // Promocodes manager
    createPromoCode: "Tạo mã khuyến mãi",
    promoCodeAmount: "Số tiền",
    maxRedemptions: "Số lần đổi tối đa",
    active: "Hoạt động",
    create: "Tạo",
    promoCodeList: "Danh sách mã khuyến mãi",
    redemptions: "Lần đổi",
    actions: "Hành động",
    noPromoCodes: "Không tìm thấy mã khuyến mãi",
    
    // Search
    searchProducts: "Tìm kiếm sản phẩm...",
    
    // Downloads
    noDownloads: "Bạn chưa có bất kỳ mua hàng nào",
    browseShop: "Duyệt cửa hàng",
    downloadIPA: "Tải IPA",
    requestKey: "Yêu cầu khóa",
    
    // Payment Methods
    paypal: "PayPal",
    zelle: "Zelle",
    cashApp: "Cash App",
    creditCard: "Thẻ tín dụng",
    buyNow: "Mua ngay",
  },
  Russian: {
    // General
    home: "Главная",
    shop: "Магазин",
    orderHistory: "История заказов",
    topProducts: "Лучшие продукты",
    downloads: "Загрузки",
    paymentMethods: "Способы оплаты",
    invoices: "Счета",
    wallet: "Кошелек",
    login: "Вход",
    register: "Регистрация",
    profile: "Профиль",
    settings: "Настройки",
    logout: "Выход",
    promocodes: "Промокоды",
    shopNow: "Купить сейчас",
    
    // Login/Register
    welcomeBack: "С возвращением",
    signInToAccount: "Войдите в свой аккаунт",
    email: "Эл. почта",
    username: "Имя пользователя",
    password: "Пароль",
    enterEmail: "Введите эл. почту",
    enterUsername: "Введите имя пользователя",
    enterPassword: "Введите пароль",
    forgotPassword: "Забыли пароль?",
    signIn: "Войти",
    signingIn: "Вход...",
    dontHaveAccount: "Нет аккаунта?",
    signUp: "Зарегистрироваться",
    
    // Profile
    profileSettings: "Настройки профиля",
    changeUsername: "Изменить имя пользователя",
    currentUsername: "Текущее имя пользователя",
    newUsername: "Новое имя пользователя",
    usernameChangeLimit: "Вы можете изменить имя пользователя один раз в 30 дней",
    save: "Сохранить",
    changePassword: "Изменить пароль", 
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите пароль",
    updatePassword: "Обновить пароль",
    
    // Settings
    generalSettings: "Общие настройки",
    userInformation: "Информация о пользователе",
    joined: "Присоединился",
    id: "ID",
    accessOS: "Операционная система",
    accessingIP: "IP-адрес",
    theme: "Тема",
    dark: "Темная",
    light: "Светлая",
    language: "Язык",
    
    // Promo codes
    enterPromoCode: "Введите промокод",
    code: "Код",
    redeem: "Применить",
    
    // Success messages
    languageUpdated: "Язык обновлен",
    languageChangedTo: "Язык изменен на {language}",
    
    // Cart
    cart: "Корзина",
    yourCartIsEmpty: "Ваша корзина пуста",
    total: "Итого",
    viewCart: "Просмотр корзины",
    
    // Admin
    adminPanel: "Панель администратора",
    ownerPanel: "Панель владельца",
    users: "Пользователи",
    announcements: "Объявления",
    promocodesManager: "Менеджер промокодов",
    
    // Promocodes manager
    createPromoCode: "Создать промокод",
    promoCodeAmount: "Сумма",
    maxRedemptions: "Макс. использований",
    active: "Активный",
    create: "Создать",
    promoCodeList: "Список промокодов",
    redemptions: "Использований",
    actions: "Действия",
    noPromoCodes: "Промокоды не найдены",
    
    // Search
    searchProducts: "Поиск продуктов...",
    
    // Downloads
    noDownloads: "У вас еще нет покупок",
    browseShop: "Просмотреть магазин",
    downloadIPA: "Скачать IPA",
    requestKey: "Запросить ключ",
    
    // Payment Methods
    paypal: "PayPal",
    zelle: "Zelle",
    cashApp: "Cash App",
    creditCard: "Кредитная карта",
    buyNow: "Купить сейчас",
  },
  Arabic: {
    // General
    home: "الرئيسية",
    shop: "المتجر",
    orderHistory: "سجل الطلبات",
    topProducts: "أفضل المنتجات",
    downloads: "التنزيلات",
    paymentMethods: "طرق الدفع",
    invoices: "الفواتير",
    wallet: "المحفظة",
    login: "تسجيل الدخول",
    register: "التسجيل",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    promocodes: "رموز الخصم",
    shopNow: "تسوق الآن",
    
    // Login/Register
    welcomeBack: "مرحبًا بعودتك",
    signInToAccount: "تسجيل الدخول إلى حسابك",
    email: "البريد الإلكتروني",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    enterEmail: "أدخل بريدك الإلكتروني",
    enterUsername: "أدخل اسم المستخدم",
    enterPassword: "أدخل كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    signIn: "تسجيل الدخول",
    signingIn: "جاري تسجيل الدخول...",
    dontHaveAccount: "ليس لديك حساب؟",
    signUp: "التسجيل",
    
    // Profile
    profileSettings: "إعدادات الملف الشخصي",
    changeUsername: "تغيير اسم المستخدم",
    currentUsername: "اسم المستخدم الحالي",
    newUsername: "اسم المستخدم الجديد",
    usernameChangeLimit: "يمكنك تغيير اسم المستخدم مرة واحدة كل 30 يومًا",
    save: "حفظ",
    changePassword: "تغيير كلمة المرور", 
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    updatePassword: "تحديث كلمة المرور",
    
    // Settings
    generalSettings: "الإعدادات العامة",
    userInformation: "معلومات المستخدم",
    joined: "تاريخ الانضمام",
    id: "المعرف",
    accessOS: "نظام التشغيل",
    accessingIP: "عنوان IP",
    theme: "السمة",
    dark: "داكنة",
    light: "فاتحة",
    language: "اللغة",
    
    // Promo codes
    enterPromoCode: "أدخل رمز الخصم",
    code: "الرمز",
    redeem: "استبدال",
    
    // Success messages
    languageUpdated: "تم تحديث اللغة",
    languageChangedTo: "تم تغيير اللغة إلى {language}",
    
    // Cart
    cart: "السلة",
    yourCartIsEmpty: "سلة التسوق فارغة",
    total: "المجموع",
    viewCart: "عرض السلة",
    
    // Admin
    adminPanel: "لوحة الإدارة",
    ownerPanel: "لوحة المالك",
    users: "المستخدمون",
    announcements: "الإعلانات",
    promocodesManager: "إدارة رموز الخصم",
    
    // Promocodes manager
    createPromoCode: "إنشاء رمز خصم",
    promoCodeAmount: "المبلغ",
    maxRedemptions: "الحد الأقصى للاستبدال",
    active: "نشط",
    create: "إنشاء",
    promoCodeList: "قائمة رموز الخصم",
    redemptions: "الاستبدالات",
    actions: "الإجراءات",
    noPromoCodes: "لم يتم العثور على رموز خصم",
    
    // Search
    searchProducts: "البحث عن المنتجات...",
    
    // Downloads
    noDownloads: "ليس لديك أي مشتريات بعد",
    browseShop: "تصفح المتجر",
    downloadIPA: "تنزيل IPA",
    requestKey: "طلب المفتاح",
    
    // Payment Methods
    paypal: "باي بال",
    zelle: "زيل",
    cashApp: "كاش آب",
    creditCard: "بطاقة ائتمان",
    buyNow: "اشتر الآن",
  }
};
