import { User, LoginData, RegisterData, AuthResponse } from '@/types/auth';

// Simule une base de données d'utilisateurs
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@buedi.com',
    password: 'admin123', // Ne jamais stocker les mots de passe en clair dans une vraie application
    fullName: 'Administrateur Buedi',
    userType: 'admin',
    isLoggedIn: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: ['admin.access', 'admin.manage_users', 'admin.manage_content'],
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=FCD116&color=000'
  },
  {
    id: '2',
    email: 'pro@buedi.com',
    password: 'pro123',
    fullName: 'Professionnel Test',
    userType: 'professionnel',
    isLoggedIn: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: ['projects.create', 'projects.edit'],
    role: 'professionnel',
    avatar: 'https://ui-avatars.com/api/?name=Pro&background=3A75C4&color=fff'
  },
  {
    id: '3',
    email: 'user@buedi.com',
    password: 'user123',
    fullName: 'Particulier Test',
    userType: 'particulier',
    isLoggedIn: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: ['projects.view'],
    role: 'particulier',
    avatar: 'https://ui-avatars.com/api/?name=User&background=009E60&color=fff'
  }
];

// Simule un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Service Mock API
export const mockApi = {
  // Simuler la connexion
  async login({ email, password }: LoginData): Promise<AuthResponse> {
    await delay(800); // Simuler un délai réseau
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      throw new Error('Identifiants incorrects');
    }
    
    // Générer un token fictif
    const token = `mock-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;
    
    // Mettre à jour la dernière connexion
    user.lastLogin = new Date().toISOString();
    user.isLoggedIn = true;
    
    // Omettre le mot de passe dans la réponse
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      refreshToken
    };
  },
  
  // Simuler l'inscription
  async register(userData: RegisterData): Promise<AuthResponse> {
    await delay(1000); // Simuler un délai réseau
    
    // Vérifier si l'email existe déjà
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Cet email est déjà utilisé');
    }
    
    // Créer un nouvel utilisateur
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      email: userData.email,
      password: userData.password, // Ne jamais stocker les mots de passe en clair dans une vraie application
      fullName: userData.fullName,
      userType: userData.userType,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      permissions: userData.userType === 'admin' 
        ? ['admin.access', 'admin.manage_users']
        : userData.userType === 'professionnel'
          ? ['projects.create', 'projects.edit']
          : ['projects.view'],
      role: userData.userType,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.fullName)}&background=${userData.userType === 'admin' ? 'FCD116' : userData.userType === 'professionnel' ? '3A75C4' : '009E60'}&color=${userData.userType === 'admin' ? '000' : 'fff'}`
    };
    
    // Ajouter l'utilisateur à notre "base de données"
    mockUsers.push(newUser);
    
    // Générer un token fictif
    const token = `mock-token-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${Date.now()}`;
    
    // Omettre le mot de passe dans la réponse
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token,
      refreshToken
    };
  },
  
  // Simuler la déconnexion
  async logout(): Promise<void> {
    await delay(300); // Simuler un délai réseau
    // Rien à faire ici dans un mock, la déconnexion est gérée côté client
  },
  
  // Simuler la récupération de l'utilisateur courant
  async getCurrentUser(): Promise<User> {
    await delay(500); // Simuler un délai réseau
    
    // Dans une vraie application, on utiliserait le token pour identifier l'utilisateur
    // Ici, on simule en récupérant les données du localStorage
    const userJson = localStorage.getItem('buedi_user');
    if (!userJson) {
      throw new Error('Utilisateur non connecté');
    }
    
    const userData = JSON.parse(userJson);
    const user = mockUsers.find(u => u.email === userData.email);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Omettre le mot de passe dans la réponse
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  },
  
  // Simuler la mise à jour du profil
  async updateProfile(data: Partial<User>): Promise<User> {
    await delay(800); // Simuler un délai réseau
    
    // Récupérer l'utilisateur courant
    const userJson = localStorage.getItem('buedi_user');
    if (!userJson) {
      throw new Error('Utilisateur non connecté');
    }
    
    const userData = JSON.parse(userJson);
    const userIndex = mockUsers.findIndex(u => u.email === userData.email);
    
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé');
    }
    
    // Mettre à jour les données de l'utilisateur
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      // Conserver certaines propriétés qui ne doivent pas être modifiées
      id: mockUsers[userIndex].id,
      email: data.email || mockUsers[userIndex].email,
      createdAt: mockUsers[userIndex].createdAt
    };
    
    // Omettre le mot de passe dans la réponse
    const { password: _, ...userWithoutPassword } = mockUsers[userIndex];
    
    return userWithoutPassword;
  }
};