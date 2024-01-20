import { describe, expect } from '@jest/globals';
import bcryptjs from 'bcryptjs';
import AuthService from '../../services/authService';
import Usuario from '../../models/usuario';

const authService = new AuthService();

describe('Testando a authService.cadastrarUsuario', () => {
  it('O usuário deve possuir um nome, email e senha', async () => {
    const usuarioMock = {
      nome: 'Rafael',
      email: 'rafael@teste.com.br',
    };
    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);
    await expect(usuarioSalvo).rejects.toThrowError(
      'A senha de usuário é obrigatória!',
    );
  });

  it('A senha do usuário precisa ser criptografada quando for salva no banco de dados', async () => {
    const data = {
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: 'senha123',
    };

    const resultado = await authService.cadastrarUsuario(data);
    const senhaIguais = await bcryptjs.compare(
      'senha123',
      resultado.content.senha,
    );

    expect(senhaIguais).toStrictEqual(true);

    await Usuario.excluir(resultado.content.id);
  });
});
