document.addEventListener("DOMContentLoaded", () => {
    const formUsuario = document.getElementById('formUsuario');
    const formProduto = document.getElementById('formProduto');
  
    if (formUsuario) {
      formUsuario.reset(); // limpa campos ao voltar
      formUsuario.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = document.getElementById('nomeUsuario').value.trim();
        const email = document.getElementById('emailUsuario').value.trim();
        const msg = document.getElementById('msgUsuario');

        fetch('https://projeto-mvc.onrender.com/ver_users')
          .then((response) => response.json())
          .then((usuarios) => {
  
          const usuarioExistente = usuarios.find(
            (u) => u.nome.toLowerCase() === nome.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
          );
  
          if (usuarioExistente) {
            msg.style.color = 'red';
            msg.textContent = 'Usuário com mesmo nome ou email já cadastrado.';
          } else {
            usuarios.push({ nome, email });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            let usuario = usuarios.find((u) => u.nome == nome && u.email == email);
  
            msg.style.color = 'green';
            msg.textContent = 'Usuário adicionado com sucesso!';

            fetch('https://projeto-mvc.onrender.com/usuarios', 
              {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nome: usuario.nome, email: usuario.email})
              }); 

            formUsuario.reset();
          }
  
          setTimeout(() => msg.textContent = '', 3000);
        });
      });
    }
  
  
    if (formProduto) {
      formProduto.reset(); // limpa campos ao voltar
      formProduto.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = document.getElementById('nomeProduto').value.trim();
        const preco = document.getElementById('precoProduto').value.trim();
        const msg = document.getElementById('msgBrinquedo');
  
        const produtos = JSON.parse(localStorage.getItem('brinquedos')) || [];
  
        const produtoExistente = produtos.find(
          (p) => p.nome.toLowerCase() === nome.toLowerCase() || p.preco === preco
        );
  
        if (produtoExistente) {
          msg.style.color = 'red';
          msg.textContent = 'Produto com mesmo nome ou preço já cadastrado.';
        } else {
          produtos.push({ nome, preco });
          localStorage.setItem('brinquedos', JSON.stringify(produtos));

          let produto = produtos.find((p) => p.nome == nome && p.preco == preco);
  
          msg.style.color = 'green';
          msg.textContent = 'Produto adicionado com sucesso!';

          fetch('https://projeto-mvc.onrender.com/brinquedos', 
            {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({nome: produto.nome, preco: produto.preco})
            }); 

          formProduto.reset();
        }
  
        setTimeout(() => msg.textContent = '', 3000);
      });
    }
  
    if (document.getElementById('listaUsuarios')) carregarUsuarios();
    if (document.getElementById('listaProdutos')) carregarProdutos();
  });
  
  // Carregar e exibir usuários
  function carregarUsuarios() {
    fetch('https://projeto-mvc.onrender.com/ver_users')
      .then((response) => response.json())
      .then((data) => {
        const lista = document.getElementById('listaUsuarios');
        lista.innerHTML = '';
  
        data.forEach((usuario) => {
          const li = document.createElement('li');

          li.innerHTML = `
          <span id="usuarioTexto-${usuario.nome}">${usuario.nome} - ${usuario.email}</span>
          <span id="botoes-${usuario.nome}">
            <span style="cursor:pointer; margin-left: 10px;" onclick="editarUsuario('${usuario.nome}')">✏️</span>
            <span style="cursor:pointer; margin-left: 10px;" onclick="excluirUsuario('${usuario.nome}')">🗑️</span>
          </span>
          `;

          lista.appendChild(li);
        });
    });
  }
  
  // Carregar e exibir produtos
  function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('brinquedos')) || [];
    const lista = document.getElementById('listaProdutos');
    lista.innerHTML = '';
  
    produtos.forEach((produto, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span id="produtoTexto-${index}">${produto.nome} - R$ ${produto.preco}</span>
        <span id="botoesProduto-${index}">
          <span style="cursor:pointer; margin-left: 10px;" onclick="editarProduto(${index})">✏️</span>
          <span style="cursor:pointer; margin-left: 10px;" onclick="excluirProduto(${index})">🗑️</span>
        </span>
      `;
      lista.appendChild(li);
    });
  }
  
  // Editar usuário
  function editarUsuario(nome) {
    // const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    fetch('https://projeto-mvc.onrender.com/ver_users')
      .then((response) => response.json())
      .then((data) => {

      const usuario = data.find((u) => u.nome === nome);
  
      const spanTexto = document.getElementById(`usuarioTexto-${nome}`);
      const botoes = document.getElementById(`botoes-${nome}`);
  
      spanTexto.innerHTML = `
        <input type="text" id="editNome-${nome}" value="${usuario.nome}">
        <input type="email" id="editEmail-${nome}" value="${usuario.email}">
      `;
  
      botoes.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
          <span style="cursor:pointer;" onclick="salvarEdicaoUsuario('${nome}')">✅</span>
          <span style="cursor:pointer;" onclick="carregarUsuarios()">❌</span>
        </div>
      `;
      });
  }
  
  // Salvar edição de usuário
  async function salvarEdicaoUsuario(nome) {
    const nomeEditado = document.getElementById(`editNome-${nome}`).value.trim();
    const emailEditado = document.getElementById(`editEmail-${nome}`).value.trim();

    fetch('https://projeto-mvc.onrender.com/ver_users')
      .then((response) => response.json())
      .then((usuarios) => {
  
      // Evita duplicação após edição
      const duplicado = usuarios.some((u) =>
        (u.nome.toLowerCase() === nomeEditado.toLowerCase() 
          || u.email.toLowerCase() === emailEditado.toLowerCase()) && u.nome !== nome
      );
  
      if (duplicado) {
        alert("Nome ou email já cadastrado.");
        return;
      }
    });

    await fetch('https://projeto-mvc.onrender.com/atualizar_user', 
      {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nome: nome, nome_editado: nomeEditado, email_editado: emailEditado})
      }).then(carregarUsuarios);
  }
  
  // Excluir usuário
  async function excluirUsuario(nome) {
    const msg = document.getElementById('msgCadastro');
    
    await fetch('https://projeto-mvc.onrender.com/ver_users')
      .then((response) => response.json())
      .then((data) => {
        const usuarioExistente = data.find((usuario) => usuario.nome === nome);
        
        if(!usuarioExistente) {
          msg.style.color = 'red';
          msg.textContent = 'Usuário inexistente';
        } 
      });

    await fetch('https://projeto-mvc.onrender.com/remover_usuario', 
    {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nome: nome})
    });

    carregarUsuarios();
  }
  
  // Editar produto
  function editarProduto(index) {
    const produtos = JSON.parse(localStorage.getItem('brinquedos')) || [];
    const produto = produtos[index];
  
    const spanTexto = document.getElementById(`produtoTexto-${index}`);
    const botoes = document.getElementById(`botoesProduto-${index}`);
  
    spanTexto.innerHTML = `
      <input type="text" id="editNomeProduto-${index}" value="${produto.nome}">
      <input type="number" id="editPrecoProduto-${index}" value="${produto.preco}">
    `;
  
    botoes.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
        <span style="cursor:pointer;" onclick="salvarEdicaoProduto(${index})">✅</span>
        <span style="cursor:pointer;" onclick="carregarProdutos()">❌</span>
      </div>
    `;
  }
  
  // Salvar edição de produto
  function salvarEdicaoProduto(index) {
    const nomeEditado = document.getElementById(`editNomeProduto-${index}`).value.trim();
    const precoEditado = document.getElementById(`editPrecoProduto-${index}`).value.trim();
    const produtos = JSON.parse(localStorage.getItem('brinquedos')) || [];
  
    // Evita duplicação após edição
    const duplicado = produtos.some((p, i) =>
      i !== index &&
      (p.nome.toLowerCase() === nomeEditado.toLowerCase() || p.preco === precoEditado)
    );
  
    if (duplicado) {
      alert("Nome ou preço já cadastrado.");
      return;
    }
  
    produtos[index] = { nome: nomeEditado, preco: precoEditado };
    localStorage.setItem('brinquedos', JSON.stringify(produtos));
    carregarProdutos();
  }
  
  // Excluir produto
  function excluirProduto(index) {
    const produtos = JSON.parse(localStorage.getItem('brinquedos')) || [];
    produtos.splice(index, 1);
    localStorage.setItem('brinquedos', JSON.stringify(produtos));
    carregarProdutos();
  }
