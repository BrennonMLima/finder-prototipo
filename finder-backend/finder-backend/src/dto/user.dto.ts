export class UserDTO {
    name: string;
    email: string;
    createdAt: Date;
    id: string;
  
    constructor(name: string, email: string, createdAt: Date, id: string) {
      this.name = name;
      this.email = email;
      this.createdAt = createdAt;
      this.id = id;
    }
  
    toJson() {
      return {
        name: this.name,
        email: this.email,
        createdAt: this.createdAt,
        id: this.id,
      };
    }
  }
  