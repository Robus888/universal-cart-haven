
type TranslationKeys = {
  [key: string]: string;
};

type Translations = {
  English: TranslationKeys;
  Spanish: TranslationKeys;
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
  }
};
