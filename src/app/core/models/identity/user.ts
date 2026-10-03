import { BaseModel } from '../base-model';
import { UserNotifikasi } from './user-notifikasi';
import { UserRole } from './user-role';

export class User extends BaseModel {
    userId: string;
    tenantId: string = 'tenantId';
    nama: string;
    username: string;
    phone: string;
    password: string;
    hashpassword: string;
    email: string;
    isLocked: boolean = false;
    lastAccessDate: Date = new Date();
    accessFailedCount: number = 0;
    isUseTelegramForLogin: boolean = false;
    phoneConfirmed: boolean = false;
    emailConfirmed: boolean = false;
    telegramChatId: string;
    userNotifikasi: UserNotifikasi = new UserNotifikasi();
    userRoles: [UserRole];
    roles: []
}