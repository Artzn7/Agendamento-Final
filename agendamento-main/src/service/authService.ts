import { AuthData } from '../contexts/Auth';

const signIn = async (email: string, password: string): Promise<AuthData | undefined> => {
    try {
        // Verifique se o e-mail e a senha foram preenchidos
        if (!email || !password) {
            window.alert('Por favor, preencha todos os campos');
            return undefined; // Retorna undefined se algum campo estiver vazio
        }

        // Construa a URL para buscar o usuário com base no e-mail
        const url = `http://10.72.2.149:3000/usuario?email=${email}&senha=${password}`;

        // Faça uma solicitação GET para o servidor JSON
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`A requisição da API falhou com o status ${response.status}`);
        }

        // Extraia os dados JSON da resposta
        const userData: AuthData[] = await response.json();

        // Verifique se algum usuário foi encontrado com base no e-mail e senha
        if (userData.length > 0) {
            // Retorne o primeiro usuário encontrado (assumindo que não há múltiplos usuários com o mesmo e-mail)
            const authenticatedUser = userData[0];
            authenticatedUser.isAdmin = authenticatedUser.email === 'admin@gmail.com'; // Definindo se o usuário é administrador
            return authenticatedUser;
        } else {
            // Exiba um alerta se o email ou a senha estiverem incorretos
            window.alert('Email ou senha incorretos');
            return undefined;
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        return undefined; // Retorna undefined em caso de erro
    }
};

export const authService = {
    signIn,
};
