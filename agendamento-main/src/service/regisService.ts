type RegisData = {
  nome: string,
  email: string,
  senha: string,
}
const register = async (nome: string, email: string, senha: string): Promise<RegisData | undefined> => {
  try {
    // Verifica se todos os campos estão preenchidos
    if (!nome || !email || !senha) {
      window.alert('Por favor, preencha todos os campos');
      return undefined; // Retorna undefined se algum campo não estiver preenchido
    }

    const userData: RegisData = {
      nome: nome,
      email: email,
      senha: senha,
    };

    // Faça uma solicitação POST para o servidor JSON

    //Senac: 10.72.2.149
    //Casa: 26.171.29.253

    const response = await fetch('http://10.72.2.149:3000/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`A requisição da API falhou com o status ${response.status}`);
    }

    // Se a solicitação for bem-sucedida, retorne os dados do usuário registrados
    return userData;
  } catch (error) {
    // console.error('Erro durante o registro:', error);
    // return undefined; // Retorna undefined em caso de erro
  }
};

export const Registro = {
  register,
};