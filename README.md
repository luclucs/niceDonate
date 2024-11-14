# niceDonate

Este repositório contém o código-fonte do aplicativo **niceDonate**, desenvolvido para a disciplina de **Desenvolvimento Mobile**, ministrada pelo professor **Wolney Queiroz**. Este projeto será apresentado na **Expotech** em **14 de novembro de 2024** como parte da avaliação final da matéria.

## 📱 Sobre o Projeto

O aplicativo niceDonate tem como objetivo conectar doadores e pessoas que precisam de doações de forma prática e acessível. Com ele, usuários podem cadastrar itens para doação, especificando categorias, localização e detalhes, permitindo que outros usuários interessados possam visualizar e, eventualmente, entrar em contato para obter esses itens.

## 🛠️ Tecnologias Utilizadas

As principais tecnologias e bibliotecas utilizadas no desenvolvimento do NiceDonate foram:

- **React Native**: Framework principal para desenvolvimento mobile.
- **Expo**: Ferramenta para simplificar o desenvolvimento e execução do projeto.
- **Firebase**: Backend para autenticação e banco de dados em tempo real.
  - **Firebase Firestore**: Armazenamento das doações e informações de usuários.
  - **Firebase Authentication**: Sistema de login e autenticação de usuários.
- **React Navigation**: Navegação entre as telas do aplicativo.
- **React Native Paper**: Componentes estilizados para aprimorar a interface do usuário.
- **Expo Vector Icons**: Conjunto de ícones utilizado para botões e ícones.

## 🔄 Fluxo do Aplicativo

1. **Tela de Login**: Os usuários podem fazer login com sua conta. Caso não tenham uma conta, podem acessar a **Tela de Cadastro** para se registrarem.
2. **Tela Principal (Home)**: Exibe as ações sociais e doações disponíveis. Cada card representa uma doação e contém informações básicas, como o nome, tipo e localização.
3. **Expansão do Card**: Ao clicar em um card, o usuário pode visualizar informações detalhadas sobre a doação, incluindo uma opção de exclusão (disponível apenas para o criador da doação).
4. **Filtragem de Ações sociais cadastradas**: Através de um botão na tela principal, o usuário pode aplicar filtros por categoria para visualizar apenas as ações que lhe interessam.
5. **Cadastro de Doação**: Após selecionar categorias e detalhar sua doação, o usuário pode cadastrá-la, tornando-a visível para outros usuários.

## 🚀 Como Rodar o Projeto

Para executar o niceDonate em sua máquina local:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/luclucs/niceDonate.git
   cd nicedonate
   ```

2. **Instale as dependências**:
   Certifique-se de que o Expo CLI esteja instalado:
   ```bash
   npm install -g expo-cli
   ```
   Em seguida, instale as dependências do projeto:
   ```bash
   npm install
   ```

3. **Configuração do Firebase**:
   - Crie um projeto no Firebase e ative o Firestore e a Autenticação (Authentication).
   - Copie as configurações de autenticação de seu Firebase e insira-as no arquivo `firebaseConfig.ts` na pasta `src`.

4. **Execute o aplicativo**:
   ```bash
   npx expo start
   ```

5. **Visualização**:
   - Emulador: Abra no Android Studio ou Xcode para testar.
   - Dispositivo físico: Use o aplicativo Expo Go para escanear o QR code e visualizar o app no seu celular.

## 🙏 Agradecimentos

Agradecemos ao professor **Wolney Queiroz** pela orientação e suporte durante a disciplina de Desenvolvimento Mobile, e à **Expotech** por proporcionar um espaço de compartilhamento de ideias e inovações tecnológicas. Este projeto é fruto de muito aprendizado e dedicação.

Desenvolvido com 💜 pela equipe niceDonate.
