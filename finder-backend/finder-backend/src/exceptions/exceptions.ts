class Exceptions extends Error {
    public readonly statusCode: number;
    public readonly isServerError: boolean;
  
    constructor(message: string, statusCode: number, isServerError = true) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export class NotFoundException extends Exceptions {
    constructor(message?: string) {
      super(message || "Não encontrado.", 404);
    }
  }
  
  export class InternalException extends Exceptions {
    constructor(message?: string) {
      super(message || "Erro interno, favor tentar mais tarde.", 500);
    }
  }
  
  export class UnathorizedExecption extends Exceptions {
    constructor(message?: string) {
      super(message || "Usuário não autenticado.", 401);
    }
  }
  
  export class ForbiddenException extends Exceptions {
    constructor(message?: string) {
      super(
        message || "Usuário não tem permissão para acessar esse conteúdo.",
        403
      );
    }
  }
  