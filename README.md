# 🥂 5ª Edição do Jantar de Gala MFN | IBREI
## Landing Page de Alta Conversão

Landing page premium desenvolvida para capturar inscrições e interesse em patrocínio do **5º Jantar de Gala MFN | IBREI**, posicionado como o principal evento de networking executivo do mercado imobiliário e financeiro nacional.

---

## ✅ Funcionalidades Implementadas

### Conversão de Inscrições
- **Hero** com promessa forte, metadados do evento e countdown em tempo real
- **Barra de urgência** fixa no topo com contagem regressiva de vagas
- **Formulário de inscrição** com validação, seleção automática via cards e persistência na API
- **Trust bar** com selos de segurança e prova social
- **Modal de reserva** em 3 etapas: dados pessoais → pagamento → comprovante

### Conversão de Patrocínio
- **Seção dedicada** com proposta de valor, benefícios e urgência (cotas limitadas)
- **Modal de patrocínio** com formulário para captação de leads
- **Redirecionamento automático para WhatsApp** após envio do formulário

### WhatsApp
- **Comprovante de pagamento (PIX e Cartão):** redireciona para `+55 11 99207-5511`
- **Formulário de patrocínio/apoio:** redireciona para `+55 11 97827-9672` com mensagem personalizada contendo nome, empresa, e-mail, telefone, cota e mensagem

### Integração Agendor CRM (via Make.com)
- **Webhook Make.com:** `https://hook.us2.make.com/a1l472inhz95k294uh18u2prp1n2q2r5`
- **Formulário de Reserva de Assento** → cria Pessoa + Negócio no Agendor (produto: Jantar de Gala, valor R$ 1.000)
- **Formulário de Patrocínio** → cria Pessoa + Negócio (produto: Patrocínio Prata, valor R$ 15.000)
- **Formulário de Apoiador** → cria Pessoa + Negócio (produto: Apoiador 3k Jantar de Gala, valor R$ 3.000)
- Funil: **SDR** | Etapa: **Lead Novo**
- Fire-and-forget: erros na integração não bloqueiam o formulário

### Speakers Confirmados
| Nome | Cargo |
|------|-------|
| Jorge Lima | Secretário de Desenvolvimento do Estado de São Paulo |
| Luiz Alberto Castiglioni | Ministro da Indústria e Comércio do Paraguai · Ex-Vice-Presidente |
| Paulo Correa | CEO da C&A |
| Daniella Marques | Ex-Presidente da Caixa Econômica Federal · Partner and Chairwoman da Legend Special Assets |

### Realização
| Organização | Representante |
|-------------|---------------|
| MFN | Gislaine Toth |
| IBREI | Maurício Prazak |

### UX & Interatividade
- Countdown ao vivo para 08/Jun/2026
- Partículas animadas no hero
- Scroll reveal em todos os elementos
- Scroll spy no menu (link ativo por seção)
- FAQ accordion com animação
- Menu hambúrguer responsivo
- Botão voltar ao topo
- Navegação suave em todos os anchors

---

## 📁 Estrutura de Arquivos

```
index.html              → Página única completa
css/
  style.css             → Design system premium (Dark & Gold)
js/
  main.js               → Lógica completa (countdown, forms, modais, FAQ)
  agendor.js            → Integração Agendor CRM via Make.com webhook
images/
  speaker-jorge-lima.jpg
  speaker-luiz-alberto.jpg
  speaker-paulo-correa.jpg
  speaker-daniella-marques.jpg
  realizador-gislaine-toth.jpg
  realizador-mauricio-prazak.jpg
  logo-mfn.png
README.md               → Esta documentação
```

---

## ⚠️ IMPORTANTE — Problema de CORS com a API do Agendor

A API do Agendor **bloqueia chamadas diretas do navegador** (política CORS). Chamadas `fetch()` diretas de `jantar.grupomfn.com.br` para `api.agendor.com.br` resultam em:

```
Access to fetch at 'https://api.agendor.com.br/v3/funnels' from origin
'https://jantar.grupomfn.com.br' has been blocked by CORS policy
```

**Solução adotada:** usar o **Make.com** como intermediário server-side. O formulário envia os dados para o webhook do Make, que então chama a API do Agendor server-to-server (sem restrição de CORS).

---

## 🔧 Configuração do Make.com (Scenario)

### Fluxo do Scenario
```
[Módulo 1] Webhook recebe dados do formulário
      ↓
[Módulo 2] HTTP POST → api.agendor.com.br/v3/people (cria Pessoa)
      ↓
[Módulo 3] HTTP POST → api.agendor.com.br/v3/people/{{id}}/deals (cria Negócio)
```

### Módulo 2 — Criar Pessoa
- **URL:** `https://api.agendor.com.br/v3/people`
- **Method:** `POST`
- **Headers:**
  - `Authorization`: `Token 55eda00a-2b23-445c-8673-ec6333f5bfc1`
  - `X-User-Email`: `marketing@grupomfn.com.br`
  - `Content-Type`: `application/json`
- **Body (JSON string):**
```json
{
  "name": "{{1.nome}}",
  "email": "{{1.email}}",
  "role": "{{1.cargo}}",
  "contact": {
    "whatsapp": "{{1.telefone}}"
  },
  "organization": {
    "name": "{{1.empresa}}"
  }
}
```

### Módulo 3 — Criar Negócio
- **URL:** `https://api.agendor.com.br/v3/people/{{2.data.data.id}}/deals`
- **Method:** `POST`
- **Headers:** mesmos do módulo 2
- **Body (JSON string):**
```json
{
  "title": "{{1.negocio_titulo}}",
  "value": "{{1.negocio_valor}}",
  "dealStatusText": "ongoing",
  "description": "{{1.negocio_descricao}}"
}
```

> ⚠️ **Atenção:** `{{2.data.data.id}}` — dois níveis de `data` porque o retorno do Agendor é `{ data: { data: { id: ... } } }`. Confirme no output do Módulo 2 antes de salvar.

### Campos enviados pelo webhook (js/agendor.js)
| Campo | Descrição |
|-------|-----------|
| `nome` | Nome completo |
| `email` | E-mail |
| `telefone` | WhatsApp/telefone |
| `cargo` | Cargo |
| `empresa` | Empresa |
| `negocio_titulo` | Ex: "Jantar de Gala - João Silva" |
| `negocio_valor` | 1000 / 15000 / 3000 |
| `negocio_produto` | Nome do produto |
| `negocio_funil` | "SDR" |
| `negocio_etapa` | "Lead Novo" |
| `negocio_descricao` | Texto completo com todos os dados |

---

## 🔑 Credenciais Agendor

| Item | Valor |
|------|-------|
| Token API | `55eda00a-2b23-445c-8673-ec6333f5bfc1` |
| E-mail | `marketing@grupomfn.com.br` |
| Funil | SDR |
| Etapa | Lead Novo |

---

## 🎨 Design System

| Elemento | Valor |
|----------|-------|
| Tema | Dark premium com dourado |
| Gold | `#C9A84C` |
| Background | `#08080E` |
| Tipografia | Cormorant Garamond (display) + Inter (corpo) |
| Border | `rgba(201,168,76,.12)` |

---

## 🗄️ Estrutura de Dados

### `registrations` — Inscrições no evento
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | text | UUID único |
| `name` | text | Nome completo |
| `email` | text | E-mail |
| `phone` | text | WhatsApp |
| `company` | text | Empresa |
| `role` | text | Cargo |
| `lote` | text | `lote1` / `lote2` / `lote3` / `integral` |
| `payment_method` | text | `pix` / `cartao` |
| `comunidade_c` | text | `sim` / `nao` |
| `status` | text | `lead` / `comprovante_enviado` |

### `sponsors` — Leads de patrocínio
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | text | UUID único |
| `name` | text | Nome do contato |
| `company` | text | Empresa |
| `email` | text | E-mail |
| `phone` | text | WhatsApp |
| `message` | rich_text | Mensagem / interesse |
| `cota` | text | Cota de interesse |

---

## 🔗 Endpoints da API Interna

| Ação | Método | URL |
|------|--------|-----|
| Criar inscrição | POST | `tables/registrations` |
| Listar inscrições | GET | `tables/registrations` |
| Criar lead de patrocínio | POST | `tables/sponsors` |
| Listar leads | GET | `tables/sponsors` |

> ⚠️ Esses endpoints funcionam apenas no ambiente Genspark. No GitHub Pages retornam `405 Method Not Allowed` — comportamento esperado e tratado silenciosamente no código.

---

## 📐 Fluxo de Conversão da Página

```
[Urgency Bar] → "Apenas X vagas"
     ↓
[Hero] → Promessa forte + CTA principal + Countdown
     ↓
[Autoridade] → Números animados (4 edições, 800+, 98%)
     ↓
[Sobre] → Reframing: "não é jantar, é sala de negócios"
     ↓
[Speakers] → 4 palestrantes confirmados
     ↓
[Experiência] → Timeline hora a hora
     ↓
[Perfil] → "quem vai estar lá" — ativa FOMO
     ↓
[Vídeo + Prova] → Aftermovie + depoimento de ROI
     ↓
[Depoimentos] → 3 testemunhos executivos
     ↓
[Ingressos + Form] → Seleção + captura imediata
     ↓
[Patrocínio] → CTA secundário com urgência de cotas
     ↓
[Realização] → MFN (Gislaine Toth) + IBREI (Maurício Prazak)
     ↓
[FAQ] → Remove objeções restantes
     ↓
[CTA Final] → Última chance com reforço emocional
```

---

## 🐛 Problemas Conhecidos e Soluções

### 1. `Unexpected end of input` no main.js
**Causa:** edição manual no GitHub deixou o arquivo incompleto/corrompido.  
**Solução:** substituir o conteúdo completo do `js/main.js` no GitHub pela versão do projeto (832 linhas). Nunca editar apenas uma parte do arquivo manualmente.

### 2. CORS bloqueado para a API Agendor
**Causa:** `api.agendor.com.br` não permite chamadas diretas de navegadores (sem header `Access-Control-Allow-Origin`).  
**Solução:** usar Make.com como proxy server-side via webhook.

### 3. `POST tables/registrations 405`
**Causa:** endpoints `tables/` são internos do Genspark e não funcionam no GitHub Pages.  
**Solução:** comportamento esperado — o erro é capturado silenciosamente e não afeta o fluxo do usuário.

### 4. Variáveis do Make chegando vazias
**Causa:** o Make "congela" a estrutura do webhook na primeira execução. Se algum campo estava vazio nessa execução, ele não mapeia para os módulos seguintes.  
**Solução:** clicar em "Re-determine data structure" no Módulo 1, enviar o formulário com todos os campos preenchidos, e remapear os campos nos módulos HTTP.

### 5. `Name can't be blank` / `name is missing` no Agendor
**Causa:** variáveis do webhook não mapeadas corretamente no body do módulo HTTP.  
**Solução:** no body do Módulo 2, garantir que cada valor seja um chip roxo (variável dinâmica), não texto literal. Usar `"name": "{{1.nome}}"` e não `"name": "nome"`.

### 6. `funnel is invalid` no Agendor
**Causa:** o Agendor não aceita o nome do funil como string — exige o ID numérico ou o negócio precisa ser criado via endpoint `/people/{id}/deals`.  
**Solução:** usar a URL `https://api.agendor.com.br/v3/people/{{2.data.data.id}}/deals` e remover os campos `funnel` e `stage` do body.

---

## 📅 Dados do Evento (5ª Edição)

| Item | Detalhe |
|------|---------|
| Data | 08 de Junho de 2026 |
| Horário | 19h00 |
| Local | Grand Hyatt São Paulo |
| Capacidade | 200 convidados (curados) |
| Dress Code | Black tie / Passeio completo |

---

## 🚀 Deploy

O site está publicado em **https://jantar.grupomfn.com.br** via GitHub Pages.

Para atualizar:
1. Edite os arquivos no repositório GitHub
2. Faça commit direto na branch `main`
3. Aguarde ~2 minutos para o deploy automático
4. ⚠️ **Nunca edite `main.js` parcialmente** — sempre substitua o arquivo completo para evitar erros de sintaxe

---

## 🚧 Próximos Passos Recomendados

- [ ] Finalizar configuração do Módulo 3 no Make (criar Negócio no Agendor)
- [ ] Validar que email e empresa chegam corretamente na Pessoa criada no Agendor
- [ ] Adicionar pixel de rastreamento (Meta Ads / Google Ads)
- [ ] Conectar com gateway de pagamento (Pagar.me / Stripe)
- [ ] Criar painel admin para visualizar inscrições e leads
- [ ] Integrar link real do aftermovie (YouTube embed)
- [ ] Implementar OG tags completas para compartilhamento social
