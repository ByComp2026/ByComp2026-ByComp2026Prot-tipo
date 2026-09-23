import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Collaborator, OrganizationalSector, UserRole } from '../types';
import { PontoRecord } from './pontoService';

export interface FacialBiometryData {
  photoUrl: string;
  biometricHash: string;
  registeredAt: string;
  landmarksCount: number;
  confidenceScore: number;
  active: boolean;
  notes?: string;
}

export interface UserDbModel {
  id: string;
  name: string;
  email: string;
  password?: string;
  temporaryPassword?: string;
  mustChangePassword?: boolean;
  role: string;
  userRole: UserRole;
  area: string;
  sector: string;
  avatar: string;
  status: 'Em atividade' | 'Intervalo' | 'Ausente' | 'Férias' | 'Bloqueado';
  currentTask: string;
  phone: string;
  admissionDate: string;
  contractType?: 'CLT' | 'PJ' | 'Estágio';
  salaryBracket?: string;
  workSchedule?: string;
  emergencyContact?: string;
  cpfMasked?: string;
  asoStatus?: 'Em dia' | 'A renovar' | 'Pendente';
  benefits?: string[];
  facialData?: FacialBiometryData;
  createdAt: string;
  updatedAt: string;
}

// Master User default configuration requested by user
export const MASTER_USER_CONFIG: UserDbModel = {
  id: 'user-master-victor',
  name: 'Victor (Master Admin)',
  email: 'victormorekids@gmail.com',
  password: '842867',
  mustChangePassword: false,
  role: 'Diretor / Super Admin Master',
  userRole: 'SUPER_ADMIN',
  area: 'ADMINISTRATIVO',
  sector: 'Gestão Executiva',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'Em atividade',
  currentTask: 'Governança master, supervisão executiva e controle irrestrito',
  phone: '(11) 98765-4321',
  admissionDate: '2021-01-10',
  contractType: 'PJ',
  salaryBracket: 'Diretoria Executiva',
  workSchedule: 'Dedicação Exclusiva / Flexível',
  emergencyContact: '(11) 98888-0001',
  facialData: {
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    biometricHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    registeredAt: new Date().toISOString(),
    landmarksCount: 68,
    confidenceScore: 99.4,
    active: true,
    notes: 'Biometria facial padrão cadastrada para reconhecimento facial no ponto'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Recursive utility to remove any undefined fields before writing to Firestore
function sanitizeFirestoreDoc<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        result[key] = sanitizeFirestoreDoc(val);
      } else {
        result[key] = val;
      }
    }
  }
  return result;
}

class DbService {
  private initialized = false;

  // Initialize DB and ensure Master User exists in Firestore
  public async initializeDatabase(): Promise<UserDbModel> {
    if (this.initialized) {
      return this.getMasterUser();
    }

    try {
      const userRef = doc(db, 'users', MASTER_USER_CONFIG.id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log('Bootstrapping single master user in Firestore:', MASTER_USER_CONFIG.email);
        await setDoc(userRef, MASTER_USER_CONFIG);
        this.initialized = true;
        return MASTER_USER_CONFIG;
      } else {
        this.initialized = true;
        const data = userSnap.data() as UserDbModel;
        return data;
      }
    } catch (error) {
      console.warn('Fallback initializing local master user:', error);
      this.initialized = true;
      return MASTER_USER_CONFIG;
    }
  }

  // Get master user from Firestore or fallback
  public async getMasterUser(): Promise<UserDbModel> {
    try {
      const userRef = doc(db, 'users', MASTER_USER_CONFIG.id);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data() as UserDbModel;
      }
      return MASTER_USER_CONFIG;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'users');
      return MASTER_USER_CONFIG;
    }
  }

  // Get user by ID from Firestore
  public async getUserById(userId: string): Promise<UserDbModel | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data() as UserDbModel;
      }
      if (userId === MASTER_USER_CONFIG.id || userId === 'user-master-victor') {
        return MASTER_USER_CONFIG;
      }
      return null;
    } catch (err) {
      console.warn('Error loading user by ID:', userId, err);
      return null;
    }
  }

  // Save/Update user profile and facial biometry
  public async updateUserProfile(updatedUser: Partial<UserDbModel>): Promise<void> {
    const userId = updatedUser.id || MASTER_USER_CONFIG.id;
    try {
      const userRef = doc(db, 'users', userId);
      const payload = sanitizeFirestoreDoc({
        ...updatedUser,
        updatedAt: new Date().toISOString()
      });
      await setDoc(userRef, payload, { merge: true });
      console.log('User profile and role updated successfully in Firestore:', userId);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }

  // Update or register Facial Biometrics specifically
  public async saveFacialBiometry(
    userId: string,
    biometry: FacialBiometryData
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        sanitizeFirestoreDoc({
          facialData: biometry,
          avatar: biometry.photoUrl || undefined,
          updatedAt: new Date().toISOString()
        }),
        { merge: true }
      );
      console.log('Biometria facial registrada no Firestore com sucesso!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
    }
  }

  // Listen to Users in real-time
  public subscribeUsers(callback: (users: UserDbModel[]) => void): () => void {
    const usersCol = collection(db, 'users');
    return onSnapshot(
      usersCol,
      (snapshot) => {
        const users: UserDbModel[] = [];
        snapshot.forEach((d) => users.push(d.data() as UserDbModel));
        if (users.length === 0) {
          callback([MASTER_USER_CONFIG]);
        } else {
          callback(users);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, 'users');
      }
    );
  }

  // Create a new user with temporary password in Firestore
  public async createUser(newUser: UserDbModel): Promise<void> {
    try {
      const userRef = doc(db, 'users', newUser.id);
      const payload = sanitizeFirestoreDoc({
        ...newUser,
        createdAt: newUser.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      await setDoc(userRef, payload);
      console.log('User created in Firestore with temporary password:', newUser.email);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${newUser.id}`);
    }
  }

  // Delete a user from Firestore AND register tombstone in deleted_users
  public async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      // Register in deleted_users so it never resurrects
      const delRef = doc(db, 'deleted_users', userId);
      await setDoc(delRef, {
        userId,
        deletedAt: new Date().toISOString()
      });
      console.log('User deleted from Firestore:', userId);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  }

  // Listen to deleted users tombstones
  public subscribeDeletedUsers(callback: (deletedIds: string[]) => void): () => void {
    const delCol = collection(db, 'deleted_users');
    return onSnapshot(
      delCol,
      (snapshot) => {
        const ids: string[] = [];
        snapshot.forEach((d) => ids.push(d.id));
        callback(ids);
      },
      (err) => {
        console.warn('Error listening to deleted_users:', err);
      }
    );
  }

  // Authenticate user against Firestore (supports master credentials, temporary passwords, and custom passwords)
  public async authenticateUser(
    email: string,
    passwordAttempt: string
  ): Promise<UserDbModel | null> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = passwordAttempt.trim();

    try {
      // 1. Check in Firestore
      const usersCol = collection(db, 'users');
      const snap = await getDocs(usersCol);
      let matchedUser: UserDbModel | null = null;

      snap.forEach((d) => {
        const u = d.data() as UserDbModel;
        if (u.email && u.email.trim().toLowerCase() === cleanEmail) {
          // Check master fallback, password, or temporary password
          const validPass =
            (u.password && u.password === cleanPassword) ||
            (u.temporaryPassword && u.temporaryPassword === cleanPassword) ||
            (cleanEmail === 'victormorekids@gmail.com' && cleanPassword === '842867');

          if (validPass) {
            matchedUser = u;
          }
        }
      });

      if (matchedUser) {
        return matchedUser;
      }

      // Master fallback check if not in firestore yet
      if (cleanEmail === 'victormorekids@gmail.com' && cleanPassword === '842867') {
        return MASTER_USER_CONFIG;
      }

      return null;
    } catch (err) {
      console.error('Authentication query error:', err);
      // Fallback for offline or init race
      if (cleanEmail === 'victormorekids@gmail.com' && cleanPassword === '842867') {
        return MASTER_USER_CONFIG;
      }
      return null;
    }
  }

  // Change user password in Firestore and remove temporary flag
  public async changePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          password: newPassword,
          temporaryPassword: '',
          mustChangePassword: false,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      console.log('Password successfully updated for user:', userId);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }

  // Set temporary password for user in Firestore (requires password change in settings)
  public async setTemporaryPassword(userId: string, tempPassword: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(
        userRef,
        {
          temporaryPassword: tempPassword,
          mustChangePassword: true,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
      console.log('Temporary password set for user:', userId);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }

  // Sectors Management in Firestore
  public subscribeSectors(callback: (sectors: OrganizationalSector[]) => void): () => void {
    const sectorsCol = collection(db, 'sectors');
    return onSnapshot(
      sectorsCol,
      (snapshot) => {
        const sectors: OrganizationalSector[] = [];
        snapshot.forEach((d) => sectors.push(d.data() as OrganizationalSector));
        callback(sectors);
      },
      (err) => {
        console.warn('Sector subscription warning:', err);
      }
    );
  }

  public async saveSector(sector: OrganizationalSector): Promise<void> {
    try {
      const sectorRef = doc(db, 'sectors', sector.id);
      await setDoc(sectorRef, sector, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `sectors/${sector.id}`);
    }
  }

  public async deleteSector(sectorId: string): Promise<void> {
    try {
      const sectorRef = doc(db, 'sectors', sectorId);
      await deleteDoc(sectorRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `sectors/${sectorId}`);
    }
  }

  // Save ponto punch to Firestore
  public async savePontoRecord(record: PontoRecord): Promise<void> {
    try {
      const recordRef = doc(db, 'ponto_records', record.id);
      await setDoc(recordRef, {
        ...record,
        syncedAt: new Date().toISOString()
      });
      console.log('Ponto punch persisted to Firestore:', record.id);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `ponto_records/${record.id}`);
    }
  }

  // Fetch recent ponto records
  public async getPontoRecords(collaboratorId?: string): Promise<PontoRecord[]> {
    try {
      const pontoCol = collection(db, 'ponto_records');
      const snap = await getDocs(pontoCol);
      const records: PontoRecord[] = [];
      snap.forEach((d) => records.push(d.data() as PontoRecord));
      if (collaboratorId) {
        return records.filter((r) => r.collaboratorId === collaboratorId);
      }
      return records;
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'ponto_records');
      return [];
    }
  }

  // PostgreSQL Migration Generators
  public generatePostgresSchemaDDL(): string {
    return `-- ====================================================================
-- SCRIPT DDL DE MIGRAÇÃO: FIREBASE FIRESTORE -> POSTGRESQL
-- Plataforma: ByComp Gestão Integrada
-- Gerado automaticamente para migração limpa e relacional
-- ====================================================================

-- 1. Criação de Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Setores Organizacionais
CREATE TABLE IF NOT EXISTS sectors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    area VARCHAR(64) NOT NULL,
    leader_name VARCHAR(150),
    collaborators_count INTEGER DEFAULT 0,
    description TEXT,
    sla_target VARCHAR(32) DEFAULT '99.5%',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Usuários e Colaboradores (com Suporte à Biometria Facial)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(180) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(120) NOT NULL,
    user_role VARCHAR(32) NOT NULL DEFAULT 'COLABORADOR', -- 'SUPER_ADMIN', 'ADMINISTRATIVO', 'GESTOR', 'COLABORADOR'
    hierarchy_level INTEGER DEFAULT 4,
    sector_id VARCHAR(64) REFERENCES sectors(id) ON DELETE SET NULL,
    sector_name VARCHAR(120),
    area VARCHAR(64),
    avatar_url TEXT,
    phone VARCHAR(32),
    admission_date DATE,
    status VARCHAR(32) DEFAULT 'Em atividade',
    current_task TEXT,
    contract_type VARCHAR(16) DEFAULT 'CLT',
    salary_bracket VARCHAR(64),
    work_schedule VARCHAR(120),
    emergency_contact VARCHAR(64),
    
    -- Colunas de Biometria Facial para Reconhecimento no Ponto
    facial_active BOOLEAN DEFAULT FALSE,
    facial_photo_url TEXT,
    facial_biometric_hash VARCHAR(128),
    facial_landmarks_count INTEGER DEFAULT 68,
    facial_confidence_score NUMERIC(5,2),
    facial_registered_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Registros de Ponto Eletrônico (Portaria 671 MTE / Reconhecimento Facial)
CREATE TABLE IF NOT EXISTS ponto_records (
    id VARCHAR(64) PRIMARY KEY,
    nsr VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collaborator_name VARCHAR(180) NOT NULL,
    collaborator_sector VARCHAR(120),
    type VARCHAR(32) NOT NULL, -- 'ENTRADA', 'INÍCIO DO INTERVALO', 'RETORNO', 'SAÍDA'
    punch_date DATE NOT NULL,
    punch_time TIME NOT NULL,
    unix_timestamp BIGINT NOT NULL,
    
    -- Evidências Biométricas e Segurança
    photo_url TEXT,
    biometric_match_confidence NUMERIC(5,2),
    sha256_hash VARCHAR(128) NOT NULL,
    
    -- Telemetria e Dispositivo
    device_type VARCHAR(32),
    device_details VARCHAR(255),
    ip_address VARCHAR(45),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    accuracy_meters NUMERIC(8, 2),
    approximate_address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Índices de Alta Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_role ON users(user_role);
CREATE INDEX IF NOT EXISTS idx_ponto_user_date ON ponto_records(user_id, punch_date);
CREATE INDEX IF NOT EXISTS idx_ponto_timestamp ON ponto_records(unix_timestamp);

-- 6. Trigger de Atualização de Updated_At
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE OR REPLACE TRIGGER set_timestamp_sectors
BEFORE UPDATE ON sectors
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
`;
  }

  // Generate SQL DML (Insert statements for the current master user and records)
  public generatePostgresDataDML(user: UserDbModel, pontoRecords: PontoRecord[] = []): string {
    const userInsert = `INSERT INTO users (
    id, name, email, role, user_role, hierarchy_level, sector_name, area,
    avatar_url, phone, admission_date, status, current_task,
    facial_active, facial_photo_url, facial_biometric_hash, facial_confidence_score, facial_registered_at
) VALUES (
    '${user.id}',
    '${user.name.replace(/'/g, "''")}',
    '${user.email}',
    '${user.role.replace(/'/g, "''")}',
    '${user.userRole}',
    1,
    '${user.sector.replace(/'/g, "''")}',
    '${user.area.replace(/'/g, "''")}',
    '${user.avatar}',
    '${user.phone}',
    '${user.admissionDate}',
    '${user.status}',
    '${user.currentTask.replace(/'/g, "''")}',
    ${user.facialData?.active ? 'TRUE' : 'FALSE'},
    ${user.facialData?.photoUrl ? `'${user.facialData.photoUrl}'` : 'NULL'},
    ${user.facialData?.biometricHash ? `'${user.facialData.biometricHash}'` : 'NULL'},
    ${user.facialData?.confidenceScore || 99.4},
    ${user.facialData?.registeredAt ? `'${user.facialData.registeredAt}'` : 'CURRENT_TIMESTAMP'}
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    facial_active = EXCLUDED.facial_active,
    facial_biometric_hash = EXCLUDED.facial_biometric_hash,
    updated_at = CURRENT_TIMESTAMP;`;

    return `-- Inserção de Dados Iniciais da ByComp
${userInsert}

-- Total de registros de ponto exportados: ${pontoRecords.length}
`;
  }
}

export const dbService = new DbService();
