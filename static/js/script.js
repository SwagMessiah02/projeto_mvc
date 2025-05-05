document.addEventListener("DOMContentLoaded", () => {
    const formUsuario = document.getElementById('formUsuario');
    const formBrinquedo = document.getElementById('formBrinquedo');
  
    if (formUsuario) {
      formUsuario.reset(); 
      formUsuario.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = document.getElementById('nomeUsuario').value.trim();
        const email = document.getElementById('emailUsuario').value.trim();
        const msg = document.getElementById('msgUsuario');

        fetch('https://projeto-mvc.onrender.com/get_usuarios')
          .then((response) => response.json())
          .then((usuarios) => {

          const usuarioExistente = usuarios.find(
            (u) => u.nome.toLowerCase() === nome.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
          );
  
          if (usuarioExistente) {
            msg.style.color = 'red';
            msg.textContent = 'Usuário com mesmo nome ou email já cadastrado.';
          } else {
            msg.style.color = 'green';
            msg.textContent = 'Usuário adicionado com sucesso!';

            fetch('https://projeto-mvc.onrender.com/usuarios', 
              {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nome: nome, email: email})
              }); 

            formUsuario.reset();
          }
  
          setTimeout(() => msg.textContent = '', 3000);
        });
      });
    }
  
    if (formBrinquedo) {
      formBrinquedo.reset(); 
      formBrinquedo.addEventListener('submit', function (e) {
        e.preventDefault();
        const nome = document.getElementById('nomeBrinquedo').value.trim();
        const preco = document.getElementById('precoBrinquedo').value.trim();
        const msg = document.getElementById('msgBrinquedo');
  
        fetch('https://projeto-mvc.onrender.com/get_usuarios') 
          .then((response) => response.json())
          .then((brinquedos) => {
  
          const brinquedoExistente = brinquedos.find(
            (p) => p.nome.toLowerCase() === nome.toLowerCase()
          );
  
          if (brinquedoExistente) {
            msg.style.color = 'red';
            msg.textContent = 'Brinquedo com mesmo nome já cadastrado.';
          } else {
            msg.style.color = 'green';
            msg.textContent = 'Brinquedo adicionado com sucesso!';

            fetch('https://projeto-mvc.onrender.com/brinquedos', 
              {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nome: nome, preco: preco})
              }); 

            formBrinquedo.reset();
          }
  
          setTimeout(() => msg.textContent = '', 3000);
        });
      });
    }
  
    if (document.getElementById('listaUsuarios')) carregarUsuarios();
    if (document.getElementById('listaBrinquedos')) carregarBrinquedos();
  });

  function carregarUsuarios() {
    fetch('https://projeto-mvc.onrender.com/get_usuarios')
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
  
  function carregarBrinquedos() {
    fetch('https://projeto-mvc.onrender.com/get_brinquedos')
      .then((response) => response.json())
      .then((data) => {

      const lista = document.getElementById('listaBrinquedos');
      lista.innerHTML = '';
  
      data.forEach((brinquedo) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span id="brinquedoTexto-${brinquedo.nome}">${brinquedo.nome} - R$ ${brinquedo.preco}</span>
          <span id="botoesBrinquedo-${brinquedo.nome}">
            <span style="cursor:pointer; margin-left: 10px;" onclick="editarBrinquedo('${brinquedo.nome}')">✏️</span>
            <span style="cursor:pointer; margin-left: 10px;" onclick="excluirBrinquedo('${brinquedo.nome}')">🗑️</span>
          </span>
        `;
        lista.appendChild(li);
      });
    });
  }
  
  function editarUsuario(nome) {
    fetch('https://projeto-mvc.onrender.com/get_usuarios')
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

  function editarBrinquedo(nome) {
    fetch('https://projeto-mvc.onrender.com/get_brinquedos')
      .then((response) => response.json()) 
      .then((data) => {

      const brinquedo = data.find((u) => u.nome === nome);
  
      const spanTexto = document.getElementById(`brinquedoTexto-${nome}`);
      const botoes = document.getElementById(`botoesBrinquedo-${nome}`);
  
      spanTexto.innerHTML = `
        <input type="text" id="editNomeBrinquedo-${nome}" value="${brinquedo.nome}">
        <input type="number" id="editPrecoBrinquedo-${nome}" value="${brinquedo.email}">
      `;
 
      botoes.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
          <span style="cursor:pointer;" onclick="salvarEdicaoBrinquedo('${nome}')">✅</span>
          <span style="cursor:pointer;" onclick="carregarBrinquedos()">❌</span>
        </div>
      `;
      });
  }
  
  async function salvarEdicaoUsuario(nome) {
    const nomeEditado = document.getElementById(`editNome-${nome}`).value.trim();
    const emailEditado = document.getElementById(`editEmail-${nome}`).value.trim();

    fetch('https://projeto-mvc.onrender.com/get_usuarios')
      .then((response) => response.json())
      .then((usuarios) => {
  
      var duplicado = usuarios.some((u) =>
        (u.nome.toLowerCase() === nomeEditado.toLowerCase() 
          || u.email.toLowerCase() === emailEditado.toLowerCase()) && u.nome !== nome
      );
  
      if (duplicado) {
        alert("Nome ou email já cadastrado.");
        return;
      } else {
        
      }
    });

    if(!duplicado) {
      await fetch('https://projeto-mvc.onrender.com/atualizar_usuario', 
        {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          {
            nome: nome, 
            nome_editado: nomeEditado, 
            email_editado: emailEditado
          })
      });
    }

    carregarUsuarios();
  }

  async function salvarEdicaoBrinquedo(nome) {
    const nomeEditado = document.getElementById(`editNomeBrinquedo-${nome}`).value.trim();
    const precoEditado = document.getElementById(`editPrecoBrinquedo-${nome}`).value.trim();
    
    fetch('https://projeto-mvc.onrender.com/get_brinquedos')
      .then((response) => response.json())
      .then((brinquedos) => {

      const duplicado = brinquedos.some((p) =>
        (p.nome.toLowerCase() === nomeEditado.toLowerCase() || p.preco === precoEditado) && p.nome !== nome
      );
    
      if (duplicado) {
        alert("Nome ou preço já cadastrado.");
        return;
      }
    });

    await fetch('https://projeto-mvc.onrender.com/atualizar_brinquedo', 
      {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          {
           nome: nome, 
           nome_editado: nomeEditado, 
           preco_editado: precoEditado
          }
        )
      });

      carregarBrinquedos();
  }
  
  async function excluirUsuario(nome) {
    const msg = document.getElementById('msgCadastro');
    
    await fetch('https://projeto-mvc.onrender.com/get_usuarios')
      .then((response) => response.json())
      .then((data) => {
        const usuarioExistente = data.find((usuario) => usuario.nome === nome);
          
        if(!usuarioExistente) {
          msg.style.color = 'red';
          msg.textContent = 'Usuário inexistente';
        } 
      });

      setTimeout(() => msg.textContent = '', 3000);

    await fetch('https://projeto-mvc.onrender.com/remover_usuario', 
    {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nome: nome})
    });

    carregarUsuarios();
  }
  
  async function excluirBrinquedo(nome) {
    const msg = document.getElementById('msgCadastro');
    
    await fetch('https://projeto-mvc.onrender.com/get_brinquedos')
      .then((response) => response.json())
      .then((data) => {
        const brinquedoExistente = data.find((brinquedo) => brinquedo.nome === nome);
        
        if(!brinquedoExistente) {
          msg.style.color = 'red';
          msg.textContent = 'Brinquedo inexistente';
        } 
      });

      setTimeout(() => msg.textContent = '', 3000);

    await fetch('https://projeto-mvc.onrender.com/remover_brinquedo', 
    {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nome: nome})
    });

    carregarBrinquedos();
  }