import Model from "../config/objection-config";
import { UserRole } from "../libs/enum/user-role.enum";

class User extends Model {
  id!: number;
  email!: string;
  firstName!: string;
  lastName!: string;
  phoneNumber?: string;
  image?: string;
  role!: UserRole;
  password!: string;
  refreshToken?: string;
  updated_at: string;

  static get tableName() {
    return 'users';
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  static get relationMappings() {
    return {
      
    };
  }
}

export default User;