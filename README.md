# Betel - Vestuário Feminino Glamour

Base estática para a carta de apresentação da Betel. O site funciona como
vitrine: mostra produtos, fotos, categorias e contato, sem preço, carrinho ou
checkout.

## Painel de edição

Depois de publicar e configurar a Netlify, o painel ficará em:

```text
https://SEU-SITE.netlify.app/admin/
```

O admin usa Decap CMS. Ele permite editar:

- Informações do site
- WhatsApp
- Instagram
- Endereço
- Horário
- Produtos
- Fotos dos produtos

O e-mail admin definido para acesso é:

```text
matheusoliveira79682413@gmail.com
```

## Como cadastrar produtos

Pelo painel, abra `Produtos` e adicione um item na lista. Cada produto precisa
ter:

- Grupo
- Categoria
- Nome
- Descrição
- Pelo menos uma foto

O site usa o arquivo `data/produtos.json` como fonte da vitrine.

## Cadastro manual por pastas

O fluxo por pastas ainda pode ser usado para organizar um lote de fotos antes de
atualizar o JSON:

```text
assets/produtos/roupas/
  01.jpeg
  descricao01.txt
  02.jpeg
  descricao02.txt

assets/produtos/perfumes/femininos/
  01.jpg
  descricao01.txt

assets/produtos/perfumes/masculinos/
  01.jpg
  descricao01.txt
```

Não precisa cadastrar preço, tamanho, cor, disponibilidade ou destaque.

## Categorias disponíveis

- Roupas
- Perfumes > Perfumes Femininos
- Perfumes > Perfumes Masculinos

## Descrições

Cada imagem numerada deve ter uma descrição com o mesmo número:

```text
01.jpeg
descricao01.txt
```

Para roupas, use este formato:

```text
Nome do produto:
Blazer Cropped em Couro Sintético Marrom

Descrição curta:
Blazer feminino cropped em couro sintético marrom...
```

## Como visualizar

Como os produtos vêm de `data/produtos.json`, o ideal é abrir por servidor local.
Eu já deixei o site preparado para publicação estática gratuita, por exemplo em
uma URL do Netlify.

## Publicação

Para o editor funcionar online, publique o projeto pela Netlify conectado a um
repositório GitHub. Depois, na Netlify:

1. Ative Identity.
2. Ative Git Gateway.
3. Convide `matheusoliveira79682413@gmail.com` como usuário.
4. Acesse `/admin/` e faça login pelo convite.
