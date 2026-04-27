/* ══════════════════════════════════════════════════════
   AGENDOR CRM — Integração via Make.com Webhook
   Jantar de Gala MFN | IBREI — 5ª Edição

   ⚠️  A API do Agendor bloqueia chamadas diretas do navegador (CORS).
       Solução: usar Make.com como intermediário server-side.

   SETUP (único — leva ~5 min):
   1. Acesse make.com e crie uma conta gratuita
   2. Crie um Scenario com módulo "Webhooks > Custom webhook"
   3. Copie a URL gerada (ex: https://hook.eu2.make.com/xxxx...)
   4. Adicione módulo "Agendor > Create a Deal" (ou HTTP Request)
   5. Cole a URL no campo MAKE_WEBHOOK_URL abaixo
   6. Faça commit no GitHub

   Enquanto o webhook não está configurado, os leads
   são salvos localmente no console (não bloqueia o formulário).
══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────
   ★ COLE AQUI A URL DO WEBHOOK DO MAKE.COM
─────────────────────────────────────────────────────*/
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/a1l472inhz95k294uh18u2prp1n2q2r5';

/* ─────────────────────────────────────────────────────
   PRODUTOS — mapeamento de formulários
─────────────────────────────────────────────────────*/
const AGENDOR_PRODUCTS = {
  ingresso:   { name: 'Jantar de Gala',             value: 1000  },
  patrocinio: { name: 'Patrocínio Prata',            value: 15000 },
  apoiador:   { name: 'Apoiador 3k Jantar de Gala', value: 3000  },
};

/* ─────────────────────────────────────────────────────
   CREDENCIAIS AGENDOR (usadas pelo Make no servidor)
   — ficam aqui apenas para referência / Make config
─────────────────────────────────────────────────────*/
const _AGENDOR_META = {
  token:      '55eda00a-2b23-445c-8673-ec6333f5bfc1',
  email:      'marketing@grupomfn.com.br',
  funnel:     'SDR',
  stage:      'Lead Novo',
};

/* ─────────────────────────────────────────────────────
   FUNÇÃO PÚBLICA — sendLeadToAgendor
   leadData : { name, email, phone, company, role }
   dealKey  : 'ingresso' | 'patrocinio' | 'apoiador'
─────────────────────────────────────────────────────*/
async function sendLeadToAgendor(leadData, dealKey) {
  const product = AGENDOR_PRODUCTS[dealKey];
  if (!product) {
    console.warn('[Agendor] Chave de produto inválida:', dealKey);
    return;
  }

  const payload = {
    /* ── PESSOA ── */
    nome:     leadData.name    || '',
    email:    leadData.email   || '',
    telefone: leadData.phone   || '',
    cargo:    leadData.role    || '',
    empresa:  leadData.company || '',

    /* ── NEGÓCIO ── */
    negocio_titulo:    product.name + ' - ' + (leadData.name || ''),
    negocio_valor:     product.value,
    negocio_produto:   product.name,
    negocio_funil:     _AGENDOR_META.funnel,
    negocio_etapa:     _AGENDOR_META.stage,
    negocio_descricao: 'Produto: ' + product.name +
                       '\nEmpresa: ' + (leadData.company || '—') +
                       '\nCargo: '   + (leadData.role    || '—') +
                       '\nTelefone: '+ (leadData.phone   || '—') +
                       '\nOrigem: Landing Page Jantar de Gala MFN | IBREI',
  };

  // Log local sempre (útil para debug)
  console.info('[Agendor] Lead pronto para envio:', payload);

  // Se webhook não configurado, apenas loga e sai
  if (!MAKE_WEBHOOK_URL) {
    console.warn(
      '[Agendor] ⚠️ MAKE_WEBHOOK_URL não configurado.\n' +
      'Siga as instruções no início de js/agendor.js para criar o webhook no Make.com.'
    );
    return;
  }

  try {
    const res = await fetch(MAKE_WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (res.ok) {
      console.info(`[Agendor] ✅ Lead enviado ao Make: "${payload.titulo}"`);
    } else {
      const txt = await res.text().catch(() => '');
      console.warn(`[Agendor] Make respondeu ${res.status}: ${txt}`);
    }
  } catch (err) {
    // Falha silenciosa — nunca bloqueia o formulário
    console.warn('[Agendor] Erro ao chamar webhook Make:', err.message);
  }
}

/* ─────────────────────────────────────────────────────
   EXPÕE NO ESCOPO GLOBAL (usado pelo main.js)
─────────────────────────────────────────────────────*/
window.AgendorCRM = { sendLead: sendLeadToAgendor };
