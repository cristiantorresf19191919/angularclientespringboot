export class Usuario {
    id:number;
    username:string;
    password:string;
    nombre:string;
    apellido:string;
    email:string;
    roles:string[] = [];
}

export interface UsuarioResponse {
    access_token: string;
    apellido: string;
    email: string;
    enabled: boolean;
    expires_is: number;
    jti: string;
    nombre: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    username: string;

}


export interface TokenDecoded {
    user_name: string;
    scope: Array<string>;
    apellido: string;
    ati: string;
    exp: number;
    nombre: string;
    authorities:Array<string>;
    jti: string;
    email: string;
    enabled: boolean;
    client_id: string;
    username: string;
}
