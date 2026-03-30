/* ============================================
   edoclink v9 — Complete Mockup Application
   AG Grid + Full Detail Pages + Quick Filters
   ============================================ */

// ==================== PART 1: DATA ====================

const store = {
  users: [
    { id: 1, name: 'Filipe Correia', initials: 'FC', dept: 'Administração', gradient: 'linear-gradient(135deg,#0ABAB5,#089E9A)' },
    { id: 2, name: 'João Silva', initials: 'JS', dept: 'Jurídico', gradient: 'linear-gradient(135deg,#0ABAB5,#089E9A)' },
    { id: 3, name: 'Maria Santos', initials: 'MS', dept: 'Financeiro', gradient: 'linear-gradient(135deg,#F5A623,#D97706)' },
    { id: 4, name: 'Ana Oliveira', initials: 'AO', dept: 'Recursos Humanos', gradient: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' },
    { id: 5, name: 'Pedro Costa', initials: 'PC', dept: 'TI', gradient: 'linear-gradient(135deg,#10B981,#059669)' },
    { id: 6, name: 'Carla Mendes', initials: 'CM', dept: 'Administração', gradient: 'linear-gradient(135deg,#EC4899,#DB2777)' },
    { id: 7, name: 'Rui Ferreira', initials: 'RF', dept: 'Financeiro', gradient: 'linear-gradient(135deg,#F59E0B,#D97706)' },
    { id: 8, name: 'Sofia Almeida', initials: 'SA', dept: 'Direção Geral', gradient: 'linear-gradient(135deg,#6366F1,#4F46E5)' }
  ],

  documents: [
    { id: 1, title: 'Relatório Financeiro Q4 2024', type: 'Correspondência Recebida', status: 'Pronto', ref: 'DOC-2024/5678', date: '2024-03-15', entityName: 'Empresa ABC, Lda.', classificationPath: 'Financeiro > Relatórios > Trimestrais', folderId: 3, files: [{ name: 'Relatorio_Q4_2024.pdf', size: '2.4 MB', type: 'pdf' }, { name: 'Dados_Financeiros_Q4.xlsx', size: '1.1 MB', type: 'xlsx' }, { name: 'Parecer_Auditoria.pdf', size: '856 KB', type: 'pdf' }], additionalFields: { entryNumber: 'ENT-2024/00456', department: 'Financeiro', value: '125.000,00 €', confidential: 'Não', receptionDate: '2024-03-14', internalNotes: 'Verificar dados com o departamento contabilístico antes de aprovar.' } },
    { id: 2, title: 'Proposta Orçamental 2025', type: 'Documento Interno', status: 'Em edição', ref: 'DOC-2024/9012', date: '2024-03-20', entityName: '', classificationPath: 'Financeiro > Orçamentos', folderId: 3, files: [{ name: 'Proposta_Orcamental_2025.docx', size: '3.2 MB', type: 'docx' }], additionalFields: { department: 'Financeiro', value: '2.500.000,00 €', confidential: 'Sim' } },
    { id: 3, title: 'Contrato de Prestação de Serviços — ABC Consulting', type: 'Contrato', status: 'Pronto', ref: 'DOC-2024/1234', date: '2024-03-10', entityName: 'ABC Consulting, S.A.', classificationPath: 'Jurídico > Contratos > Prestação de Serviços', folderId: 4, files: [{ name: 'Contrato_Prestacao_Servicos.pdf', size: '4.2 MB', type: 'pdf' }, { name: 'Anexo_Tecnico.pdf', size: '1.8 MB', type: 'pdf' }], additionalFields: { contractNumber: 'CTR-2024/0089', department: 'Jurídico', value: '125.000,00 €', startDate: '2024-04-01', endDate: '2025-03-31' } },
    { id: 4, title: 'Ata da Reunião de Direção — 5 Março', type: 'Ata', status: 'Encerrado', ref: 'DOC-2024/3344', date: '2024-03-05', entityName: '', classificationPath: 'Administração > Atas', folderId: 6, files: [{ name: 'Ata_Direcao_05Mar.pdf', size: '1.2 MB', type: 'pdf' }], additionalFields: { meetingDate: '2024-03-05', participants: 'Direção Executiva', approvedBy: 'Sofia Almeida' } },
    { id: 5, title: 'Ofício — Resposta ao Pedido de Informação', type: 'Correspondência Expedida', status: 'Pronto', ref: 'DOC-2024/5566', date: '2024-03-01', entityName: 'Câmara Municipal de Lisboa', classificationPath: 'Administração > Ofícios', folderId: 7, files: [{ name: 'Oficio_Resposta_CML.pdf', size: '890 KB', type: 'pdf' }, { name: 'Anexos_Documentais.pdf', size: '2.3 MB', type: 'pdf' }], additionalFields: { outgoingNumber: 'SAI-2024/00234', department: 'Administração', registeredMail: 'Sim' } },
    { id: 6, title: 'Memorando Interno — Política de Teletrabalho', type: 'Memorando', status: 'Pronto', ref: 'DOC-2024/6677', date: '2024-03-18', entityName: '', classificationPath: 'RH > Políticas', folderId: 8, files: [{ name: 'Memorando_Teletrabalho.pdf', size: '456 KB', type: 'pdf' }], additionalFields: { department: 'Recursos Humanos', targetAudience: 'Todos os colaboradores' } },
    { id: 7, title: 'Relatório Mensal Março — Departamento TI', type: 'Documento Interno', status: 'Em edição', ref: 'DOC-2024/7788', date: '2024-03-25', entityName: '', classificationPath: 'TI > Relatórios', folderId: 9, files: [{ name: 'Relatorio_TI_Marco.docx', size: '1.5 MB', type: 'docx' }], additionalFields: { department: 'TI', period: 'Março 2024' } },
    { id: 8, title: 'Contrato de Fornecimento de Equipamento', type: 'Contrato', status: 'Pronto', ref: 'DOC-2024/8899', date: '2024-02-28', entityName: 'TechSupply, Lda.', classificationPath: 'Jurídico > Contratos > Fornecimento', folderId: 5, files: [{ name: 'Contrato_Fornecimento_Tech.pdf', size: '3.8 MB', type: 'pdf' }], additionalFields: { contractNumber: 'CTR-2024/0076', value: '45.000,00 €', department: 'TI' } },
    { id: 9, title: 'Correspondência — Notificação Fiscal', type: 'Correspondência Recebida', status: 'Pronto', ref: 'DOC-2024/9900', date: '2024-03-12', entityName: 'Autoridade Tributária', classificationPath: 'Financeiro > Fiscal', folderId: 3, files: [{ name: 'Notificacao_AT.pdf', size: '234 KB', type: 'pdf' }], additionalFields: { entryNumber: 'ENT-2024/00467', department: 'Financeiro', urgent: 'Sim' } },
    { id: 10, title: 'Proposta Comercial — Rev. 3', type: 'Documento Interno', status: 'Pronto', ref: 'DOC-2024/1235', date: '2024-03-12', entityName: 'Cliente XYZ, S.A.', classificationPath: 'Comercial > Propostas', folderId: 4, files: [{ name: 'Proposta_Rev3.docx', size: '2.1 MB', type: 'docx' }], additionalFields: { value: '85.000,00 €', department: 'Comercial' } },
    { id: 11, title: 'Relatório de Auditoria Interna 2024', type: 'Documento Interno', status: 'Em edição', ref: 'DOC-2024/1100', date: '2024-03-22', entityName: '', classificationPath: 'Administração > Auditoria', folderId: 6, files: [{ name: 'Auditoria_2024_Draft.docx', size: '4.5 MB', type: 'docx' }], additionalFields: { department: 'Administração', confidential: 'Sim' } },
    { id: 12, title: 'Ofício à Segurança Social', type: 'Correspondência Expedida', status: 'Pronto', ref: 'DOC-2024/1201', date: '2024-03-08', entityName: 'Segurança Social', classificationPath: 'RH > Obrigações Legais', folderId: 8, files: [{ name: 'Oficio_SS.pdf', size: '567 KB', type: 'pdf' }], additionalFields: { outgoingNumber: 'SAI-2024/00198', department: 'RH' } },
    { id: 13, title: 'Ata da Assembleia Geral — Fevereiro', type: 'Ata', status: 'Encerrado', ref: 'DOC-2024/1302', date: '2024-02-20', entityName: '', classificationPath: 'Administração > Atas', folderId: 6, files: [{ name: 'Ata_AG_Fev2024.pdf', size: '2.0 MB', type: 'pdf' }], additionalFields: { meetingDate: '2024-02-20', participants: 'Acionistas' } },
    { id: 14, title: 'Contrato de Manutenção — Sistemas AVAC', type: 'Contrato', status: 'Pronto', ref: 'DOC-2024/1403', date: '2024-02-15', entityName: 'ClimaTech, S.A.', classificationPath: 'Jurídico > Contratos > Manutenção', folderId: 5, files: [{ name: 'Contrato_AVAC.pdf', size: '1.9 MB', type: 'pdf' }], additionalFields: { contractNumber: 'CTR-2024/0065', value: '18.000,00 €', department: 'Facilities' } },
    { id: 15, title: 'Memorando — Formação Obrigatória 2024', type: 'Memorando', status: 'Pronto', ref: 'DOC-2024/1504', date: '2024-03-01', entityName: '', classificationPath: 'RH > Formação', folderId: 8, files: [{ name: 'Memo_Formacao_2024.pdf', size: '345 KB', type: 'pdf' }], additionalFields: { department: 'RH', targetAudience: 'Todos' } },
    { id: 16, title: 'Pedido de Informação — Projeto Infraestrutura', type: 'Correspondência Expedida', status: 'Pronto', ref: 'DOC-2024/1605', date: '2024-03-19', entityName: 'Ministério das Infraestruturas', classificationPath: 'Administração > Ofícios', folderId: 7, files: [{ name: 'Pedido_Info_Infraestrutura.pdf', size: '678 KB', type: 'pdf' }], additionalFields: { outgoingNumber: 'SAI-2024/00256', department: 'Administração' } },
    { id: 17, title: 'Nota Interna — Encerramento Escritórios Páscoa', type: 'Documento Interno', status: 'Pronto', ref: 'DOC-2024/1706', date: '2024-03-20', entityName: '', classificationPath: 'Administração > Comunicações', folderId: 6, files: [{ name: 'Nota_Pascoa.pdf', size: '123 KB', type: 'pdf' }], additionalFields: { department: 'Administração' } },
    { id: 18, title: 'Correspondência — Pedido de Colaboração ANPC', type: 'Correspondência Recebida', status: 'Em edição', ref: 'DOC-2024/1807', date: '2024-03-23', entityName: 'ANPC', classificationPath: 'Administração > Correspondência', folderId: 7, files: [{ name: 'Pedido_ANPC.pdf', size: '445 KB', type: 'pdf' }], additionalFields: { entryNumber: 'ENT-2024/00489', department: 'Administração' } },
    { id: 19, title: 'Contrato ABC Consulting — Assinado', type: 'Contrato', status: 'Pronto', ref: 'DOC-2024/1908', date: '2024-03-15', entityName: 'ABC Consulting, S.A.', classificationPath: 'Jurídico > Contratos', folderId: 4, files: [{ name: 'Contrato_ABC_Assinado.pdf', size: '5.1 MB', type: 'pdf' }], additionalFields: { contractNumber: 'CTR-2024/0089', value: '125.000,00 €' } },
    { id: 20, title: 'Relatório de Despesas Q1 2024', type: 'Documento Interno', status: 'Anulado', ref: 'DOC-2024/2009', date: '2024-03-10', entityName: '', classificationPath: 'Financeiro > Relatórios', folderId: 3, files: [{ name: 'Despesas_Q1_ANULADO.xlsx', size: '980 KB', type: 'xlsx' }], additionalFields: { department: 'Financeiro', reason: 'Dados incorretos — substituído por DOC-2024/2010' } }
  ],

  folders: [
    { id: 1, name: 'Contratos', parentId: null, status: 'Aberta', date: '2024-01-05', description: 'Pasta raiz de contratos' },
    { id: 2, name: 'Correspondência', parentId: null, status: 'Aberta', date: '2024-01-05', description: 'Correspondência geral' },
    { id: 3, name: 'Relatórios Financeiros', parentId: null, status: 'Aberta', date: '2024-01-10', description: 'Relatórios do departamento financeiro' },
    { id: 4, name: 'Contratos 2024', parentId: 1, status: 'Aberta', date: '2024-01-15', description: 'Contratos do ano 2024' },
    { id: 5, name: 'Fornecimento de Bens', parentId: 1, status: 'Aberta', date: '2024-01-20', description: 'Contratos de fornecimento' },
    { id: 6, name: 'Administração', parentId: null, status: 'Aberta', date: '2024-01-05', description: 'Documentos administrativos' },
    { id: 7, name: 'Correspondência 2024', parentId: 2, status: 'Aberta', date: '2024-01-10', description: 'Correspondência do ano 2024' },
    { id: 8, name: 'Recursos Humanos', parentId: null, status: 'Aberta', date: '2024-01-05', description: 'Pasta de RH' },
    { id: 9, name: 'Projeto Alpha', parentId: null, status: 'Aberta', date: '2024-02-01', description: 'Documentação do Projeto Alpha' },
    { id: 10, name: 'Empreitadas (Arquivo)', parentId: 1, status: 'Terminada', date: '2023-06-01', description: 'Contratos de empreitada arquivados' }
  ],

  flows: [
    { id: 1, title: 'Aprovação Contrato Prestação de Serviços', type: 'Aprovação', status: 'Pendente', ref: 'PROC-2024/1234', date: '2024-03-10', folderId: 4, deadline: '2024-03-27', stages: [
      { name: 'Registo', userId: 1, status: 'completed', date: '2024-03-10 10:15', note: 'Contrato recebido e registado no sistema.', files: [] },
      { name: 'Validação Jurídica', userId: 2, status: 'completed', date: '2024-03-12 16:45', note: 'Contrato validado juridicamente. Sem observações.', files: [{ name: 'Parecer_Juridico.pdf', size: '1.8 MB', type: 'pdf' }] },
      { name: 'Aprovação', userId: 1, status: 'current', date: '2024-03-12 17:00', note: '', files: [] },
      { name: 'Assinatura Digital', userId: 8, status: 'pending', date: '', note: '', files: [] },
      { name: 'Arquivo', userId: null, status: 'pending', date: '', note: '', files: [] }
    ]},
    { id: 2, title: 'Revisão Proposta Orçamental 2025', type: 'Parecer', status: 'Pendente', ref: 'PROC-2024/9012', date: '2024-03-18', folderId: 3, deadline: '2024-03-28', stages: [
      { name: 'Elaboração', userId: 4, status: 'completed', date: '2024-03-18 09:00', note: 'Proposta elaborada com base nos dados de 2024.', files: [] },
      { name: 'Parecer', userId: 1, status: 'current', date: '2024-03-19 10:00', note: '', files: [] },
      { name: 'Aprovação', userId: 8, status: 'pending', date: '', note: '', files: [] }
    ]},
    { id: 3, title: 'Distribuição de Correspondência — Ref. 44521', type: 'Distribuição', status: 'Terminado', ref: 'PROC-2024/7788', date: '2024-03-15', folderId: 7, deadline: null, stages: [
      { name: 'Registo', userId: 3, status: 'completed', date: '2024-03-15 08:30', note: 'Correspondência registada.', files: [] },
      { name: 'Triagem', userId: 5, status: 'completed', date: '2024-03-16 10:00', note: 'Encaminhado para despacho.', files: [] },
      { name: 'Despacho', userId: 1, status: 'completed', date: '2024-03-18 14:00', note: 'Despachado para arquivo.', files: [] },
      { name: 'Arquivo', userId: null, status: 'completed', date: '2024-03-22 09:00', note: 'Arquivado automaticamente.', files: [] }
    ]},
    { id: 4, title: 'Validar Documentação do Projeto Alpha', type: 'Aprovação', status: 'Pendente', ref: 'PROC-2024/3456', date: '2024-03-14', folderId: 9, deadline: '2024-03-31', stages: [
      { name: 'Preparação', userId: 5, status: 'completed', date: '2024-03-14 11:00', note: 'Documentação compilada.', files: [] },
      { name: 'Validação', userId: 1, status: 'current', date: '2024-03-15 09:00', note: '', files: [] },
      { name: 'Aprovação Final', userId: 8, status: 'pending', date: '', note: '', files: [] }
    ]},
    { id: 5, title: 'Rever Ata da Reunião de Direção', type: 'Parecer', status: 'Pendente', ref: 'PROC-2024/1122', date: '2024-03-06', folderId: 6, deadline: '2024-04-02', stages: [
      { name: 'Elaboração', userId: 6, status: 'completed', date: '2024-03-06 15:00', note: 'Ata redigida.', files: [{ name: 'Ata_Direcao_Draft.docx', size: '1.0 MB', type: 'docx' }] },
      { name: 'Revisão', userId: 1, status: 'current', date: '2024-03-07 09:00', note: '', files: [] },
      { name: 'Publicação', userId: 6, status: 'pending', date: '', note: '', files: [] }
    ]},
    { id: 6, title: 'Assinatura Relatório Financeiro Q4', type: 'Assinatura', status: 'Pendente', ref: 'PROC-2024/5679', date: '2024-03-16', folderId: 3, deadline: '2024-03-27', stages: [
      { name: 'Preparação', userId: 3, status: 'completed', date: '2024-03-16 10:00', note: 'Relatório preparado para assinatura.', files: [] },
      { name: 'Assinatura', userId: 1, status: 'current', date: '2024-03-16 14:00', note: '', files: [] },
      { name: 'Arquivo', userId: null, status: 'pending', date: '', note: '', files: [] }
    ]},
    { id: 7, title: 'Difusão Memorando Teletrabalho', type: 'Difusão', status: 'Terminado', ref: 'PROC-2024/6678', date: '2024-03-19', folderId: 8, deadline: null, stages: [
      { name: 'Criação', userId: 4, status: 'completed', date: '2024-03-19 09:00', note: '', files: [] },
      { name: 'Aprovação', userId: 8, status: 'completed', date: '2024-03-19 15:00', note: 'Aprovado.', files: [] },
      { name: 'Difusão', userId: null, status: 'completed', date: '2024-03-20 08:00', note: 'Enviado a todos os colaboradores.', files: [] }
    ]},
    { id: 8, title: 'Aprovação Contrato Fornecimento TechSupply', type: 'Aprovação', status: 'Terminado', ref: 'PROC-2024/8900', date: '2024-02-20', folderId: 5, deadline: null, stages: [
      { name: 'Registo', userId: 5, status: 'completed', date: '2024-02-20 10:00', note: '', files: [] },
      { name: 'Validação', userId: 2, status: 'completed', date: '2024-02-22 14:00', note: '', files: [] },
      { name: 'Aprovação', userId: 1, status: 'completed', date: '2024-02-25 11:00', note: 'Aprovado.', files: [] },
      { name: 'Assinatura', userId: 8, status: 'completed', date: '2024-02-27 16:00', note: '', files: [] }
    ]},
    { id: 9, title: 'Parecer Jurídico — Contrato AVAC', type: 'Parecer', status: 'Suspenso', ref: 'PROC-2024/1404', date: '2024-02-16', folderId: 5, deadline: '2024-04-15', stages: [
      { name: 'Pedido', userId: 7, status: 'completed', date: '2024-02-16 09:00', note: 'Parecer solicitado.', files: [] },
      { name: 'Análise', userId: 2, status: 'current', date: '2024-02-18 10:00', note: 'Suspenso: a aguardar documentação adicional.', files: [] },
      { name: 'Emissão Parecer', userId: 2, status: 'pending', date: '', note: '', files: [] }
    ]},
    { id: 10, title: 'Distribuição Correspondência ANPC', type: 'Distribuição', status: 'Pendente', ref: 'PROC-2024/1808', date: '2024-03-23', folderId: 7, deadline: '2024-04-05', stages: [
      { name: 'Registo', userId: 3, status: 'completed', date: '2024-03-23 08:00', note: '', files: [] },
      { name: 'Despacho', userId: 1, status: 'current', date: '2024-03-23 10:00', note: '', files: [] },
      { name: 'Execução', userId: 5, status: 'pending', date: '', note: '', files: [] }
    ]},
    { id: 11, title: 'Assinatura Ofício CML', type: 'Assinatura', status: 'Indeferido', ref: 'PROC-2024/5567', date: '2024-02-28', folderId: 7, deadline: null, stages: [
      { name: 'Preparação', userId: 6, status: 'completed', date: '2024-02-28 09:00', note: '', files: [] },
      { name: 'Assinatura', userId: 8, status: 'completed', date: '2024-03-01 10:00', note: 'Indeferido: faltam dados.', files: [] }
    ]},
    { id: 12, title: 'Aprovação Relatório Auditoria', type: 'Aprovação', status: 'Pendente', ref: 'PROC-2024/1101', date: '2024-03-22', folderId: 6, deadline: '2024-04-10', stages: [
      { name: 'Elaboração', userId: 7, status: 'completed', date: '2024-03-22 09:00', note: 'Relatório elaborado.', files: [{ name: 'Auditoria_Draft.pdf', size: '3.2 MB', type: 'pdf' }] },
      { name: 'Revisão', userId: 1, status: 'current', date: '2024-03-22 14:00', note: '', files: [] },
      { name: 'Aprovação', userId: 8, status: 'pending', date: '', note: '', files: [] },
      { name: 'Publicação', userId: null, status: 'pending', date: '', note: '', files: [] }
    ]},
    { id: 13, title: 'Aprovação Orçamento com Pareceres Paralelos', type: 'Aprovação', status: 'Pendente', ref: 'PROC-2024/1300', date: '2024-03-20', folderId: 3, deadline: '2024-04-05', stages: [
      { name: 'Elaboração', userId: 7, status: 'completed', date: '2024-03-20 09:00', note: 'Orçamento elaborado.', files: [], parallelGroup: null },
      { name: 'Parecer Financeiro', userId: 3, status: 'completed', date: '2024-03-22 14:00', note: 'Parecer favorável.', files: [], parallelGroup: 'A' },
      { name: 'Parecer Jurídico', userId: 2, status: 'current', date: '2024-03-22 14:00', note: '', files: [], parallelGroup: 'A' },
      { name: 'Aprovação Direção', userId: 8, status: 'pending', date: '', note: '', files: [], parallelGroup: null },
      { name: 'Arquivo', userId: null, status: 'pending', date: '', note: '', files: [], parallelGroup: null }
    ]}
  ],

  notifications: [
    { id: 1, text: 'João Silva enviou etapa "Parecer" de PROC-2024/3456', time: '2024-03-25 14:45', read: false, type: 'flow', refId: 4 },
    { id: 2, text: 'Novo documento registado: Relatório Mensal Março', time: '2024-03-25 13:00', read: false, type: 'doc', refId: 7 },
    { id: 3, text: 'Prazo a vencer amanhã: Aprovação Contrato ABC', time: '2024-03-25 09:00', read: false, type: 'deadline', refId: 1 },
    { id: 4, text: 'Ana Oliveira terminou pasta "Projeto Beta — Fase 1"', time: '2024-03-25 12:00', read: false, type: 'folder', refId: 9 },
    { id: 5, text: 'Fluxo PROC-2024/7788 terminado com sucesso', time: '2024-03-22 09:00', read: false, type: 'flow', refId: 3 },
    { id: 6, text: 'Pedro Costa adicionou ficheiro a DOC-2024/4455', time: '2024-03-25 11:00', read: true, type: 'doc', refId: 8 }
  ],

  activities: [
    { id: 1, userId: 2, action: 'enviou etapa "Parecer" de', target: 'PROC-2024/3456', targetType: 'flow', targetId: 4, time: '2024-03-25 14:45' },
    { id: 2, userId: 3, action: 'registou', target: 'Relatório Mensal Março', targetType: 'doc', targetId: 7, time: '2024-03-25 13:00' },
    { id: 3, userId: 4, action: 'terminou pasta', target: 'Projeto Beta — Fase 1', targetType: 'folder', targetId: 9, time: '2024-03-25 12:00' },
    { id: 4, userId: 5, action: 'adicionou ficheiro a', target: 'DOC-2024/4455', targetType: 'doc', targetId: 8, time: '2024-03-25 11:00' },
    { id: 5, userId: 1, action: 'aprovou etapa de', target: 'PROC-2024/8900', targetType: 'flow', targetId: 8, time: '2024-03-24 16:00' },
    { id: 6, userId: 6, action: 'criou pasta', target: 'Administração > Atas 2024', targetType: 'folder', targetId: 6, time: '2024-03-24 10:00' },
    { id: 7, userId: 8, action: 'assinou', target: 'Contrato TechSupply', targetType: 'doc', targetId: 8, time: '2024-03-23 14:00' },
    { id: 8, userId: 7, action: 'devolveu etapa de', target: 'PROC-2024/1404', targetType: 'flow', targetId: 9, time: '2024-03-23 09:00' }
  ],

  savedSearches: [
    { id: 1, label: 'Contratos ativos 2024', query: 'Contrato', type: 'documents' },
    { id: 2, label: 'Pendentes há mais de 5 dias', query: 'Pendente', type: 'flows' },
    { id: 3, label: 'Documentos por classificar', query: 'classificar', type: 'documents' }
  ]
};

// ==================== PART 2: STATE ====================

const state = {
  currentPage: 'home',
  docDetailId: null,
  flowDetailId: null,
  docDetailTab: 'dados',
  flowDetailTab: 'etapas',
  documents: { filter: 'Todos', sort: 'recent', sortDir: 'desc', page: 1, perPage: 15, advanced: {}, view: 'table', quickFilters: [] },
  flows: { filter: 'Pendentes', sort: 'recent', sortDir: 'desc', page: 1, perPage: 15, view: 'table', quickFilters: [] },
  folders: { currentId: null, breadcrumb: [] },
  search: { query: '', type: 'all', quickFilters: [] },
  fileViewerId: null,
  fileViewerDocId: null,
  fileViewerPage: 1,
  fileViewerZoom: 100,
  stageInsertFormIdx: null,
  stageInsertFlowId: null
};

// AG Grid instances
var docGridApi = null;
var flowGridApi = null;

// ==================== PART 3: UTILITIES ====================

function formatDate(dateStr) {
  if (!dateStr) return '—';
  var d = new Date(dateStr);
  var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  return d.getDate() + ' de ' + months[d.getMonth()] + ' de ' + d.getFullYear();
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  var d = new Date(dateStr);
  var months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  var now = new Date();
  var d = new Date(dateStr);
  var diffMs = now - d;
  var diffMin = Math.floor(diffMs / 60000);
  var diffHr = Math.floor(diffMs / 3600000);
  var diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'Agora mesmo';
  if (diffMin < 60) return 'Há ' + diffMin + ' min';
  if (diffHr < 24) return 'Há ' + diffHr + ' hora' + (diffHr > 1 ? 's' : '');
  if (diffDay < 7) return 'Há ' + diffDay + ' dia' + (diffDay > 1 ? 's' : '');
  return formatDateShort(dateStr);
}

function getUser(id) {
  return store.users.find(function (u) { return u.id === id; }) || { id: 0, name: 'Sistema', initials: 'SIS', dept: '', gradient: 'linear-gradient(135deg,#94A3B8,#64748B)' };
}

function generateId(collection) {
  var max = 0;
  store[collection].forEach(function (i) { if (i.id > max) max = i.id; });
  return max + 1;
}

function searchAll(query) {
  if (!query || query.length < 2) return { documents: [], folders: [], flows: [] };
  var q = query.toLowerCase();
  return {
    documents: store.documents.filter(function (d) { return d.title.toLowerCase().indexOf(q) !== -1 || d.ref.toLowerCase().indexOf(q) !== -1 || d.type.toLowerCase().indexOf(q) !== -1 || (d.entityName && d.entityName.toLowerCase().indexOf(q) !== -1); }),
    folders: store.folders.filter(function (f) { return f.name.toLowerCase().indexOf(q) !== -1; }),
    flows: store.flows.filter(function (f) { return f.title.toLowerCase().indexOf(q) !== -1 || f.ref.toLowerCase().indexOf(q) !== -1 || f.type.toLowerCase().indexOf(q) !== -1; })
  };
}

function getDocsByFolder(folderId) { return store.documents.filter(function (d) { return d.folderId === folderId; }); }
function getFlowsByFolder(folderId) { return store.flows.filter(function (f) { return f.folderId === folderId; }); }
function getSubfolders(parentId) { return store.folders.filter(function (f) { return f.parentId === parentId; }); }

function getPendingTasks() {
  return store.flows.filter(function (f) {
    if (f.status !== 'Pendente') return false;
    var currentStage = f.stages.find(function (s) { return s.status === 'current'; });
    return currentStage && currentStage.userId === 1;
  });
}

function getFileExt(filename) {
  if (!filename) return '';
  var parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

function getDocTypeIndicatorClass(type) {
  if (type.indexOf('Expedida') !== -1 || type === 'Memorando') return 'type-outgoing';
  if (type === 'Documento Interno' || type === 'Ata') return 'type-internal';
  return 'type-correspondence';
}

function getDocStatusClass(status) {
  switch (status) {
    case 'Pronto': return 'status-ready';
    case 'Em edição': return 'status-editing';
    case 'Encerrado': return 'status-closed';
    case 'Anulado': return 'status-canceled';
    default: return 'status-ready';
  }
}

function getFlowBadgeClass(status) {
  switch (status) {
    case 'Pendente': return 'badge-pending';
    case 'Terminado': return 'badge-completed';
    case 'Suspenso': return 'badge-suspended';
    case 'Indeferido': return 'badge-suspended';
    default: return 'badge-pending';
  }
}

function getFlowStatusBarClass(status) {
  switch (status) {
    case 'Pendente': return 'status-bar-pending';
    case 'Terminado': return 'status-bar-completed';
    case 'Suspenso': return 'status-bar-suspended';
    case 'Indeferido': return 'status-bar-suspended';
    default: return 'status-bar-pending';
  }
}

function getFileThumbClass(fileType) {
  if (!fileType) return 'pdf';
  var t = fileType.toLowerCase();
  if (t === 'xlsx' || t === 'xls') return 'xlsx';
  if (t === 'docx' || t === 'doc') return 'docx';
  return 'pdf';
}

function buildBreadcrumb(folderId) {
  var crumbs = [];
  var current = store.folders.find(function (f) { return f.id === folderId; });
  while (current) {
    crumbs.unshift({ id: current.id, name: current.name });
    current = current.parentId ? store.folders.find(function (f) { return f.id === current.parentId; }) : null;
  }
  return crumbs;
}

function daysUntilDeadline(deadline) {
  if (!deadline) return 999;
  var now = new Date();
  var dl = new Date(deadline);
  return Math.ceil((dl - now) / 86400000);
}

function getUserShortName(user) {
  if (!user || !user.name) return '—';
  var parts = user.name.split(' ');
  if (parts.length > 1) return parts[0] + ' ' + parts[parts.length - 1][0] + '.';
  return parts[0];
}

// ==================== AG GRID LOCALE ====================

var AG_LOCALE_PT = {
  page: 'Página',
  more: 'Mais',
  to: 'a',
  of: 'de',
  next: 'Seguinte',
  last: 'Último',
  first: 'Primeiro',
  previous: 'Anterior',
  loadingOoo: 'A carregar...',
  noRowsToShow: 'Sem resultados',
  filterOoo: 'Filtrar...',
  equals: 'Igual',
  notEqual: 'Diferente',
  contains: 'Contém',
  notContains: 'Não contém',
  startsWith: 'Começa com',
  endsWith: 'Termina com',
  blank: 'Vazio',
  notBlank: 'Não vazio',
  pageSizeSelectorLabel: 'Registos por página:',
  ariaFilterInput: 'Filtrar...'
};

// ==================== AG GRID CREATORS ====================

function createDocGrid(containerId, docs) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.className = 'ag-theme-alpine edoc-ag-grid';
  container.style.width = '100%';

  var columnDefs = [
    { headerName: 'Referência', field: 'ref', width: 140, filter: 'agTextColumnFilter' },
    { headerName: 'Assunto', field: 'title', flex: 1, filter: 'agTextColumnFilter', minWidth: 200,
      cellRenderer: function(p) { return '<span style="font-weight:600;color:var(--gray-800)">' + p.value + '</span>'; }
    },
    { headerName: 'Tipo', field: 'type', width: 180, filter: 'agTextColumnFilter',
      cellRenderer: function(p) {
        var cls = getDocTypeIndicatorClass(p.value);
        var bgMap = { 'type-correspondence': 'background:linear-gradient(135deg,var(--teal-50),rgba(10,186,181,0.1));color:var(--teal-600);', 'type-internal': 'background:linear-gradient(135deg,#EDE9FE,#DDD6FE);color:#6D28D9;', 'type-outgoing': 'background:linear-gradient(135deg,var(--orange-50),var(--orange-100));color:var(--orange-600);' };
        return '<span class="ag-type-badge" style="' + (bgMap[cls] || '') + '">' + p.value + '</span>';
      }
    },
    { headerName: 'Estado', field: 'status', width: 120, filter: 'agTextColumnFilter',
      cellRenderer: function(p) { return '<span class="doc-status ' + getDocStatusClass(p.value) + '">' + p.value + '</span>'; }
    },
    { headerName: 'Data', field: 'date', width: 120, filter: 'agDateColumnFilter', sort: 'desc',
      valueFormatter: function(p) { return formatDateShort(p.value); },
      comparator: function(a, b) { return new Date(a) - new Date(b); }
    },
    { headerName: 'Entidade', field: 'entityName', width: 180, filter: 'agTextColumnFilter',
      valueFormatter: function(p) { return p.value || '—'; }
    },
    { headerName: 'Classificação', field: 'classificationPath', width: 200, filter: 'agTextColumnFilter', hide: true,
      valueFormatter: function(p) { return p.value || '—'; }
    },
    { headerName: 'Ficheiros', field: 'fileCount', width: 100, filter: false,
      cellRenderer: function(p) { return '<span class="ag-files-count">' + p.value + '</span>'; }
    },
    { headerName: 'Pasta', field: 'folderName', width: 150, filter: 'agTextColumnFilter', hide: true }
  ];

  var rowData = docs.map(function(d) {
    var folder = store.folders.find(function(f) { return f.id === d.folderId; });
    return {
      id: d.id, ref: d.ref, title: d.title, type: d.type, status: d.status,
      date: d.date, entityName: d.entityName || '', classificationPath: d.classificationPath || '',
      fileCount: d.files.length, folderName: folder ? folder.name : ''
    };
  });

  var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: { sortable: true, resizable: true, floatingFilter: true },
    domLayout: 'autoHeight',
    pagination: true,
    paginationPageSize: 15,
    rowGroupPanelShow: 'always',
    animateRows: true,
    suppressCellFocus: true,
    rowSelection: 'single',
    localeText: AG_LOCALE_PT,
    onRowClicked: function(event) {
      if (event.data && event.data.id) {
        state.docDetailId = event.data.id;
        navigateTo('doc-detail');
      }
    }
  };

  if (docGridApi) { docGridApi.destroy(); docGridApi = null; }
  docGridApi = agGrid.createGrid(container, gridOptions);
}

function createFlowGrid(containerId, flows) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.className = 'ag-theme-alpine edoc-ag-grid';
  container.style.width = '100%';

  var columnDefs = [
    { headerName: 'Referência', field: 'ref', width: 150, filter: 'agTextColumnFilter' },
    { headerName: 'Assunto', field: 'title', flex: 1, filter: 'agTextColumnFilter', minWidth: 200,
      cellRenderer: function(p) { return '<span style="font-weight:600;color:var(--gray-800)">' + p.value + '</span>'; }
    },
    { headerName: 'Tipo', field: 'type', width: 130, filter: 'agTextColumnFilter',
      cellRenderer: function(p) { return '<span class="ag-type-badge" style="background:linear-gradient(135deg,var(--teal-50),rgba(10,186,181,0.1));color:var(--teal-600);">' + p.value + '</span>'; }
    },
    { headerName: 'Estado', field: 'status', width: 120, filter: 'agTextColumnFilter',
      cellRenderer: function(p) { return '<span class="flow-badge ' + getFlowBadgeClass(p.value) + '">' + p.value + '</span>'; }
    },
    { headerName: 'Data', field: 'date', width: 120, filter: 'agDateColumnFilter', sort: 'desc',
      valueFormatter: function(p) { return formatDateShort(p.value); },
      comparator: function(a, b) { return new Date(a) - new Date(b); }
    },
    { headerName: 'Etapa Atual', field: 'currentStage', width: 170, filter: 'agTextColumnFilter' },
    { headerName: 'Responsável', field: 'stageUser', width: 160, filter: 'agTextColumnFilter',
      cellRenderer: function(p) {
        if (!p.data.stageUserInitials || p.data.stageUserInitials === '—') return '<span style="color:var(--gray-300)">—</span>';
        return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:12px"><span style="width:22px;height:22px;border-radius:50%;color:white;font-size:8px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:' + p.data.stageUserGradient + '">' + p.data.stageUserInitials + '</span>' + p.value + '</span>';
      }
    },
    { headerName: 'Prazo', field: 'deadline', width: 120, filter: 'agDateColumnFilter',
      cellRenderer: function(p) {
        if (!p.value) return '<span style="color:var(--gray-300)">—</span>';
        var days = daysUntilDeadline(p.value);
        var style = days <= 1 ? 'color:var(--error);font-weight:700' : days <= 3 ? 'color:var(--orange-500);font-weight:600' : 'color:var(--gray-500)';
        return '<span style="' + style + '">' + formatDateShort(p.value) + '</span>';
      },
      comparator: function(a, b) { return (a ? new Date(a) : new Date('2099-01-01')) - (b ? new Date(b) : new Date('2099-01-01')); }
    },
    { headerName: 'Pasta', field: 'folderName', width: 150, filter: 'agTextColumnFilter', hide: true }
  ];

  var rowData = flows.map(function(f) {
    var folder = store.folders.find(function(ff) { return ff.id === f.folderId; });
    var currentStage = f.stages.find(function(s) { return s.status === 'current'; });
    var stageUser = currentStage && currentStage.userId ? getUser(currentStage.userId) : null;
    var stageText = '';
    if (currentStage) { stageText = currentStage.name + ' (' + (f.stages.indexOf(currentStage) + 1) + '/' + f.stages.length + ')'; }
    else if (f.status === 'Terminado') { stageText = 'Concluído'; }
    return {
      id: f.id, ref: f.ref, title: f.title, type: f.type, status: f.status,
      date: f.date, currentStage: stageText, stageUser: stageUser ? stageUser.name : '—',
      stageUserInitials: stageUser ? stageUser.initials : '—',
      stageUserGradient: stageUser ? stageUser.gradient : '',
      deadline: f.deadline, folderName: folder ? folder.name : ''
    };
  });

  var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    defaultColDef: { sortable: true, resizable: true, floatingFilter: true },
    domLayout: 'autoHeight',
    pagination: true,
    paginationPageSize: 15,
    rowGroupPanelShow: 'always',
    animateRows: true,
    suppressCellFocus: true,
    rowSelection: 'single',
    localeText: AG_LOCALE_PT,
    onRowClicked: function(event) {
      if (event.data && event.data.id) {
        state.flowDetailId = event.data.id;
        navigateTo('flow-detail');
      }
    }
  };

  if (flowGridApi) { flowGridApi.destroy(); flowGridApi = null; }
  flowGridApi = agGrid.createGrid(container, gridOptions);
}

// ==================== QUICK FILTERS ====================

function applyDocQuickFilters(docs) {
  var qf = state.documents.quickFilters;
  if (qf.length === 0) return docs;
  return docs.filter(function(d) {
    var pass = true;
    qf.forEach(function(f) {
      switch(f) {
        case 'recentes':
          var weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
          if (new Date(d.date) < weekAgo) pass = false;
          break;
        case 'meus':
          if (!d.folderId) pass = false;
          break;
        case 'sem-class':
          if (d.classificationPath) pass = false;
          break;
        case 'com-entidade':
          if (!d.entityName) pass = false;
          break;
        case 'contratos':
          if (d.type !== 'Contrato') pass = false;
          break;
        case 'correspondencia':
          if (d.type.indexOf('Correspondência') === -1) pass = false;
          break;
      }
    });
    return pass;
  });
}

function applyFlowQuickFilters(flows) {
  var qf = state.flows.quickFilters;
  if (qf.length === 0) return flows;
  return flows.filter(function(f) {
    var pass = true;
    qf.forEach(function(q) {
      switch(q) {
        case 'meus-pendentes':
          var cs = f.stages.find(function(s) { return s.status === 'current'; });
          if (!cs || cs.userId !== 1) pass = false;
          break;
        case 'urgentes':
          if (daysUntilDeadline(f.deadline) > 3) pass = false;
          break;
        case 'vencidos':
          if (daysUntilDeadline(f.deadline) > 0) pass = false;
          break;
        case 'esta-semana':
          var wAgo = new Date(); wAgo.setDate(wAgo.getDate() - 7);
          if (new Date(f.date) < wAgo) pass = false;
          break;
        case 'aprovacoes':
          if (f.type !== 'Aprovação') pass = false;
          break;
        case 'pareceres':
          if (f.type !== 'Parecer') pass = false;
          break;
      }
    });
    return pass;
  });
}

function renderDocQuickFilters() {
  var qf = state.documents.quickFilters;
  var filters = [
    { key: 'recentes', label: 'Recentes', icon: '&#128337;' },
    { key: 'meus', label: 'Os meus', icon: '&#128100;' },
    { key: 'sem-class', label: 'Pendentes de classificação', icon: '&#128196;' },
    { key: 'com-entidade', label: 'Com entidade', icon: '&#127970;' },
    { key: 'contratos', label: 'Contratos', icon: '&#128221;' },
    { key: 'correspondencia', label: 'Correspondência', icon: '&#9993;' }
  ];
  var html = '<div class="quick-filters-bar">';
  filters.forEach(function(f) {
    var active = qf.indexOf(f.key) !== -1 ? ' active' : '';
    html += '<button class="quick-filter' + active + '" data-quick-filter="' + f.key + '" data-entity="documents"><span class="qf-icon">' + f.icon + '</span> ' + f.label + '</button>';
  });
  html += '</div>';
  return html;
}

function renderFlowQuickFilters() {
  var qf = state.flows.quickFilters;
  var filters = [
    { key: 'meus-pendentes', label: 'Os meus pendentes', icon: '&#128100;' },
    { key: 'urgentes', label: 'Urgentes', icon: '&#9888;' },
    { key: 'vencidos', label: 'Vencidos', icon: '&#128308;' },
    { key: 'esta-semana', label: 'Esta semana', icon: '&#128197;' },
    { key: 'aprovacoes', label: 'Aprovações', icon: '&#9989;' },
    { key: 'pareceres', label: 'Pareceres', icon: '&#128172;' }
  ];
  var html = '<div class="quick-filters-bar">';
  filters.forEach(function(f) {
    var active = qf.indexOf(f.key) !== -1 ? ' active' : '';
    html += '<button class="quick-filter' + active + '" data-quick-filter="' + f.key + '" data-entity="flows"><span class="qf-icon">' + f.icon + '</span> ' + f.label + '</button>';
  });
  html += '</div>';
  return html;
}

// ==================== PART 4: RENDER FUNCTIONS ====================

function renderHome() {
  var page = document.getElementById('page-home');
  if (!page) return;

  var pendingTasks = getPendingTasks();
  var urgentTasks = pendingTasks.filter(function (f) { return daysUntilDeadline(f.deadline) <= 2; });
  var normalTasks = pendingTasks.filter(function (f) { return daysUntilDeadline(f.deadline) > 2; });

  var now = new Date();
  var weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
  var monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  var sentThisWeek = store.flows.filter(function (f) { return new Date(f.date) >= weekAgo; }).length;
  var completedThisMonth = store.flows.filter(function (f) { return f.status === 'Terminado' && new Date(f.date) >= monthStart; }).length;

  var hour = now.getHours();
  var greeting = 'Bom dia';
  if (hour >= 13 && hour < 20) greeting = 'Boa tarde';
  else if (hour >= 20 || hour < 6) greeting = 'Boa noite';

  var dateStr = now.toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  var html = '';
  html += '<div class="page-hero"><div class="hero-greeting"><h1>' + greeting + ', Filipe</h1><p class="hero-subtitle">Tens <strong>' + pendingTasks.length + ' tarefa' + (pendingTasks.length !== 1 ? 's' : '') + '</strong> pendente' + (pendingTasks.length !== 1 ? 's' : '') + ' hoje</p></div><div class="hero-date">' + dateStr.charAt(0).toUpperCase() + dateStr.slice(1) + '</div></div>';

  html += '<div class="stats-row">';
  html += '<div class="stat-card stat-pending"><div class="stat-number">' + pendingTasks.length + '</div><div class="stat-label">Pendentes</div><div class="stat-trend trend-up">A tratar</div></div>';
  html += '<div class="stat-card stat-urgent"><div class="stat-number">' + urgentTasks.length + '</div><div class="stat-label">Urgentes</div><div class="stat-trend trend-warning">' + (urgentTasks.length > 0 ? 'Atenção!' : 'Nenhuma') + '</div></div>';
  html += '<div class="stat-card stat-sent"><div class="stat-number">' + sentThisWeek + '</div><div class="stat-label">Enviados esta semana</div><div class="stat-trend trend-up">Bom ritmo!</div></div>';
  html += '<div class="stat-card stat-completed"><div class="stat-number">' + completedThisMonth + '</div><div class="stat-label">Concluídos este mês</div><div class="stat-trend trend-up">Bom ritmo!</div></div>';
  html += '</div>';

  if (urgentTasks.length > 0) {
    html += '<section class="section"><div class="section-header"><h2 class="section-title"><span class="section-icon urgent-icon"></span> Urgente</h2><span class="section-count">' + urgentTasks.length + '</span></div><div class="task-list">';
    urgentTasks.forEach(function (f) { html += renderTaskCard(f, true); });
    html += '</div></section>';
  }

  if (normalTasks.length > 0) {
    html += '<section class="section"><div class="section-header"><h2 class="section-title"><span class="section-icon pending-icon"></span> Para Tratar</h2><span class="section-count">' + normalTasks.length + '</span><button class="btn-text" data-action="view-all-tasks">Ver todos</button></div><div class="task-list">';
    normalTasks.forEach(function (f) { html += renderTaskCard(f, false); });
    html += '</div></section>';
  }

  html += '<section class="section"><div class="section-header"><h2 class="section-title"><span class="section-icon activity-icon"></span> Atividade Recente</h2></div><div class="activity-feed">';
  store.activities.forEach(function (a) {
    var user = getUser(a.userId);
    var previewType = a.targetType === 'doc' ? 'doc' : a.targetType === 'flow' ? 'flow' : 'folder';
    html += '<div class="activity-item"><div class="activity-avatar" style="background:' + user.gradient + '">' + user.initials + '</div><div class="activity-content"><span class="activity-user">' + user.name + '</span> ' + a.action + ' <a href="#" class="activity-link" data-type="' + a.targetType + '" data-id="' + a.targetId + '" data-preview-type="' + previewType + '" data-preview-id="' + a.targetId + '">' + a.target + '</a><div class="activity-time">' + timeAgo(a.time) + '</div></div></div>';
  });
  html += '</div></section>';
  page.innerHTML = html;
}

function renderTaskCard(flow, urgent) {
  var currentStageIdx = flow.stages.findIndex(function (s) { return s.status === 'current'; });
  var totalStages = flow.stages.length;
  var sender = currentStageIdx > 0 ? getUser(flow.stages[currentStageIdx - 1].userId) : null;
  var days = daysUntilDeadline(flow.deadline);
  var deadlineText = '', deadlineClass = '';
  if (days <= 0) { deadlineText = 'Vencido!'; deadlineClass = 'deadline-urgent'; }
  else if (days <= 1) { deadlineText = 'Vence amanhã'; deadlineClass = 'deadline-urgent'; }
  else if (days <= 2) { deadlineText = 'Vence em ' + days + ' dias'; deadlineClass = 'deadline-warning'; }
  else if (days <= 7) { deadlineText = 'Vence em ' + days + ' dias'; }

  var priorityClass = urgent ? (days <= 1 ? 'priority-high' : 'priority-medium') : 'priority-normal';
  var folder = flow.folderId ? store.folders.find(function (f) { return f.id === flow.folderId; }) : null;

  var actionButtons = '';
  if (flow.type === 'Aprovação') actionButtons = '<button class="btn-action btn-approve" data-flow-id="' + flow.id + '" data-action="approve">Aprovar</button><button class="btn-action btn-reject" data-flow-id="' + flow.id + '" data-action="reject">Rejeitar</button>';
  else if (flow.type === 'Parecer') actionButtons = '<button class="btn-action btn-send" data-flow-id="' + flow.id + '" data-action="approve">Enviar</button><button class="btn-action btn-return" data-flow-id="' + flow.id + '" data-action="return">Devolver</button>';
  else if (flow.type === 'Assinatura') actionButtons = '<button class="btn-action btn-sign" data-flow-id="' + flow.id + '" data-action="approve">Assinar</button>';
  else actionButtons = '<button class="btn-action btn-send" data-flow-id="' + flow.id + '" data-action="approve">Enviar</button>';
  actionButtons += '<button class="btn-action btn-view" data-flow-id="' + flow.id + '" data-action="view-flow">Ver</button>';

  var html = '<div class="task-card ' + (urgent ? 'urgent' : '') + '" data-flow-id="' + flow.id + '">';
  html += '<div class="task-priority ' + priorityClass + '"></div><div class="task-content">';
  html += '<div class="task-title">' + flow.title + '</div><div class="task-meta">';
  html += '<span class="task-tag tag-flow">Fluxo</span><span class="task-ref" data-preview-type="flow" data-preview-id="' + flow.id + '">' + flow.ref + '</span><span class="task-separator">·</span>';
  if (folder) html += '<span data-preview-type="folder" data-preview-id="' + folder.id + '">Pasta: ' + folder.name + '</span><span class="task-separator">·</span>';
  if (deadlineText) html += '<span class="task-deadline ' + deadlineClass + '">' + deadlineText + '</span>';
  html += '</div><div class="task-from">' + (sender ? 'De: ' + sender.name + ' · ' : '') + 'Etapa ' + (currentStageIdx + 1) + ' de ' + totalStages + '</div>';
  html += '</div><div class="task-actions">' + actionButtons + '</div></div>';
  return html;
}

function renderDocuments() {
  var page = document.getElementById('page-documents');
  if (!page) return;

  var docs = store.documents.slice();

  // Status filter
  if (state.documents.filter !== 'Todos') {
    var filterMap = { 'Prontos': 'Pronto', 'Em edição': 'Em edição', 'Anulados': 'Anulado', 'Encerrados': 'Encerrado' };
    var statusFilter = filterMap[state.documents.filter] || state.documents.filter;
    docs = docs.filter(function (d) { return d.status === statusFilter; });
  }

  // Advanced filters
  if (state.documents.advanced.type) docs = docs.filter(function (d) { return d.type === state.documents.advanced.type; });
  if (state.documents.advanced.entity) {
    var q = state.documents.advanced.entity.toLowerCase();
    docs = docs.filter(function (d) { return d.entityName && d.entityName.toLowerCase().indexOf(q) !== -1; });
  }

  // Quick filters
  docs = applyDocQuickFilters(docs);

  // Sort for list view
  if (state.documents.view === 'list') {
    if (state.documents.sort === 'recent') docs.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    else if (state.documents.sort === 'oldest') docs.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    else if (state.documents.sort === 'az') docs.sort(function (a, b) { return a.title.localeCompare(b.title); });
    else if (state.documents.sort === 'za') docs.sort(function (a, b) { return b.title.localeCompare(a.title); });
  }

  var total = docs.length;
  var html = '';
  html += '<div class="page-header-bar"><div class="page-header-left"><h1 class="page-title">Documentos</h1><span class="page-count">' + total + ' documento' + (total !== 1 ? 's' : '') + '</span></div>';
  html += '<div class="page-header-right">';
  html += '<div class="view-toggle"><button class="view-btn ' + (state.documents.view === 'table' ? 'active' : '') + '" data-view="table" data-entity="documents" title="Tabela"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg></button><button class="view-btn ' + (state.documents.view === 'list' ? 'active' : '') + '" data-view="list" data-entity="documents" title="Lista"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button></div>';
  html += '<button class="btn-primary" data-action="open-create-doc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Novo Documento</button>';
  html += '</div></div>';

  // Status filter chips
  var filters = ['Todos', 'Prontos', 'Em edição', 'Anulados', 'Encerrados'];
  html += '<div class="filters-bar"><div class="filter-chips" id="doc-filter-chips">';
  filters.forEach(function (f) { html += '<button class="filter-chip ' + (state.documents.filter === f ? 'active' : '') + '" data-filter="' + f + '">' + f + '</button>'; });
  html += '</div>';
  html += '<button class="btn-text filter-advanced-btn" data-action="toggle-doc-advanced"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg> Filtros avançados</button></div>';

  // Advanced filters
  html += '<div id="doc-advanced-filters" class="advanced-filters hidden"><div class="filters-grid">';
  html += '<div class="filter-field"><label>Tipo de Documento</label><select id="adv-doc-type"><option value="">Todos</option><option>Correspondência Recebida</option><option>Correspondência Expedida</option><option>Documento Interno</option><option>Contrato</option><option>Ata</option><option>Memorando</option></select></div>';
  html += '<div class="filter-field"><label>Entidade</label><input type="text" id="adv-doc-entity" placeholder="Pesquisar entidade..."></div>';
  html += '</div><div class="filters-actions"><button class="btn-primary" style="padding:8px 18px;font-size:13px" data-action="apply-doc-advanced">Pesquisar</button><button class="btn-text" data-action="clear-doc-advanced">Limpar filtros</button></div></div>';

  // Quick filters
  html += renderDocQuickFilters();

  if (state.documents.view === 'table') {
    html += '<div id="doc-grid-container" class="ag-theme-alpine edoc-ag-grid"></div>';
  } else {
    html += '<div class="results-info"><span>A mostrar ' + total + ' documentos</span>';
    html += '<select class="sort-select" id="doc-sort-select"><option value="recent"' + (state.documents.sort === 'recent' ? ' selected' : '') + '>Mais recentes</option><option value="oldest"' + (state.documents.sort === 'oldest' ? ' selected' : '') + '>Mais antigos</option><option value="az"' + (state.documents.sort === 'az' ? ' selected' : '') + '>A-Z</option><option value="za"' + (state.documents.sort === 'za' ? ' selected' : '') + '>Z-A</option></select></div>';
    html += '<div class="doc-list">';
    docs.forEach(function (d) { html += renderDocCard(d); });
    html += '</div>';
  }

  page.innerHTML = html;

  if (state.documents.view === 'table') {
    setTimeout(function() { createDocGrid('doc-grid-container', docs); }, 0);
  }
}

function renderDocCard(doc) {
  var fileType = doc.files.length > 0 ? getFileExt(doc.files[0].name) : 'pdf';
  var fileThumb = getFileThumbClass(fileType);
  var folder = store.folders.find(function (f) { return f.id === doc.folderId; });

  var html = '<div class="doc-card" data-doc-id="' + doc.id + '" data-action="view-doc">';
  html += '<div class="doc-type-indicator ' + getDocTypeIndicatorClass(doc.type) + '"></div>';
  html += '<div class="doc-info"><div class="doc-title-row"><span class="doc-title">' + doc.title + '</span><span class="doc-status ' + getDocStatusClass(doc.status) + '">' + doc.status + '</span></div>';
  html += '<div class="doc-meta"><span class="doc-type-label">' + doc.type + '</span><span class="doc-separator">·</span><span>' + doc.ref + '</span><span class="doc-separator">·</span><span>' + doc.files.length + ' ficheiro' + (doc.files.length !== 1 ? 's' : '') + '</span>';
  if (folder) html += '<span class="doc-separator">·</span><span data-preview-type="folder" data-preview-id="' + folder.id + '">Pasta: ' + folder.name + '</span>';
  html += '</div>';
  html += '<div class="doc-bottom-row"><span>' + formatDateShort(doc.date) + '</span>';
  if (doc.entityName) html += '<span>Entidade: ' + doc.entityName + '</span>';
  else if (doc.classificationPath) html += '<span class="classification-badge">' + doc.classificationPath + '</span>';
  html += '</div></div>';
  html += '<div class="doc-file-preview"><div class="file-thumb ' + fileThumb + '">' + fileType.toUpperCase() + '</div></div>';
  html += '</div>';
  return html;
}

function renderFlows() {
  var page = document.getElementById('page-flows');
  if (!page) return;

  var flows = store.flows.slice();

  if (state.flows.filter !== 'Todos') {
    var filterMap = { 'Pendentes': 'Pendente', 'Terminados': 'Terminado', 'Suspensos': 'Suspenso', 'Indeferidos': 'Indeferido' };
    var statusFilter = filterMap[state.flows.filter] || state.flows.filter;
    flows = flows.filter(function (f) { return f.status === statusFilter; });
  }

  // Quick filters
  flows = applyFlowQuickFilters(flows);

  if (state.flows.view === 'list') {
    if (state.flows.sort === 'recent') flows.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    else if (state.flows.sort === 'deadline') flows.sort(function (a, b) { return daysUntilDeadline(a.deadline) - daysUntilDeadline(b.deadline); });
    else if (state.flows.sort === 'az') flows.sort(function (a, b) { return a.title.localeCompare(b.title); });
  }

  var total = flows.length;
  var html = '';
  html += '<div class="page-header-bar"><div class="page-header-left"><h1 class="page-title">Fluxos</h1><span class="page-count">' + total + ' fluxo' + (total !== 1 ? 's' : '') + '</span></div>';
  html += '<div class="page-header-right">';
  html += '<div class="view-toggle"><button class="view-btn ' + (state.flows.view === 'table' ? 'active' : '') + '" data-view="table" data-entity="flows" title="Tabela"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg></button><button class="view-btn ' + (state.flows.view === 'list' ? 'active' : '') + '" data-view="list" data-entity="flows" title="Timeline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg></button></div>';
  html += '<button class="btn-primary" data-action="open-create-flow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Novo Fluxo</button>';
  html += '</div></div>';

  var filtersList = ['Pendentes', 'Terminados', 'Suspensos', 'Indeferidos', 'Todos'];
  html += '<div class="filters-bar"><div class="filter-chips" id="flow-filter-chips">';
  filtersList.forEach(function (f) { html += '<button class="filter-chip ' + (state.flows.filter === f ? 'active' : '') + '" data-filter="' + f + '">' + f + '</button>'; });
  html += '</div>';
  html += '<button class="btn-text" data-action="toggle-flow-advanced"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg> Filtros avançados</button></div>';

  html += '<div id="flow-advanced-filters" class="advanced-filters hidden"><div class="filters-grid"><div class="filter-field"><label>Tipo de Fluxo</label><select id="adv-flow-type"><option value="">Todos</option><option>Aprovação</option><option>Parecer</option><option>Distribuição</option><option>Difusão</option><option>Assinatura</option></select></div><div class="filter-field"><label>Assunto</label><input type="text" id="adv-flow-subject" placeholder="Pesquisar por assunto..."></div></div><div class="filters-actions"><button class="btn-primary" style="padding:8px 18px;font-size:13px" data-action="apply-flow-advanced">Pesquisar</button><button class="btn-text" data-action="clear-flow-advanced">Limpar</button></div></div>';

  // Quick filters
  html += renderFlowQuickFilters();

  if (state.flows.view === 'table') {
    html += '<div id="flow-grid-container" class="ag-theme-alpine edoc-ag-grid"></div>';
  } else {
    html += '<div class="results-info"><span>A mostrar ' + total + ' fluxos</span><select class="sort-select" id="flow-sort-select"><option value="recent"' + (state.flows.sort === 'recent' ? ' selected' : '') + '>Mais recentes</option><option value="deadline"' + (state.flows.sort === 'deadline' ? ' selected' : '') + '>Prazo mais próximo</option><option value="az"' + (state.flows.sort === 'az' ? ' selected' : '') + '>A-Z</option></select></div>';
    html += '<div class="flow-list">';
    flows.forEach(function (f) { html += renderFlowCard(f); });
    html += '</div>';
  }

  page.innerHTML = html;

  if (state.flows.view === 'table') {
    setTimeout(function() { createFlowGrid('flow-grid-container', flows); }, 0);
  }
}

function renderFlowCard(flow) {
  var folder = store.folders.find(function (ff) { return ff.id === flow.folderId; });
  var isPending = flow.status === 'Pendente';
  var currentStage = flow.stages.find(function (s) { return s.status === 'current'; });
  var isMyTask = currentStage && currentStage.userId === 1;

  var hasParallel = flow.stages.some(function(s) { return s.parallelGroup; });
  var timelineHtml = '';
  if (hasParallel) {
    timelineHtml = renderTimelineWithParallel(flow);
  } else {
    flow.stages.forEach(function (s, i) {
      var user = s.userId ? getUser(s.userId) : { name: '—', initials: '—' };
      var shortName = getUserShortName(user);
      timelineHtml += '<div class="timeline-step ' + s.status + '"><div class="timeline-dot ' + (s.status === 'current' ? 'pulse' : '') + '"></div><div class="timeline-label">' + s.name + '</div><div class="timeline-user">' + (s.userId ? shortName : '—') + '</div></div>';
      if (i < flow.stages.length - 1) {
        var nextStatus = flow.stages[i + 1].status;
        var connClass = '';
        if (s.status === 'completed' && nextStatus === 'completed') connClass = 'completed';
        else if (s.status === 'completed' && nextStatus === 'current') connClass = 'active';
        timelineHtml += '<div class="timeline-connector ' + connClass + '"></div>';
      }
    });
  }

  var actionButtons = '';
  if (isPending && isMyTask) {
    if (flow.type === 'Aprovação') actionButtons = '<button class="btn-action btn-approve" data-flow-id="' + flow.id + '" data-action="approve">Aprovar</button><button class="btn-action btn-reject" data-flow-id="' + flow.id + '" data-action="reject">Rejeitar</button><button class="btn-action btn-return" data-flow-id="' + flow.id + '" data-action="return">Devolver</button>';
    else if (flow.type === 'Parecer') actionButtons = '<button class="btn-action btn-send" data-flow-id="' + flow.id + '" data-action="approve">Enviar Parecer</button><button class="btn-action btn-return" data-flow-id="' + flow.id + '" data-action="return">Devolver</button>';
    else if (flow.type === 'Assinatura') actionButtons = '<button class="btn-action btn-sign" data-flow-id="' + flow.id + '" data-action="approve">Assinar</button><button class="btn-action btn-return" data-flow-id="' + flow.id + '" data-action="return">Devolver</button>';
    else actionButtons = '<button class="btn-action btn-send" data-flow-id="' + flow.id + '" data-action="approve">Enviar</button><button class="btn-action btn-return" data-flow-id="' + flow.id + '" data-action="return">Devolver</button>';
    actionButtons += '<button class="btn-action btn-view" data-flow-id="' + flow.id + '" data-action="view-flow">Ver Detalhe</button>';
  }

  var html = '<div class="flow-card" data-flow-id="' + flow.id + '" data-action="view-flow-card">';
  html += '<div class="flow-status-bar ' + getFlowStatusBarClass(flow.status) + '"></div>';
  html += '<div class="flow-header"><div class="flow-title-area"><span class="flow-title">' + flow.title + '</span><span class="flow-badge ' + getFlowBadgeClass(flow.status) + '">' + flow.status + '</span></div><span class="flow-ref">' + flow.ref + '</span></div>';
  html += '<div class="flow-meta"><span>Tipo: ' + flow.type + '</span><span class="doc-separator">·</span>';
  if (folder) html += '<span data-preview-type="folder" data-preview-id="' + folder.id + '">Pasta: ' + folder.name + '</span><span class="doc-separator">·</span>';
  html += '<span>' + (flow.status === 'Terminado' ? 'Concluído' : 'Criado') + ': ' + formatDateShort(flow.date) + '</span></div>';
  html += '<div class="flow-timeline">' + timelineHtml + '</div>';
  if (actionButtons) html += '<div class="flow-actions-bar">' + actionButtons + '</div>';
  html += '</div>';
  return html;
}

function renderFolders() {
  var page = document.getElementById('page-folders');
  if (!page) return;

  var currentId = state.folders.currentId;
  var subfolders = getSubfolders(currentId);
  var docs = currentId ? getDocsByFolder(currentId) : [];
  var flows = currentId ? getFlowsByFolder(currentId) : [];
  var breadcrumb = currentId ? buildBreadcrumb(currentId) : [];

  var html = '';
  html += '<div class="page-header-bar"><div class="page-header-left"><h1 class="page-title">Pastas</h1></div><div class="page-header-right"><button class="btn-primary" data-action="open-create-folder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Nova Pasta</button></div></div>';

  html += '<div class="breadcrumb"><a href="#" class="breadcrumb-item" data-folder-id="null">Raiz</a>';
  breadcrumb.forEach(function (c, i) {
    if (i === breadcrumb.length - 1) html += '<span class="breadcrumb-sep">/</span><span class="breadcrumb-current" data-preview-type="folder" data-preview-id="' + c.id + '">' + c.name + '</span>';
    else html += '<span class="breadcrumb-sep">/</span><a href="#" class="breadcrumb-item" data-folder-id="' + c.id + '" data-preview-type="folder" data-preview-id="' + c.id + '">' + c.name + '</a>';
  });
  html += '</div>';

  html += '<div class="folder-section"><h3 class="folder-section-title">Subpastas</h3>';
  if (subfolders.length > 0) {
    html += '<div class="folder-grid">';
    subfolders.forEach(function (f) {
      var docCount = getDocsByFolder(f.id).length;
      var flowCount = getFlowsByFolder(f.id).length;
      var terminated = f.status === 'Terminada';
      var statusColor = f.status === 'Aberta' ? 'var(--success)' : f.status === 'Suspensa' ? 'var(--orange-500)' : 'var(--gray-500)';
      html += '<div class="folder-card" data-folder-id="' + f.id + '" data-action="open-folder"><div class="folder-icon-large ' + (terminated ? 'terminated' : '') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg></div><div class="folder-card-name">' + f.name + '</div><div class="folder-card-meta">' + docCount + ' doc' + (docCount !== 1 ? 's' : '') + ' · ' + flowCount + ' fluxo' + (flowCount !== 1 ? 's' : '') + ' · <span style="color:' + statusColor + '">' + f.status + '</span></div></div>';
    });
    html += '</div>';
  } else html += '<p style="color:var(--gray-400);font-size:14px">Sem subpastas</p>';
  html += '</div>';

  if (currentId) {
    html += '<div class="folder-section"><h3 class="folder-section-title">Documentos nesta pasta</h3>';
    if (docs.length > 0) {
      html += '<div class="doc-list">';
      docs.forEach(function (d) {
        var ft = d.files.length > 0 ? getFileExt(d.files[0].name) : 'pdf';
        html += '<div class="doc-card compact" data-doc-id="' + d.id + '" data-action="view-doc"><div class="doc-type-indicator ' + getDocTypeIndicatorClass(d.type) + '"></div><div class="doc-info"><div class="doc-title-row"><span class="doc-title">' + d.title + '</span><span class="doc-status ' + getDocStatusClass(d.status) + '">' + d.status + '</span></div><div class="doc-meta"><span>' + d.ref + '</span><span class="doc-separator">·</span><span>' + d.files.length + ' ficheiro' + (d.files.length !== 1 ? 's' : '') + '</span><span class="doc-separator">·</span><span>' + formatDateShort(d.date) + '</span></div></div><div class="doc-file-preview"><div class="file-thumb ' + getFileThumbClass(ft) + '">' + ft.toUpperCase() + '</div></div></div>';
      });
      html += '</div>';
    } else html += '<p style="color:var(--gray-400);font-size:14px">Sem documentos</p>';
    html += '</div>';

    html += '<div class="folder-section"><h3 class="folder-section-title">Fluxos nesta pasta</h3>';
    if (flows.length > 0) {
      html += '<div class="flow-list">';
      flows.forEach(function (f) {
        var cIdx = f.stages.findIndex(function (s) { return s.status === 'current'; });
        html += '<div class="flow-card-compact" data-flow-id="' + f.id + '"><div class="flow-status-dot ' + (f.status === 'Pendente' ? 'pending' : f.status === 'Terminado' ? 'completed' : 'suspended') + '"></div><div class="flow-compact-info"><span class="flow-compact-title">' + f.title + '</span><span class="flow-compact-ref">' + f.ref + ' · Etapa ' + ((cIdx >= 0 ? cIdx + 1 : f.stages.length)) + '/' + f.stages.length + ' · ' + f.status + '</span></div><button class="btn-action btn-view" data-flow-id="' + f.id + '" data-action="view-flow">Ver</button></div>';
      });
      html += '</div>';
    } else html += '<p style="color:var(--gray-400);font-size:14px">Sem fluxos</p>';
    html += '</div>';
  }
  page.innerHTML = html;
}

function renderDashboard() {
  var page = document.getElementById('page-dashboard');
  if (!page) return;

  var totalDocs = store.documents.length;
  var totalFlows = store.flows.filter(function (f) { return f.status === 'Pendente'; }).length;
  var totalFolders = store.folders.filter(function (f) { return f.status === 'Aberta'; }).length;
  var pendingTasks = getPendingTasks();

  var typeCount = {};
  store.documents.forEach(function (d) { typeCount[d.type] = (typeCount[d.type] || 0) + 1; });

  var html = '<div class="page-header-bar"><div class="page-header-left"><h1 class="page-title">Dashboard</h1><select class="dashboard-select"><option>Painel Principal</option><option>Indicadores Financeiros</option><option>Contratos</option></select></div><div class="page-header-right"><button class="btn-outline">Editar Painel</button></div></div>';
  html += '<div class="dashboard-grid">';
  html += '<div class="widget widget-large"><div class="widget-header"><h3 class="widget-title">Documentos por Tipo</h3></div><div class="widget-body"><div class="chart-placeholder"><div class="donut-chart"><div class="donut-center"><div class="donut-total">' + totalDocs + '</div><div class="donut-label">Total</div></div></div><div class="chart-legend">';
  var colors = ['#0ABAB5', '#F5A623', '#8B5CF6', '#10B981', '#EC4899', '#6366F1'];
  var idx = 0;
  for (var type in typeCount) {
    var pct = Math.round(typeCount[type] / totalDocs * 100);
    html += '<div class="legend-item"><span class="legend-dot" style="background:' + colors[idx % colors.length] + '"></span>' + type + ' (' + pct + '%)</div>';
    idx++;
  }
  html += '</div></div></div></div>';
  html += '<div class="widget widget-counter" style="--counter-color:#0ABAB5"><div class="widget-counter-number">' + totalDocs + '</div><div class="widget-counter-label">Documentos</div><div class="widget-counter-trend">Total registado</div></div>';
  html += '<div class="widget widget-counter" style="--counter-color:#F5A623"><div class="widget-counter-number">' + totalFlows + '</div><div class="widget-counter-label">Fluxos Ativos</div><div class="widget-counter-trend">' + pendingTasks.length + ' pendentes p/ si</div></div>';
  html += '<div class="widget widget-counter" style="--counter-color:#8B5CF6"><div class="widget-counter-number">' + totalFolders + '</div><div class="widget-counter-label">Pastas Abertas</div><div class="widget-counter-trend">Em utilização</div></div>';
  html += '<div class="widget widget-counter" style="--counter-color:#10B981"><div class="widget-counter-number">98%</div><div class="widget-counter-label">SLA Cumprido</div><div class="widget-counter-trend">Excelente!</div></div>';
  html += '<div class="widget widget-large"><div class="widget-header"><h3 class="widget-title">Fluxos por Mês</h3></div><div class="widget-body"><div class="bar-chart"><div class="bar-group"><div class="bar" style="height:40%"><span class="bar-value">18</span></div><div class="bar-label">Out</div></div><div class="bar-group"><div class="bar" style="height:55%"><span class="bar-value">24</span></div><div class="bar-label">Nov</div></div><div class="bar-group"><div class="bar" style="height:70%"><span class="bar-value">31</span></div><div class="bar-label">Dez</div></div><div class="bar-group"><div class="bar" style="height:50%"><span class="bar-value">22</span></div><div class="bar-label">Jan</div></div><div class="bar-group"><div class="bar" style="height:85%"><span class="bar-value">38</span></div><div class="bar-label">Fev</div></div><div class="bar-group"><div class="bar highlight" style="height:95%"><span class="bar-value">' + store.flows.length + '</span></div><div class="bar-label">Mar</div></div></div></div></div>';
  html += '<div class="widget widget-medium"><div class="widget-header"><h3 class="widget-title">Tarefas Pendentes</h3><span class="widget-badge">' + pendingTasks.length + '</span></div><div class="widget-body widget-list">';
  pendingTasks.forEach(function (f) {
    var days = daysUntilDeadline(f.deadline);
    var dotClass = 'normal', dateLabel = days + ' dias';
    if (days <= 1) { dotClass = 'urgent'; dateLabel = 'Amanhã'; }
    else if (days <= 3) { dotClass = 'warning'; dateLabel = days + ' dias'; }
    html += '<div class="widget-list-item"><span class="widget-list-dot ' + dotClass + '"></span><span>' + (f.title.length > 30 ? f.title.substring(0, 30) + '...' : f.title) + '</span><span class="widget-list-date">' + dateLabel + '</span></div>';
  });
  html += '</div></div></div>';
  page.innerHTML = html;
}

function renderSearch(query, type) {
  var page = document.getElementById('page-search');
  if (!page) return;

  var results = query ? searchAll(query) : { documents: [], folders: [], flows: [] };
  var hasResults = results.documents.length + results.folders.length + results.flows.length > 0;
  var filteredType = type || state.search.type;

  var html = '<div class="search-page-container"><h1 class="page-title">Pesquisa</h1>';
  html += '<div class="search-full"><svg class="search-full-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" class="search-full-input" id="search-page-input" placeholder="Pesquisar em documentos, pastas e fluxos..." value="' + (query || '') + '"></div>';

  var tabs = [{ key: 'all', label: 'Tudo' }, { key: 'documents', label: 'Documentos' }, { key: 'folders', label: 'Pastas' }, { key: 'flows', label: 'Fluxos' }];
  html += '<div class="search-type-tabs">';
  tabs.forEach(function (t) { html += '<button class="search-type-tab ' + (filteredType === t.key ? 'active' : '') + '" data-search-type="' + t.key + '">' + t.label + '</button>'; });
  html += '</div>';

  if (query && hasResults) {
    // Quick filter chips for search results
    html += '<div class="quick-filters-bar">';
    store.savedSearches.forEach(function(s) {
      html += '<button class="quick-filter" data-saved-query="' + s.query + '"><span class="qf-icon">&#128269;</span> ' + s.label + '</button>';
    });
    tabs.forEach(function(t) {
      if (t.key !== 'all') {
        var count = results[t.key] ? results[t.key].length : 0;
        html += '<button class="quick-filter ' + (filteredType === t.key ? 'active' : '') + '" data-search-type="' + t.key + '"><span class="qf-icon">&#128196;</span> ' + t.label + ' (' + count + ')</button>';
      }
    });
    html += '</div>';
  }

  if (!query) {
    html += '<div class="search-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" width="80" height="80" style="opacity:0.3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>Pesquise por palavras-chave, referências ou conteúdo de ficheiros</p>';
    html += '<div class="search-suggestions"><h4>Pesquisas guardadas</h4><div class="saved-search-chips">';
    store.savedSearches.forEach(function (s) { html += '<button class="saved-search-chip" data-saved-query="' + s.query + '">' + s.label + '</button>'; });
    html += '</div></div></div>';
  } else if (!hasResults) {
    html += '<div class="search-empty-state"><p>Sem resultados para "<strong>' + query + '</strong>"</p></div>';
  } else {
    html += '<div class="search-results">';
    if ((filteredType === 'all' || filteredType === 'documents') && results.documents.length > 0) {
      html += '<div class="search-result-group"><h3 class="folder-section-title">Documentos (' + results.documents.length + ')</h3>';
      results.documents.forEach(function (d) {
        html += '<div class="search-result-card" data-doc-id="' + d.id + '" data-action="view-doc"><div class="doc-type-indicator ' + getDocTypeIndicatorClass(d.type) + '"></div><div class="doc-info"><div class="doc-title-row"><span class="doc-title">' + d.title + '</span><span class="doc-status ' + getDocStatusClass(d.status) + '">' + d.status + '</span></div><div class="doc-meta"><span>' + d.type + '</span><span class="doc-separator">·</span><span>' + d.ref + '</span><span class="doc-separator">·</span><span>' + formatDateShort(d.date) + '</span></div></div></div>';
      });
      html += '</div>';
    }
    if ((filteredType === 'all' || filteredType === 'folders') && results.folders.length > 0) {
      html += '<div class="search-result-group"><h3 class="folder-section-title">Pastas (' + results.folders.length + ')</h3>';
      results.folders.forEach(function (f) {
        html += '<div class="search-result-card" data-folder-id="' + f.id + '" data-action="open-folder-from-search"><div class="folder-icon-large" style="margin-bottom:0;width:40px;height:40px;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg></div><div class="doc-info"><div class="doc-title-row"><span class="doc-title">' + f.name + '</span></div><div class="doc-meta"><span>' + getDocsByFolder(f.id).length + ' documentos</span><span class="doc-separator">·</span><span>' + getFlowsByFolder(f.id).length + ' fluxos</span></div></div></div>';
      });
      html += '</div>';
    }
    if ((filteredType === 'all' || filteredType === 'flows') && results.flows.length > 0) {
      html += '<div class="search-result-group"><h3 class="folder-section-title">Fluxos (' + results.flows.length + ')</h3>';
      results.flows.forEach(function (f) {
        html += '<div class="search-result-card" data-flow-id="' + f.id + '" data-action="view-flow"><div style="width:12px;height:12px;border-radius:50%;flex-shrink:0;margin-top:4px;background:' + (f.status === 'Pendente' ? 'var(--teal-500)' : f.status === 'Terminado' ? 'var(--success)' : 'var(--orange-500)') + '"></div><div class="doc-info"><div class="doc-title-row"><span class="doc-title">' + f.title + '</span><span class="flow-badge ' + getFlowBadgeClass(f.status) + '">' + f.status + '</span></div><div class="doc-meta"><span>' + f.type + '</span><span class="doc-separator">·</span><span>' + f.ref + '</span><span class="doc-separator">·</span><span>' + formatDateShort(f.date) + '</span></div></div></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  }
  html += '</div>';
  page.innerHTML = html;
}

// ==================== DETAIL PAGES ====================

function renderDocDetailPage() {
  var page = document.getElementById('page-doc-detail');
  if (!page) return;
  var doc = store.documents.find(function (d) { return d.id === state.docDetailId; });
  if (!doc) { navigateTo('documents'); return; }

  var folder = store.folders.find(function (f) { return f.id === doc.folderId; });
  var folderPath = doc.folderId ? buildBreadcrumb(doc.folderId).map(function (c) { return c.name; }).join(' / ') : '';
  var activeTab = state.docDetailTab || 'dados';

  var html = '';
  // Breadcrumb
  html += '<div class="breadcrumb"><a href="#" class="breadcrumb-item" data-action="go-documents">Documentos</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">' + doc.ref + '</span></div>';

  // Header
  html += '<div class="detail-page-header">';
  html += '<div class="detail-page-header-top"><span class="doc-status ' + getDocStatusClass(doc.status) + '">' + doc.status + '</span>';
  html += '<div class="detail-page-actions"><button class="btn-outline" data-action="edit-doc">Editar</button><button class="btn-outline" data-action="share-doc">Partilhar</button><button class="btn-primary" data-action="create-flow-from-doc">Criar Fluxo</button></div></div>';
  html += '<h1 class="detail-page-title">' + doc.title + '</h1>';
  html += '<p class="detail-page-subtitle">' + doc.ref + ' · ' + doc.type + ' · ' + formatDateShort(doc.date) + '</p>';
  html += '</div>';

  // Tabs
  var docTabs = [
    { key: 'dados', label: 'Dados' },
    { key: 'ficheiros', label: 'Ficheiros (' + doc.files.length + ')' },
    { key: 'campos', label: 'Campos' },
    { key: 'acessos', label: 'Acessos' },
    { key: 'historico', label: 'Histórico' }
  ];
  html += '<div class="detail-page-tabs">';
  docTabs.forEach(function(t) { html += '<button class="detail-tab ' + (activeTab === t.key ? 'active' : '') + '" data-detail-tab="' + t.key + '" data-detail-type="doc">' + t.label + '</button>'; });
  html += '</div>';

  // Tab content
  html += '<div class="detail-page-body">';
  if (activeTab === 'dados') {
    html += '<div class="detail-section"><h4 class="detail-section-title">Informação Geral</h4>';
    html += '<div class="detail-fields-grid">';
    html += '<div class="panel-field"><span class="panel-field-label">Tipo de Documento</span><span class="panel-field-value">' + doc.type + '</span></div>';
    html += '<div class="panel-field"><span class="panel-field-label">Data de Registo</span><span class="panel-field-value">' + formatDate(doc.date) + '</span></div>';
    html += '<div class="panel-field"><span class="panel-field-label">Referência</span><span class="panel-field-value">' + doc.ref + '</span></div>';
    html += '<div class="panel-field"><span class="panel-field-label">Assunto</span><span class="panel-field-value">' + doc.title + '</span></div>';
    html += '</div></div>';
    if (doc.entityName) {
      var initials = doc.entityName.split(' ').filter(function (w) { return w.length > 2; }).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
      html += '<div class="detail-section"><h4 class="detail-section-title">Entidade</h4><div class="entity-card-inline"><div class="entity-avatar">' + initials + '</div><div><div class="entity-name">' + doc.entityName + '</div><div class="entity-type">Entidade Principal</div></div></div></div>';
    }
    if (doc.classificationPath) {
      html += '<div class="detail-section"><h4 class="detail-section-title">Classificação</h4><div class="classification-path">';
      doc.classificationPath.split(' > ').forEach(function (p, i, arr) {
        html += '<span class="classification-badge ' + (i === arr.length - 1 ? 'active' : '') + '">' + p + '</span>';
        if (i < arr.length - 1) html += '<span class="classification-arrow">&rarr;</span>';
      });
      html += '</div></div>';
    }
    if (folderPath) html += '<div class="detail-section"><h4 class="detail-section-title">Pasta</h4><a href="#" class="folder-link-inline" data-folder-id="' + doc.folderId + '" data-preview-type="folder" data-preview-id="' + doc.folderId + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> ' + folderPath + '</a></div>';
  } else if (activeTab === 'ficheiros') {
    html += '<div class="detail-section"><h4 class="detail-section-title">Ficheiros (' + doc.files.length + ')</h4><div class="file-list-panel">';
    doc.files.forEach(function (f, fIdx) {
      html += '<div class="file-item"><div class="file-thumb-sm ' + getFileThumbClass(f.type) + '">' + (f.type || getFileExt(f.name)).toUpperCase() + '</div><div class="file-info"><div class="file-name">' + f.name + '</div><div class="file-size">' + f.size + '</div></div><div class="file-actions"><button class="btn-icon" title="Descarregar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button><button class="file-item-preview-btn" data-action="open-file-viewer" data-doc-id="' + doc.id + '" data-file-idx="' + fIdx + '" title="Ver ficheiro">Ver</button></div></div>';
    });
    html += '</div></div>';
  } else if (activeTab === 'campos') {
    var fieldLabels = { entryNumber: 'N.º de Entrada', department: 'Departamento', value: 'Valor', confidential: 'Confidencial', receptionDate: 'Data de Receção', internalNotes: 'Notas internas', contractNumber: 'N.º de Contrato', startDate: 'Data de Início', endDate: 'Data de Fim', meetingDate: 'Data da Reunião', participants: 'Participantes', approvedBy: 'Aprovado por', outgoingNumber: 'N.º de Saída', registeredMail: 'Registo Postal', targetAudience: 'Público-alvo', period: 'Período', urgent: 'Urgente', reason: 'Motivo' };
    html += '<div class="detail-section"><h4 class="detail-section-title">Campos Adicionais</h4><div class="detail-fields-grid">';
    var fields = doc.additionalFields || {};
    var keys = Object.keys(fields);
    if (keys.length > 0) keys.forEach(function (key) { html += '<div class="panel-field"><span class="panel-field-label">' + (fieldLabels[key] || key) + '</span><span class="panel-field-value">' + fields[key] + '</span></div>'; });
    else html += '<p style="color:var(--gray-400);font-size:13px">Sem campos adicionais</p>';
    html += '</div></div>';
  } else if (activeTab === 'acessos') {
    html += '<div class="detail-section"><h4 class="detail-section-title">Acessos</h4><div class="access-list">';
    html += '<div class="access-item"><div class="access-avatar" style="background:' + getUser(1).gradient + '">' + getUser(1).initials + '</div><div class="access-info"><div class="access-name">' + getUser(1).name + '</div><div class="access-role">Acesso Total</div></div><span class="access-badge full">Total</span></div>';
    html += '<div class="access-item"><div class="access-avatar" style="background:linear-gradient(135deg,#8B5CF6,#6D28D9)">DF</div><div class="access-info"><div class="access-name">Dept. Financeiro</div><div class="access-role">Grupo · Escrita</div></div><span class="access-badge write">Escrita</span></div>';
    html += '<div class="access-item"><div class="access-avatar" style="background:linear-gradient(135deg,#F5A623,#D97706)">DA</div><div class="access-info"><div class="access-name">Dept. Administração</div><div class="access-role">Grupo · Leitura</div></div><span class="access-badge read">Leitura</span></div>';
    html += '</div></div>';
  } else if (activeTab === 'historico') {
    html += '<div class="detail-section"><h4 class="detail-section-title">Histórico de Alterações</h4><div class="history-list">';
    html += '<div class="history-item"><div class="history-dot" style="background:var(--success)"></div><div class="history-content"><strong>Documento marcado como ' + doc.status + '</strong><div class="history-meta">' + getUser(1).name + ' · ' + formatDate(doc.date) + '</div></div></div>';
    if (doc.classificationPath) html += '<div class="history-item"><div class="history-dot" style="background:var(--teal-500)"></div><div class="history-content"><strong>Classificação adicionada:</strong> ' + doc.classificationPath + '<div class="history-meta">' + getUser(1).name + ' · ' + formatDate(doc.date) + '</div></div></div>';
    if (doc.entityName) html += '<div class="history-item"><div class="history-dot" style="background:var(--orange-400)"></div><div class="history-content"><strong>Entidade associada:</strong> ' + doc.entityName + '<div class="history-meta">' + getUser(1).name + ' · ' + formatDate(doc.date) + '</div></div></div>';
    html += '<div class="history-item"><div class="history-dot" style="background:var(--purple)"></div><div class="history-content"><strong>Documento criado</strong><div class="history-meta">' + getUser(1).name + ' · ' + formatDate(doc.date) + '</div></div></div>';
    html += '</div></div>';
  }
  html += '</div>';
  page.innerHTML = html;
}

function renderFlowDetailPage() {
  var page = document.getElementById('page-flow-detail');
  if (!page) return;
  var flow = store.flows.find(function (f) { return f.id === state.flowDetailId; });
  if (!flow) { navigateTo('flows'); return; }

  var folder = store.folders.find(function (f) { return f.id === flow.folderId; });
  var folderPath = flow.folderId ? buildBreadcrumb(flow.folderId).map(function (c) { return c.name; }).join(' / ') : '';
  var activeTab = state.flowDetailTab || 'etapas';

  var html = '';
  html += '<div class="breadcrumb"><a href="#" class="breadcrumb-item" data-action="go-flows">Fluxos</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">' + flow.ref + '</span></div>';

  html += '<div class="detail-page-header"><div class="detail-page-header-top"><span class="flow-badge ' + getFlowBadgeClass(flow.status) + '">' + flow.status + '</span><div class="detail-page-actions">';
  var isPending = flow.status === 'Pendente';
  var currentStage = flow.stages.find(function(s) { return s.status === 'current'; });
  var isMyTask = currentStage && currentStage.userId === 1;
  if (isPending && isMyTask) {
    if (flow.type === 'Aprovação') html += '<button class="btn-action btn-approve" data-flow-id="' + flow.id + '" data-action="approve">Aprovar</button><button class="btn-action btn-reject" data-flow-id="' + flow.id + '" data-action="reject">Rejeitar</button>';
    else if (flow.type === 'Parecer') html += '<button class="btn-action btn-send" data-flow-id="' + flow.id + '" data-action="approve">Enviar Parecer</button>';
    else if (flow.type === 'Assinatura') html += '<button class="btn-action btn-sign" data-flow-id="' + flow.id + '" data-action="approve">Assinar</button>';
    else html += '<button class="btn-action btn-send" data-flow-id="' + flow.id + '" data-action="approve">Enviar</button>';
    html += '<button class="btn-action btn-return" data-flow-id="' + flow.id + '" data-action="return">Devolver</button>';
  }
  html += '</div></div>';
  html += '<h1 class="detail-page-title">' + flow.title + '</h1>';
  html += '<p class="detail-page-subtitle">' + flow.ref + ' · ' + flow.type + ' · ' + formatDateShort(flow.date) + '</p></div>';

  var allFiles = [];
  flow.stages.forEach(function(s) { if (s.files) s.files.forEach(function(f) { allFiles.push(f); }); });
  var relatedDoc = store.documents.find(function(d) { return d.folderId === flow.folderId && d.status !== 'Anulado'; });
  var flowFiles = relatedDoc ? relatedDoc.files : allFiles;

  var flowTabs = [
    { key: 'etapas', label: 'Etapas' },
    { key: 'documentos', label: 'Documentos (' + flowFiles.length + ')' },
    { key: 'dados', label: 'Dados' },
    { key: 'acessos', label: 'Acessos' }
  ];
  html += '<div class="detail-page-tabs">';
  flowTabs.forEach(function(t) { html += '<button class="detail-tab ' + (activeTab === t.key ? 'active' : '') + '" data-detail-tab="' + t.key + '" data-detail-type="flow">' + t.label + '</button>'; });
  html += '</div>';

  html += '<div class="detail-page-body">';
  if (activeTab === 'etapas') {
    html += '<div class="detail-section"><h4 class="detail-section-title">Percurso do Fluxo</h4><div class="stage-list">';
    var hasParallelStages = flow.stages.some(function(s) { return s.parallelGroup; });
    var stageGroups = hasParallelStages ? groupStagesByParallel(flow.stages) : null;

    function renderSingleStageDetail(s, i, flowObj) {
      var user = s.userId ? getUser(s.userId) : { name: 'Sistema', initials: 'SIS', gradient: 'linear-gradient(135deg,#94A3B8,#64748B)' };
      var isMyCurrentTask = s.status === 'current' && s.userId === 1;
      var stHtml = '<div class="stage-item ' + s.status + '">';
      stHtml += '<div class="stage-number ' + (s.status === 'current' ? 'pulse-ring' : '') + '">' + (i + 1) + '</div><div class="stage-info">';
      stHtml += '<div class="stage-name">' + s.name + (s.parallelGroup ? ' <span style="font-size:10px;color:var(--teal-400);font-weight:600">[Paralelo ' + s.parallelGroup + ']</span>' : '') + '</div>';
      stHtml += '<div class="stage-meta">' + user.name + ' · ' + (s.status === 'completed' ? 'Concluída a ' + (s.date ? s.date.split(' ')[0] : '') : s.status === 'current' ? 'Recebida a ' + (s.date ? s.date.split(' ')[0] : '') : 'Pendente') + '</div>';
      if (s.note) stHtml += '<div class="stage-note">' + s.note + '</div>';
      if (s.files && s.files.length > 0) {
        stHtml += '<div class="stage-files">';
        s.files.forEach(function(f) { stHtml += '<span class="stage-file"><span class="file-thumb-sm ' + getFileThumbClass(f.type) + '" style="width:24px;height:24px;font-size:8px">' + (f.type || 'PDF').toUpperCase() + '</span> ' + f.name + '</span>'; });
        stHtml += '</div>';
      }
      if (isMyCurrentTask) {
        stHtml += '<div class="stage-note-input"><textarea placeholder="Escrever nota ou parecer..." rows="3" id="flow-stage-note-' + flowObj.id + '"></textarea></div>';
        if (flowObj.deadline) {
          var deadlineDays = daysUntilDeadline(flowObj.deadline);
          stHtml += '<div class="stage-deadline-info">Prazo: <strong style="color:' + (deadlineDays <= 2 ? 'var(--error)' : 'var(--gray-700)') + '">' + formatDate(flowObj.deadline) + '</strong></div>';
        }
      }
      stHtml += '</div><span class="stage-status-badge ' + s.status + '">' + (s.status === 'completed' ? 'Concluída' : s.status === 'current' ? 'A tratar' : 'Pendente') + '</span></div>';
      return stHtml;
    }

    if (hasParallelStages && stageGroups) {
      stageGroups.forEach(function(g) {
        if (g.type === 'single') {
          // Insert button before this stage (if flow is Pendente)
          if (isPending) {
            if (state.stageInsertFlowId === flow.id && state.stageInsertFormIdx === g.originalIdx) {
              html += renderStageInsertForm(flow.id, g.originalIdx);
            } else {
              html += renderStageInsertBtn(flow.id, g.originalIdx);
            }
          }
          html += renderSingleStageDetail(g.stage, g.originalIdx, flow);
        } else {
          // Parallel group
          if (isPending) {
            if (state.stageInsertFlowId === flow.id && state.stageInsertFormIdx === g.startIdx) {
              html += renderStageInsertForm(flow.id, g.startIdx);
            } else {
              html += renderStageInsertBtn(flow.id, g.startIdx);
            }
          }
          html += '<div class="parallel-group-wrapper">';
          g.stages.forEach(function(ps) {
            html += renderSingleStageDetail(ps.stage, ps.originalIdx, flow);
          });
          html += '</div>';
        }
      });
      // Insert button at end
      if (isPending) {
        var lastIdx = flow.stages.length;
        if (state.stageInsertFlowId === flow.id && state.stageInsertFormIdx === lastIdx) {
          html += renderStageInsertForm(flow.id, lastIdx);
        } else {
          html += renderStageInsertBtn(flow.id, lastIdx);
        }
      }
    } else {
      flow.stages.forEach(function (s, i) {
        // Insert button before each stage (if flow is Pendente)
        if (isPending) {
          if (state.stageInsertFlowId === flow.id && state.stageInsertFormIdx === i) {
            html += renderStageInsertForm(flow.id, i);
          } else {
            html += renderStageInsertBtn(flow.id, i);
          }
        }
        html += renderSingleStageDetail(s, i, flow);
      });
      // Insert button at end
      if (isPending) {
        var lastInsertIdx = flow.stages.length;
        if (state.stageInsertFlowId === flow.id && state.stageInsertFormIdx === lastInsertIdx) {
          html += renderStageInsertForm(flow.id, lastInsertIdx);
        } else {
          html += renderStageInsertBtn(flow.id, lastInsertIdx);
        }
      }
    }
    html += '</div></div>';
  } else if (activeTab === 'documentos') {
    html += '<div class="detail-section"><h4 class="detail-section-title">Documentos do Fluxo</h4><div class="file-list-panel">';
    if (flowFiles.length > 0) {
      flowFiles.forEach(function(f) {
        html += '<div class="file-item"><div class="file-thumb-sm ' + getFileThumbClass(f.type) + '">' + (f.type || getFileExt(f.name)).toUpperCase() + '</div><div class="file-info"><div class="file-name">' + f.name + '</div><div class="file-size">' + f.size + '</div></div><div class="file-actions"><button class="btn-icon" title="Ver"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button></div></div>';
      });
    } else html += '<p style="color:var(--gray-400);font-size:13px">Sem documentos associados</p>';
    html += '</div></div>';
  } else if (activeTab === 'dados') {
    html += '<div class="detail-section"><h4 class="detail-section-title">Dados do Fluxo</h4><div class="detail-fields-grid">';
    html += '<div class="panel-field"><span class="panel-field-label">Assunto</span><span class="panel-field-value">' + flow.title + '</span></div>';
    html += '<div class="panel-field"><span class="panel-field-label">Tipo</span><span class="panel-field-value">' + flow.type + '</span></div>';
    html += '<div class="panel-field"><span class="panel-field-label">Referência</span><span class="panel-field-value">' + flow.ref + '</span></div>';
    html += '<div class="panel-field"><span class="panel-field-label">Data de Criação</span><span class="panel-field-value">' + formatDate(flow.date) + '</span></div>';
    if (flow.deadline) html += '<div class="panel-field"><span class="panel-field-label">Prazo</span><span class="panel-field-value">' + formatDate(flow.deadline) + '</span></div>';
    if (folderPath) html += '<div class="panel-field"><span class="panel-field-label">Pasta</span><a href="#" class="folder-link-inline" data-folder-id="' + flow.folderId + '" data-preview-type="folder" data-preview-id="' + flow.folderId + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> ' + folderPath + '</a></div>';
    html += '</div></div>';
  } else if (activeTab === 'acessos') {
    var seen = {}, participants = [];
    flow.stages.forEach(function(s) { if (s.userId && !seen[s.userId]) { seen[s.userId] = true; participants.push(s.userId); } });
    html += '<div class="detail-section"><h4 class="detail-section-title">Acessos ao Fluxo</h4><div class="access-list">';
    participants.forEach(function(uid) {
      var user = getUser(uid);
      html += '<div class="access-item"><div class="access-avatar" style="background:' + user.gradient + '">' + user.initials + '</div><div class="access-info"><div class="access-name">' + user.name + '</div><div class="access-role">Interveniente</div></div><span class="access-badge ' + (uid === 1 ? 'full' : 'write') + '">' + (uid === 1 ? 'Total' : 'Escrita') + '</span></div>';
    });
    html += '</div></div>';
  }
  html += '</div>';
  page.innerHTML = html;
}

function renderNotifications() {
  var panel = document.getElementById('notif-panel');
  if (!panel) return;
  var unread = store.notifications.filter(function (n) { return !n.read; }).length;
  var html = '<div class="notif-panel-header"><h3>Notificações</h3><span class="notif-panel-count">' + unread + ' por ler</span><button class="panel-close" data-action="close-notif">&times;</button></div>';
  html += '<div class="notif-panel-body">';
  store.notifications.forEach(function (n) {
    html += '<div class="notif-item ' + (n.read ? 'read' : '') + '" data-notif-id="' + n.id + '"><div class="notif-dot ' + (n.read ? '' : 'unread') + '"></div><div class="notif-content"><div class="notif-text">' + n.text + '</div><div class="notif-time">' + timeAgo(n.time) + '</div></div>';
    if (!n.read) html += '<button class="btn-icon notif-mark-read" data-notif-id="' + n.id + '" data-action="mark-read" title="Marcar como lida"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg></button>';
    html += '</div>';
  });
  html += '</div>';
  panel.innerHTML = html;
  panel.classList.toggle('open');
}

function renderCommandResults(query) {
  var resultsEl = document.querySelector('.command-results');
  if (!resultsEl) return;
  if (!query || query.length < 1) {
    resultsEl.innerHTML = '<div class="command-group"><div class="command-group-title">Ações Rápidas</div><div class="command-item" data-command="create-doc">+ Novo Documento</div><div class="command-item" data-command="create-folder">+ Nova Pasta</div><div class="command-item" data-command="create-flow">+ Novo Fluxo</div></div><div class="command-group"><div class="command-group-title">Navegar</div><div class="command-item" data-command="nav-home">Ir para Início</div><div class="command-item" data-command="nav-documents">Ir para Documentos</div><div class="command-item" data-command="nav-folders">Ir para Pastas</div><div class="command-item" data-command="nav-flows">Ir para Fluxos</div><div class="command-item" data-command="nav-dashboard">Ir para Dashboard</div></div>';
    return;
  }
  var q = query.toLowerCase();
  var results = searchAll(query);
  var actions = [{ label: '+ Novo Documento', command: 'create-doc' },{ label: '+ Nova Pasta', command: 'create-folder' },{ label: '+ Novo Fluxo', command: 'create-flow' },{ label: 'Ir para Início', command: 'nav-home' },{ label: 'Ir para Documentos', command: 'nav-documents' },{ label: 'Ir para Pastas', command: 'nav-folders' },{ label: 'Ir para Fluxos', command: 'nav-flows' },{ label: 'Ir para Dashboard', command: 'nav-dashboard' }].filter(function (a) { return a.label.toLowerCase().indexOf(q) !== -1; });
  var html = '';
  if (actions.length > 0) { html += '<div class="command-group"><div class="command-group-title">Ações</div>'; actions.forEach(function (a) { html += '<div class="command-item" data-command="' + a.command + '">' + a.label + '</div>'; }); html += '</div>'; }
  if (results.documents.length > 0) { html += '<div class="command-group"><div class="command-group-title">Documentos</div>'; results.documents.slice(0, 5).forEach(function (d) { html += '<div class="command-item" data-command="open-doc-' + d.id + '">' + d.title + ' <span style="color:var(--gray-400);font-size:12px">' + d.ref + '</span></div>'; }); html += '</div>'; }
  if (results.flows.length > 0) { html += '<div class="command-group"><div class="command-group-title">Fluxos</div>'; results.flows.slice(0, 5).forEach(function (f) { html += '<div class="command-item" data-command="open-flow-' + f.id + '">' + f.title + ' <span style="color:var(--gray-400);font-size:12px">' + f.ref + '</span></div>'; }); html += '</div>'; }
  if (html === '') html = '<div class="command-group"><div class="command-group-title">Sem resultados</div><div class="command-item" style="color:var(--gray-400)">Nenhum resultado para "' + query + '"</div></div>';
  resultsEl.innerHTML = html;
  var items = resultsEl.querySelectorAll('.command-item');
  if (items.length > 0) items[0].classList.add('active');
}

// ==================== FEATURE 1: PREVIEW CARDS ====================

var _previewCardEl = null;
var _previewHideTimer = null;

function showPreviewCard(type, id, anchorEl) {
  hidePreviewCard(true);
  var content = getPreviewContent(type, parseInt(id));
  if (!content) return;

  _previewCardEl = document.createElement('div');
  _previewCardEl.className = 'preview-card';
  _previewCardEl.innerHTML = content;
  document.body.appendChild(_previewCardEl);

  // Position near anchor
  var rect = anchorEl.getBoundingClientRect();
  var cardRect = _previewCardEl.getBoundingClientRect();
  var top = rect.bottom + 8;
  if (top + cardRect.height > window.innerHeight) { top = rect.top - cardRect.height - 8; }
  var left = rect.left;
  if (left + cardRect.width > window.innerWidth) { left = window.innerWidth - cardRect.width - 12; }
  if (left < 8) left = 8;
  _previewCardEl.style.top = top + 'px';
  _previewCardEl.style.left = left + 'px';

  _previewCardEl.addEventListener('mouseenter', function() { clearTimeout(_previewHideTimer); });
  _previewCardEl.addEventListener('mouseleave', function() { hidePreviewCard(); });
}

function hidePreviewCard(immediate) {
  if (immediate) {
    clearTimeout(_previewHideTimer);
    if (_previewCardEl) { _previewCardEl.remove(); _previewCardEl = null; }
    return;
  }
  _previewHideTimer = setTimeout(function() {
    if (_previewCardEl) { _previewCardEl.remove(); _previewCardEl = null; }
  }, 200);
}

function getPreviewContent(type, id) {
  if (type === 'doc') {
    var doc = store.documents.find(function(d) { return d.id === id; });
    if (!doc) return '';
    var folder = doc.folderId ? store.folders.find(function(f) { return f.id === doc.folderId; }) : null;
    return '<div class="preview-card-title">' + doc.title + '</div>' +
      '<div class="preview-card-meta">' +
      '<div class="preview-card-row"><span class="ag-type-badge" style="background:linear-gradient(135deg,var(--teal-50),rgba(10,186,181,0.1));color:var(--teal-600);border-radius:20px;">' + doc.type + '</span><span class="doc-status ' + getDocStatusClass(doc.status) + '">' + doc.status + '</span></div>' +
      '<div class="preview-card-row"><span>' + doc.ref + '</span><span>' + formatDateShort(doc.date) + '</span></div>' +
      (doc.entityName ? '<div class="preview-card-row"><span>Entidade: ' + doc.entityName + '</span></div>' : '') +
      '<div class="preview-card-row"><span>' + doc.files.length + ' ficheiro' + (doc.files.length !== 1 ? 's' : '') + '</span>' + (folder ? '<span>Pasta: ' + folder.name + '</span>' : '') + '</div>' +
      '</div>' +
      '<div class="preview-card-actions"><button class="btn-text" data-action="preview-open-doc" data-doc-id="' + doc.id + '">Abrir</button></div>';
  }
  if (type === 'flow') {
    var flow = store.flows.find(function(f) { return f.id === id; });
    if (!flow) return '';
    var currentStage = flow.stages.find(function(s) { return s.status === 'current'; });
    return '<div class="preview-card-title">' + flow.title + '</div>' +
      '<div class="preview-card-meta">' +
      '<div class="preview-card-row"><span class="ag-type-badge" style="background:linear-gradient(135deg,var(--teal-50),rgba(10,186,181,0.1));color:var(--teal-600);border-radius:20px;">' + flow.type + '</span><span class="flow-badge ' + getFlowBadgeClass(flow.status) + '">' + flow.status + '</span></div>' +
      '<div class="preview-card-row"><span>' + flow.ref + '</span><span>' + formatDateShort(flow.date) + '</span></div>' +
      (currentStage ? '<div class="preview-card-row"><span>Etapa: ' + currentStage.name + '</span></div>' : '') +
      (flow.deadline ? '<div class="preview-card-row"><span>Prazo: ' + formatDateShort(flow.deadline) + '</span></div>' : '') +
      '</div>' +
      '<div class="preview-card-actions"><button class="btn-text" data-action="preview-open-flow" data-flow-id="' + flow.id + '">Abrir</button></div>';
  }
  if (type === 'folder') {
    var folder2 = store.folders.find(function(f) { return f.id === id; });
    if (!folder2) return '';
    var docCount = getDocsByFolder(folder2.id).length;
    var flowCount = getFlowsByFolder(folder2.id).length;
    return '<div class="preview-card-title">' + folder2.name + '</div>' +
      '<div class="preview-card-meta">' +
      '<div class="preview-card-row"><span>Estado: ' + folder2.status + '</span></div>' +
      '<div class="preview-card-row"><span>' + docCount + ' documento' + (docCount !== 1 ? 's' : '') + '</span><span>' + flowCount + ' fluxo' + (flowCount !== 1 ? 's' : '') + '</span></div>' +
      '</div>' +
      '<div class="preview-card-actions"><button class="btn-text" data-action="preview-open-folder" data-folder-id="' + folder2.id + '">Abrir</button></div>';
  }
  return '';
}

// ==================== FEATURE 2: PARALLEL TIMELINE RENDERING ====================

function groupStagesByParallel(stages) {
  var groups = [];
  var i = 0;
  while (i < stages.length) {
    var s = stages[i];
    if (s.parallelGroup) {
      var pg = s.parallelGroup;
      var parallelStages = [];
      var startIdx = i;
      while (i < stages.length && stages[i].parallelGroup === pg) {
        parallelStages.push({ stage: stages[i], originalIdx: i });
        i++;
      }
      groups.push({ type: 'parallel', group: pg, stages: parallelStages, startIdx: startIdx });
    } else {
      groups.push({ type: 'single', stage: s, originalIdx: i });
      i++;
    }
  }
  return groups;
}

function renderTimelineWithParallel(flow) {
  var groups = groupStagesByParallel(flow.stages);
  var html = '';
  groups.forEach(function(g, gi) {
    if (g.type === 'single') {
      var s = g.stage;
      var user = s.userId ? getUser(s.userId) : { name: '—', initials: '—' };
      var shortName = getUserShortName(user);
      html += '<div class="timeline-step ' + s.status + '"><div class="timeline-dot ' + (s.status === 'current' ? 'pulse' : '') + '"></div><div class="timeline-label">' + s.name + '</div><div class="timeline-user">' + (s.userId ? shortName : '—') + '</div></div>';
      if (gi < groups.length - 1) {
        var nextGroup = groups[gi + 1];
        var nextStatus = nextGroup.type === 'single' ? nextGroup.stage.status : nextGroup.stages[0].stage.status;
        var connClass = '';
        if (s.status === 'completed' && nextStatus === 'completed') connClass = 'completed';
        else if (s.status === 'completed' && (nextStatus === 'current' || nextStatus === 'completed')) connClass = 'active';
        html += '<div class="timeline-connector ' + connClass + '"></div>';
      }
    } else {
      // Parallel group
      html += '<div class="parallel-wrapper">';
      html += '<div class="parallel-fork-line"></div>';
      html += '<div class="parallel-stages">';
      html += '<div class="parallel-label">Paralelo</div>';
      g.stages.forEach(function(ps) {
        var s = ps.stage;
        var user = s.userId ? getUser(s.userId) : { name: '—', initials: '—' };
        var shortName = getUserShortName(user);
        html += '<div class="timeline-step ' + s.status + '"><div class="timeline-dot ' + (s.status === 'current' ? 'pulse' : '') + '"></div><div class="timeline-label">' + s.name + '</div><div class="timeline-user">' + (s.userId ? shortName : '—') + '</div></div>';
      });
      html += '</div>';
      html += '<div class="parallel-merge-line"></div>';
      html += '</div>';
      // Connector after parallel block
      if (gi < groups.length - 1) {
        var allCompleted = g.stages.every(function(ps) { return ps.stage.status === 'completed'; });
        var anyActive = g.stages.some(function(ps) { return ps.stage.status === 'current'; });
        var nextGroup2 = groups[gi + 1];
        var connClass2 = allCompleted ? 'completed' : (allCompleted || anyActive) ? 'active' : '';
        html += '<div class="timeline-connector ' + connClass2 + '"></div>';
      }
    }
  });
  return html;
}

// ==================== FEATURE 3: AD-HOC STAGE INSERTION ====================

function renderStageInsertBtn(flowId, insertIdx) {
  return '<button class="stage-insert-btn" data-action="stage-insert" data-flow-id="' + flowId + '" data-insert-idx="' + insertIdx + '" title="Inserir etapa">+</button>';
}

function renderStageInsertForm(flowId, insertIdx) {
  var html = '<div class="stage-insert-form" id="stage-insert-form-active">';
  html += '<div class="form-group" style="position:relative"><label>Utilizador / Grupo</label><input type="text" id="stage-insert-user-input" placeholder="Pesquisar utilizador..." autocomplete="off"><div id="stage-insert-user-dropdown"></div></div>';
  html += '<div class="form-group"><label>Tipo de ação</label><select id="stage-insert-action-type"><option value="Parecer">Parecer</option><option value="Aprovação">Aprovação</option><option value="Assinatura">Assinatura</option><option value="Conhecimento">Conhecimento</option></select></div>';
  html += '<div class="insert-form-actions">';
  html += '<button class="btn-insert-confirm" data-action="stage-insert-confirm" data-flow-id="' + flowId + '" data-insert-idx="' + insertIdx + '">Inserir</button>';
  html += '<button class="btn-insert-cancel" data-action="stage-insert-cancel">Cancelar</button>';

  // Check if adjacent stages have a parallelGroup
  var flow = store.flows.find(function(f) { return f.id === parseInt(flowId); });
  if (flow) {
    var prevStage = insertIdx > 0 ? flow.stages[insertIdx - 1] : null;
    var nextStage = insertIdx < flow.stages.length ? flow.stages[insertIdx] : null;
    var adjacentGroup = (prevStage && prevStage.parallelGroup) ? prevStage.parallelGroup : (nextStage && nextStage.parallelGroup) ? nextStage.parallelGroup : null;
    if (adjacentGroup) {
      html += '<button class="btn-insert-parallel" data-action="stage-insert-parallel" data-flow-id="' + flowId + '" data-insert-idx="' + insertIdx + '" data-parallel-group="' + adjacentGroup + '">Adicionar etapa paralela</button>';
    } else {
      html += '<button class="btn-insert-parallel" data-action="stage-insert-parallel" data-flow-id="' + flowId + '" data-insert-idx="' + insertIdx + '" data-parallel-group="NEW">Adicionar etapa paralela</button>';
    }
  }

  html += '</div></div>';
  return html;
}

function handleStageInsert(flowId, insertIdx, parallel, parallelGroup) {
  var flow = store.flows.find(function(f) { return f.id === parseInt(flowId); });
  if (!flow) return;
  var userInput = document.getElementById('stage-insert-user-input');
  var actionType = document.getElementById('stage-insert-action-type');
  if (!userInput || !actionType) return;
  var userName = userInput.value.trim();
  if (!userName) { showToast('Selecione um utilizador', 'error'); return; }

  // Find user
  var user = store.users.find(function(u) { return u.name.toLowerCase() === userName.toLowerCase(); });
  var userId = user ? user.id : null;

  var newStage = {
    name: actionType.value,
    userId: userId,
    status: 'pending',
    date: '',
    note: '',
    files: [],
    parallelGroup: null
  };

  if (parallel) {
    if (parallelGroup === 'NEW') {
      // Create new parallel group with prev or next stage
      var groupLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      var prevStage = insertIdx > 0 ? flow.stages[insertIdx - 1] : null;
      if (prevStage && !prevStage.parallelGroup) {
        prevStage.parallelGroup = groupLetter;
      }
      newStage.parallelGroup = groupLetter;
    } else {
      newStage.parallelGroup = parallelGroup;
    }
  }

  flow.stages.splice(insertIdx, 0, newStage);
  state.stageInsertFormIdx = null;
  state.stageInsertFlowId = null;
  showToast('Etapa inserida com sucesso!');
  renderFlowDetailPage();
}

function filterUsersForInsert(query) {
  if (!query || query.length < 1) return store.users.slice(0, 5);
  var q = query.toLowerCase();
  return store.users.filter(function(u) { return u.name.toLowerCase().indexOf(q) !== -1 || u.dept.toLowerCase().indexOf(q) !== -1; }).slice(0, 8);
}

// ==================== FEATURE 4: ASYNC COMBOBOX ====================

var _comboboxInstances = {};

function renderAsyncCombobox(id, placeholder, searchFn, onSelect, recentItems) {
  _comboboxInstances[id] = { searchFn: searchFn, onSelect: onSelect, selectedItem: null, recentItems: recentItems || [], debounceTimer: null };
  var html = '<div class="async-combobox" id="combobox-' + id + '">';
  html += '<input type="text" class="async-combobox-input" id="combobox-input-' + id + '" placeholder="' + placeholder + '" autocomplete="off" data-combobox-id="' + id + '">';
  html += '<div id="combobox-chip-' + id + '"></div>';
  html += '<div class="async-combobox-dropdown" id="combobox-dropdown-' + id + '" style="display:none"></div>';
  html += '</div>';
  return html;
}

function handleComboboxInput(id, query) {
  var inst = _comboboxInstances[id];
  if (!inst) return;
  var dropdown = document.getElementById('combobox-dropdown-' + id);
  if (!dropdown) return;

  clearTimeout(inst.debounceTimer);

  if (!query || query.length < 2) {
    // Show recent items
    if (inst.recentItems && inst.recentItems.length > 0) {
      var html = '<div class="async-combobox-recent-title">Ultimos usados</div>';
      inst.recentItems.forEach(function(item) {
        html += renderComboboxItem(id, item);
      });
      dropdown.innerHTML = html;
      dropdown.style.display = 'block';
    } else {
      dropdown.style.display = 'none';
    }
    return;
  }

  // Show loading
  dropdown.innerHTML = '<div class="async-combobox-loading">A pesquisar...</div>';
  dropdown.style.display = 'block';

  // Debounced search
  inst.debounceTimer = setTimeout(function() {
    var results = inst.searchFn(query);
    if (results.length === 0) {
      dropdown.innerHTML = '<div class="async-combobox-loading" style="color:var(--gray-400)">Sem resultados</div>';
    } else {
      var html = '';
      results.forEach(function(item) {
        html += renderComboboxItem(id, item);
      });
      dropdown.innerHTML = html;
    }
  }, 300);
}

function renderComboboxItem(id, item) {
  return '<div class="async-combobox-item" data-combobox-id="' + id + '" data-combobox-select="' + item.id + '" data-combobox-label="' + (item.title || item.name || '') + '">' +
    '<div class="async-combobox-item-icon" style="background:' + (item.gradient || item.color || 'var(--teal-500)') + '">' + (item.icon || (item.title || item.name || '?').charAt(0).toUpperCase()) + '</div>' +
    '<div class="async-combobox-item-text"><div class="async-combobox-item-title">' + (item.title || item.name || '') + '</div>' +
    '<div class="async-combobox-item-subtitle">' + (item.subtitle || item.ref || item.type || '') + '</div></div></div>';
}

function selectComboboxItem(id, itemId, label) {
  var inst = _comboboxInstances[id];
  if (!inst) return;

  var input = document.getElementById('combobox-input-' + id);
  var chip = document.getElementById('combobox-chip-' + id);
  var dropdown = document.getElementById('combobox-dropdown-' + id);

  if (input) { input.value = ''; input.style.display = 'none'; }
  if (dropdown) dropdown.style.display = 'none';
  if (chip) {
    chip.innerHTML = '<span class="async-combobox-chip">' + label + ' <button class="async-combobox-chip-remove" data-combobox-id="' + id + '" data-action="combobox-remove">&times;</button></span>';
  }

  inst.selectedItem = { id: itemId, label: label };
  if (inst.onSelect) inst.onSelect(itemId, label);
}

function clearCombobox(id) {
  var inst = _comboboxInstances[id];
  if (!inst) return;
  var input = document.getElementById('combobox-input-' + id);
  var chip = document.getElementById('combobox-chip-' + id);
  if (input) { input.style.display = ''; input.value = ''; }
  if (chip) chip.innerHTML = '';
  inst.selectedItem = null;
}

// Search functions for comboboxes
function searchEntities(query) {
  var q = query.toLowerCase();
  var entities = [
    { id: 'e1', title: 'Empresa ABC, Lda.', subtitle: 'NIF: 509000111', icon: 'E', color: 'var(--teal-500)' },
    { id: 'e2', title: 'ABC Consulting, S.A.', subtitle: 'NIF: 509000222', icon: 'A', color: 'var(--orange-500)' },
    { id: 'e3', title: 'TechSupply, Lda.', subtitle: 'NIF: 509000333', icon: 'T', color: 'var(--purple)' },
    { id: 'e4', title: 'Câmara Municipal de Lisboa', subtitle: 'Entidade Pública', icon: 'C', color: 'var(--success)' },
    { id: 'e5', title: 'Autoridade Tributária', subtitle: 'Entidade Pública', icon: 'A', color: '#6366F1' },
    { id: 'e6', title: 'ClimaTech, S.A.', subtitle: 'NIF: 509000444', icon: 'C', color: 'var(--pink)' },
    { id: 'e7', title: 'Segurança Social', subtitle: 'Entidade Pública', icon: 'S', color: 'var(--teal-600)' },
    { id: 'e8', title: 'ANPC', subtitle: 'Entidade Pública', icon: 'A', color: 'var(--error)' },
    { id: 'e9', title: 'Cliente XYZ, S.A.', subtitle: 'NIF: 509000555', icon: 'X', color: 'var(--orange-600)' },
    { id: 'e10', title: 'Ministério das Infraestruturas', subtitle: 'Entidade Pública', icon: 'M', color: 'var(--gray-600)' }
  ];
  return entities.filter(function(e) { return e.title.toLowerCase().indexOf(q) !== -1; });
}

function searchFolders(query) {
  var q = query.toLowerCase();
  return store.folders.filter(function(f) { return f.name.toLowerCase().indexOf(q) !== -1; }).map(function(f) {
    return { id: f.id, title: f.name, subtitle: f.status + ' · ' + getDocsByFolder(f.id).length + ' docs', icon: 'P', color: 'var(--orange-500)' };
  });
}

function searchDocuments(query) {
  var q = query.toLowerCase();
  return store.documents.filter(function(d) { return d.title.toLowerCase().indexOf(q) !== -1 || d.ref.toLowerCase().indexOf(q) !== -1; }).slice(0, 8).map(function(d) {
    return { id: d.id, title: d.title, subtitle: d.ref + ' · ' + d.type, icon: 'D', color: 'var(--teal-600)' };
  });
}

// ==================== FEATURE 5: FILE VIEWER ====================

function renderFileViewer() {
  var page = document.getElementById('page-file-viewer');
  if (!page) return;

  var doc = store.documents.find(function(d) { return d.id === state.fileViewerDocId; });
  if (!doc) { navigateTo('doc-detail'); return; }

  var fileIdx = state.fileViewerId;
  if (fileIdx === null || fileIdx === undefined || fileIdx < 0 || fileIdx >= doc.files.length) { navigateTo('doc-detail'); return; }

  var file = doc.files[fileIdx];
  var ext = (file.type || getFileExt(file.name)).toLowerCase();
  var isImage = (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'bmp');
  var isPdf = (ext === 'pdf');
  var totalPages = isPdf ? 12 : isImage ? 1 : 5;
  var currentPage = state.fileViewerPage || 1;
  var zoom = state.fileViewerZoom || 100;

  var html = '';
  // Breadcrumb
  html += '<div class="breadcrumb"><a href="#" class="breadcrumb-item" data-action="go-documents">Documentos</a><span class="breadcrumb-sep">/</span><a href="#" class="breadcrumb-item" data-action="file-viewer-back">' + doc.ref + '</a><span class="breadcrumb-sep">/</span><span class="breadcrumb-current">' + file.name + '</span></div>';

  // Toolbar
  html += '<div class="file-viewer-toolbar">';
  html += '<div class="file-viewer-toolbar-left"><button class="btn-back" data-action="file-viewer-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg> Voltar a ' + doc.ref + '</button></div>';
  html += '<div class="file-viewer-toolbar-center">' + file.name + '</div>';
  html += '<div class="file-viewer-toolbar-right">';
  html += '<div class="file-viewer-zoom"><button data-action="file-viewer-zoom-out" title="Diminuir zoom">-</button><span>' + zoom + '%</span><button data-action="file-viewer-zoom-in" title="Aumentar zoom">+</button></div>';
  html += '<button class="btn-tool" data-action="file-viewer-download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Descarregar</button>';
  html += '<button class="btn-tool" data-action="file-viewer-print"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg> Imprimir</button>';
  html += '</div></div>';

  // Canvas
  html += '<div class="file-viewer-canvas" style="transform:scale(' + (zoom / 100) + ');transform-origin:center top;">';
  html += '<div class="file-viewer-canvas-placeholder">';
  if (isPdf) {
    html += '<div class="file-viewer-canvas-icon">PDF</div>';
    html += '<div class="file-viewer-canvas-page">Visualização de documento PDF</div>';
    html += '<div style="color:var(--gray-300);font-size:13px;">' + file.name + ' (' + file.size + ')</div>';
  } else if (isImage) {
    html += '<div class="file-viewer-canvas-icon" style="width:200px;height:140px;background:linear-gradient(135deg,var(--gray-100),var(--gray-200));">IMG</div>';
    html += '<div class="file-viewer-canvas-page">Visualização de imagem</div>';
  } else {
    html += '<div class="file-viewer-canvas-icon">' + ext.toUpperCase() + '</div>';
    html += '<div class="file-viewer-canvas-page">Visualização de documento</div>';
    html += '<div style="color:var(--gray-300);font-size:13px;">' + file.name + ' (' + file.size + ')</div>';
  }
  html += '<div style="font-size:13px;color:var(--gray-400);margin-top:8px">Pagina ' + currentPage + ' de ' + totalPages + '</div>';
  html += '</div></div>';

  // Pagination
  if (totalPages > 1) {
    html += '<div class="file-viewer-pagination">';
    html += '<button data-action="file-viewer-prev" ' + (currentPage <= 1 ? 'disabled' : '') + '>&larr; Anterior</button>';
    html += '<span>' + currentPage + ' / ' + totalPages + '</span>';
    html += '<button data-action="file-viewer-next" ' + (currentPage >= totalPages ? 'disabled' : '') + '>Seguinte &rarr;</button>';
    html += '</div>';
  }

  page.innerHTML = html;
}

// ==================== PART 5: ACTIONS ====================

function handleCreateDoc() {
  var typeEl = document.getElementById('create-doc-type');
  var titleEl = document.getElementById('create-doc-title');
  if (!typeEl || !titleEl) return;
  var type = typeEl.value, title = titleEl.value.trim(), valid = true;
  if (!type) { typeEl.parentElement.classList.add('error'); valid = false; } else { typeEl.parentElement.classList.remove('error'); }
  if (!title) { titleEl.parentElement.classList.add('error'); valid = false; } else { titleEl.parentElement.classList.remove('error'); }
  if (!valid) { showToast('Preencha os campos obrigatórios', 'error'); return; }
  var entityInst = _comboboxInstances['doc-entity'];
  var entityName = (entityInst && entityInst.selectedItem) ? entityInst.selectedItem.label : '';
  var folderInst = _comboboxInstances['doc-folder'];
  var selectedFolderId = (folderInst && folderInst.selectedItem) ? parseInt(folderInst.selectedItem.id) : null;
  var classEl = document.getElementById('create-doc-class');
  var deptEl = document.getElementById('create-doc-dept');
  var valueEl = document.getElementById('create-doc-value');
  var newId = generateId('documents');
  var newDoc = { id: newId, title: title, type: type, status: 'Em edição', ref: 'DOC-2024/' + String(newId + 2000).padStart(4, '0'), date: new Date().toISOString().split('T')[0], entityName: entityName, classificationPath: classEl ? classEl.value : '', folderId: selectedFolderId, files: [], additionalFields: {} };
  if (deptEl && deptEl.value) newDoc.additionalFields.department = deptEl.value;
  if (valueEl && valueEl.value) newDoc.additionalFields.value = valueEl.value + ' €';
  store.documents.unshift(newDoc);
  closeModal('create-doc-modal');
  showToast('Documento criado com sucesso!');
  renderCurrentPage();
}

function handleCreateFolder() {
  var titleEl = document.getElementById('create-folder-title');
  if (!titleEl) return;
  var title = titleEl.value.trim(), valid = true;
  if (!title) { titleEl.parentElement.classList.add('error'); valid = false; } else { titleEl.parentElement.classList.remove('error'); }
  if (!valid) { showToast('Preencha os campos obrigatórios', 'error'); return; }
  var obsEl = document.getElementById('create-folder-obs');
  var newId = generateId('folders');
  store.folders.push({ id: newId, name: title, parentId: state.folders.currentId, status: 'Aberta', date: new Date().toISOString().split('T')[0], description: obsEl ? obsEl.value : '' });
  closeModal('create-folder-modal');
  showToast('Pasta criada com sucesso!');
  renderCurrentPage();
}

function handleCreateFlow() {
  var typeEl = document.getElementById('create-flow-type');
  var titleEl = document.getElementById('create-flow-title');
  if (!typeEl || !titleEl) return;
  var type = typeEl.value, title = titleEl.value.trim(), valid = true;
  if (!type) { typeEl.parentElement.classList.add('error'); valid = false; } else { typeEl.parentElement.classList.remove('error'); }
  if (!title) { titleEl.parentElement.classList.add('error'); valid = false; } else { titleEl.parentElement.classList.remove('error'); }
  if (!valid) { showToast('Preencha os campos obrigatórios', 'error'); return; }
  var newId = generateId('flows');
  store.flows.unshift({ id: newId, title: title, type: type, status: 'Pendente', ref: 'PROC-2024/' + String(newId + 2000).padStart(4, '0'), date: new Date().toISOString().split('T')[0], folderId: null, deadline: null, stages: [{ name: 'Registo', userId: 1, status: 'completed', date: new Date().toISOString(), note: 'Fluxo criado.', files: [] },{ name: type, userId: 2, status: 'current', date: new Date().toISOString(), note: '', files: [] },{ name: 'Arquivo', userId: null, status: 'pending', date: '', note: '', files: [] }] });
  closeModal('create-flow-modal');
  showToast('Fluxo criado e enviado!');
  renderCurrentPage();
}

function handleFlowAction(flowId, action) {
  var flow = store.flows.find(function (f) { return f.id === flowId; });
  if (!flow) return;
  var currentStageIdx = flow.stages.findIndex(function (s) { return s.status === 'current'; });
  if (currentStageIdx === -1 && action !== 'suspend') return;
  var noteEl = document.getElementById('flow-stage-note-' + flowId);
  var note = noteEl ? noteEl.value.trim() : '';

  switch (action) {
    case 'approve':
      flow.stages[currentStageIdx].status = 'completed';
      flow.stages[currentStageIdx].date = new Date().toISOString();
      flow.stages[currentStageIdx].note = note || (flow.type === 'Aprovação' ? 'Aprovado.' : flow.type === 'Parecer' ? 'Parecer emitido.' : flow.type === 'Assinatura' ? 'Assinado digitalmente.' : 'Enviado.');
      if (currentStageIdx + 1 < flow.stages.length) { flow.stages[currentStageIdx + 1].status = 'current'; flow.stages[currentStageIdx + 1].date = new Date().toISOString(); }
      if (flow.stages.every(function (s) { return s.status === 'completed'; })) flow.status = 'Terminado';
      showToast(flow.type === 'Aprovação' ? 'Aprovado com sucesso!' : 'Enviado com sucesso!');
      break;
    case 'reject':
      flow.stages[currentStageIdx].status = 'completed';
      flow.stages[currentStageIdx].date = new Date().toISOString();
      flow.stages[currentStageIdx].note = note || 'Rejeitado.';
      flow.status = 'Indeferido';
      showToast('Fluxo indeferido.');
      break;
    case 'return':
      if (currentStageIdx > 0) { flow.stages[currentStageIdx].status = 'pending'; flow.stages[currentStageIdx - 1].status = 'current'; flow.stages[currentStageIdx - 1].date = new Date().toISOString(); flow.stages[currentStageIdx - 1].note = note || 'Devolvido para revisão.'; }
      showToast('Devolvido com sucesso.');
      break;
    case 'suspend':
      flow.status = 'Suspenso';
      showToast('Fluxo suspenso.');
      break;
  }
  store.activities.unshift({ id: generateId('activities'), userId: 1, action: { approve: 'aprovou etapa de', reject: 'indeferiu', return: 'devolveu etapa de', suspend: 'suspendeu' }[action] || 'atualizou', target: flow.ref, targetType: 'flow', targetId: flow.id, time: new Date().toISOString() });
  renderCurrentPage();
}

function handleNotifRead(id) {
  var notif = store.notifications.find(function (n) { return n.id === id; });
  if (notif) { notif.read = true; updateNotifBadge(); renderNotifications(); }
}

function updateNotifBadge() {
  var badge = document.querySelector('.notif-badge');
  var unread = store.notifications.filter(function (n) { return !n.read; }).length;
  if (badge) { badge.textContent = unread; badge.style.display = unread > 0 ? '' : 'none'; }
}

// ==================== PART 6: NAVIGATION & EVENTS ====================

function navigateTo(page) {
  state.currentPage = page;
  var navPage = page;
  if (page === 'doc-detail' || page === 'flow-detail' || page === 'file-viewer') navPage = 'documents';
  document.querySelectorAll('.nav-item').forEach(function (item) { item.classList.toggle('active', item.dataset.page === navPage); });
  document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
  var pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  renderCurrentPage();
}

function renderCurrentPage() {
  switch (state.currentPage) {
    case 'home': renderHome(); break;
    case 'documents': renderDocuments(); break;
    case 'folders': renderFolders(); break;
    case 'flows': renderFlows(); break;
    case 'dashboard': renderDashboard(); break;
    case 'search': renderSearch(state.search.query, state.search.type); break;
    case 'doc-detail': renderDocDetailPage(); break;
    case 'flow-detail': renderFlowDetailPage(); break;
    case 'file-viewer': renderFileViewer(); break;
  }
}

function openModal(id) { var m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { var m = document.getElementById(id); if (m) { m.classList.remove('open'); m.querySelectorAll('.form-group.error').forEach(function (g) { g.classList.remove('error'); }); } }

function openCommandPalette() { var cp = document.getElementById('command-palette'); if (cp) { cp.classList.add('open'); var input = document.getElementById('command-input'); if (input) { input.value = ''; input.focus(); } renderCommandResults(''); } }
function closeCommandPalette() { var cp = document.getElementById('command-palette'); if (cp) cp.classList.remove('open'); }
function toggleAdvancedFilters(id) { var el = document.getElementById(id); if (el) el.classList.toggle('hidden'); }

function showToast(message, type) {
  var toast = document.getElementById('toast-container');
  if (!toast) { toast = document.createElement('div'); toast.id = 'toast-container'; toast.className = 'toast-container'; document.body.appendChild(toast); }
  var toastEl = document.createElement('div');
  toastEl.className = 'toast ' + (type === 'error' ? 'toast-error' : 'toast-success');
  toastEl.innerHTML = '<span>' + message + '</span>';
  toast.appendChild(toastEl);
  setTimeout(function () { toastEl.classList.add('show'); }, 10);
  setTimeout(function () { toastEl.classList.remove('show'); setTimeout(function () { toastEl.remove(); }, 300); }, 3000);
}

function executeCommand(command) {
  closeCommandPalette();
  if (command === 'create-doc') { openModal('create-doc-modal'); return; }
  if (command === 'create-folder') { openModal('create-folder-modal'); return; }
  if (command === 'create-flow') { openModal('create-flow-modal'); return; }
  if (command.indexOf('nav-') === 0) { navigateTo(command.replace('nav-', '')); return; }
  if (command.indexOf('open-doc-') === 0) { state.docDetailId = parseInt(command.replace('open-doc-', '')); navigateTo('doc-detail'); return; }
  if (command.indexOf('open-folder-') === 0) { var fid = parseInt(command.replace('open-folder-', '')); state.folders.currentId = fid; state.folders.breadcrumb = buildBreadcrumb(fid); navigateTo('folders'); return; }
  if (command.indexOf('open-flow-') === 0) { state.flowDetailId = parseInt(command.replace('open-flow-', '')); navigateTo('flow-detail'); return; }
}

function debounce(fn, delay) { var timer; return function () { var args = arguments; var ctx = this; clearTimeout(timer); timer = setTimeout(function () { fn.apply(ctx, args); }, delay); }; }

function setupEventDelegation() {
  var debouncedGlobalSearch = debounce(function (query) { if (query.length >= 2) { state.search.query = query; navigateTo('search'); } }, 200);
  var debouncedPageSearch = debounce(function (query) { state.search.query = query; renderSearch(query, state.search.type); }, 200);

  document.addEventListener('click', function (e) {
    var target = e.target;

    // Nav items
    var navItem = target.closest('.nav-item[data-page]');
    if (navItem) { e.preventDefault(); navigateTo(navItem.dataset.page); return; }

    // Flow action buttons
    var flowActionBtn = target.closest('[data-flow-id][data-action]');
    if (flowActionBtn) {
      e.stopPropagation();
      var flowId = parseInt(flowActionBtn.dataset.flowId);
      var action = flowActionBtn.dataset.action;
      if (action === 'approve' || action === 'reject' || action === 'return' || action === 'suspend') { handleFlowAction(flowId, action); return; }
      if (action === 'view-flow') { state.flowDetailId = flowId; navigateTo('flow-detail'); return; }
    }

    // Doc card -> navigate to detail page
    var docCard = target.closest('[data-action="view-doc"]');
    if (docCard && docCard.dataset.docId) { state.docDetailId = parseInt(docCard.dataset.docId); navigateTo('doc-detail'); return; }

    // Flow card (not buttons)
    var flowCard = target.closest('[data-action="view-flow-card"]');
    if (flowCard && flowCard.dataset.flowId && !target.closest('.btn-action')) { state.flowDetailId = parseInt(flowCard.dataset.flowId); navigateTo('flow-detail'); return; }

    // Folder card
    var folderCard = target.closest('[data-action="open-folder"]');
    if (folderCard && folderCard.dataset.folderId) { var fId = parseInt(folderCard.dataset.folderId); state.folders.currentId = fId; state.folders.breadcrumb = buildBreadcrumb(fId); renderFolders(); return; }

    // Folder from search
    var folderSearch = target.closest('[data-action="open-folder-from-search"]');
    if (folderSearch && folderSearch.dataset.folderId) { var fId2 = parseInt(folderSearch.dataset.folderId); state.folders.currentId = fId2; state.folders.breadcrumb = buildBreadcrumb(fId2); navigateTo('folders'); return; }

    // Breadcrumb (folders)
    var breadcrumbItem = target.closest('.breadcrumb-item[data-folder-id]');
    if (breadcrumbItem) { e.preventDefault(); var bfId = breadcrumbItem.dataset.folderId; if (bfId === 'null') { state.folders.currentId = null; state.folders.breadcrumb = []; } else { state.folders.currentId = parseInt(bfId); state.folders.breadcrumb = buildBreadcrumb(parseInt(bfId)); } renderFolders(); return; }

    // Breadcrumb navigation (detail pages)
    if (target.closest('[data-action="go-documents"]')) { e.preventDefault(); navigateTo('documents'); return; }
    if (target.closest('[data-action="go-flows"]')) { e.preventDefault(); navigateTo('flows'); return; }

    // Detail page tabs
    var detailTab = target.closest('.detail-tab[data-detail-tab]');
    if (detailTab) {
      if (detailTab.dataset.detailType === 'doc') { state.docDetailTab = detailTab.dataset.detailTab; renderDocDetailPage(); }
      else if (detailTab.dataset.detailType === 'flow') { state.flowDetailTab = detailTab.dataset.detailTab; renderFlowDetailPage(); }
      return;
    }

    // Filter chips (documents)
    if (target.classList.contains('filter-chip') && target.closest('#page-documents')) { state.documents.filter = target.dataset.filter || target.textContent.trim(); state.documents.page = 1; renderDocuments(); return; }

    // Filter chips (flows)
    if (target.classList.contains('filter-chip') && target.closest('#page-flows')) { state.flows.filter = target.dataset.filter || target.textContent.trim(); state.flows.page = 1; renderFlows(); return; }

    // Quick filter chips
    var qfBtn = target.closest('.quick-filter[data-quick-filter]');
    if (qfBtn) {
      var ent = qfBtn.dataset.entity;
      var key = qfBtn.dataset.quickFilter;
      var arr = state[ent].quickFilters;
      var idx = arr.indexOf(key);
      if (idx === -1) arr.push(key); else arr.splice(idx, 1);
      if (ent === 'documents') renderDocuments();
      else if (ent === 'flows') renderFlows();
      return;
    }

    // Open create modals
    if (target.closest('[data-action="open-create-doc"]')) { openModal('create-doc-modal'); return; }
    if (target.closest('[data-action="open-create-folder"]')) { openModal('create-folder-modal'); return; }
    if (target.closest('[data-action="open-create-flow"]')) { openModal('create-flow-modal'); return; }

    // Advanced filters
    if (target.closest('[data-action="toggle-doc-advanced"]')) { toggleAdvancedFilters('doc-advanced-filters'); return; }
    if (target.closest('[data-action="toggle-flow-advanced"]')) { toggleAdvancedFilters('flow-advanced-filters'); return; }
    if (target.closest('[data-action="apply-doc-advanced"]')) {
      var typeEl = document.getElementById('adv-doc-type');
      var entityEl = document.getElementById('adv-doc-entity');
      if (typeEl) state.documents.advanced.type = typeEl.value || null;
      if (entityEl) state.documents.advanced.entity = entityEl.value || null;
      state.documents.page = 1;
      renderDocuments();
      return;
    }
    if (target.closest('[data-action="clear-doc-advanced"]')) { state.documents.advanced = {}; state.documents.page = 1; renderDocuments(); return; }
    if (target.closest('[data-action="apply-flow-advanced"]')) { renderFlows(); return; }
    if (target.closest('[data-action="clear-flow-advanced"]')) { renderFlows(); return; }

    // Notifications
    if (target.closest('#notif-btn')) { renderNotifications(); return; }
    if (target.closest('[data-action="close-notif"]')) { var np = document.getElementById('notif-panel'); if (np) np.classList.remove('open'); return; }
    if (target.closest('[data-action="mark-read"]')) { var nid = parseInt(target.closest('[data-notif-id]').dataset.notifId); handleNotifRead(nid); return; }

    // Command palette items
    var commandItem = target.closest('.command-item[data-command]');
    if (commandItem) { executeCommand(commandItem.dataset.command); return; }

    // Saved search chips
    var savedChip = target.closest('[data-saved-query]');
    if (savedChip) { state.search.query = savedChip.dataset.savedQuery; renderSearch(state.search.query, state.search.type); return; }

    // Search type tabs
    var searchTab = target.closest('.search-type-tab[data-search-type]');
    if (searchTab) { state.search.type = searchTab.dataset.searchType; renderSearch(state.search.query, state.search.type); return; }

    // View toggle (list/table)
    var viewBtn = target.closest('.view-btn[data-view][data-entity]');
    if (viewBtn) { var ent2 = viewBtn.dataset.entity; state[ent2].view = viewBtn.dataset.view; state[ent2].page = 1; if (ent2 === 'documents') renderDocuments(); else if (ent2 === 'flows') renderFlows(); return; }

    // View all tasks
    if (target.closest('[data-action="view-all-tasks"]')) { state.flows.filter = 'Pendentes'; navigateTo('flows'); return; }

    // Create buttons in modals
    if (target.closest('#create-doc-submit')) { handleCreateDoc(); return; }
    if (target.closest('#create-folder-submit')) { handleCreateFolder(); return; }
    if (target.closest('#create-flow-submit')) { handleCreateFlow(); return; }

    // Folder link in detail pages
    var folderLink = target.closest('.folder-link-inline[data-folder-id]');
    if (folderLink) { e.preventDefault(); var flId = parseInt(folderLink.dataset.folderId); state.folders.currentId = flId; state.folders.breadcrumb = buildBreadcrumb(flId); navigateTo('folders'); return; }

    // === FEATURE 1: Preview card actions ===
    if (target.closest('[data-action="preview-open-doc"]')) { var did = parseInt(target.closest('[data-doc-id]').dataset.docId); hidePreviewCard(true); state.docDetailId = did; navigateTo('doc-detail'); return; }
    if (target.closest('[data-action="preview-open-flow"]')) { var fid3 = parseInt(target.closest('[data-flow-id]').dataset.flowId); hidePreviewCard(true); state.flowDetailId = fid3; navigateTo('flow-detail'); return; }
    if (target.closest('[data-action="preview-open-folder"]')) { var fid4 = parseInt(target.closest('[data-folder-id]').dataset.folderId); hidePreviewCard(true); state.folders.currentId = fid4; state.folders.breadcrumb = buildBreadcrumb(fid4); navigateTo('folders'); return; }

    // === FEATURE 3: Stage insert buttons ===
    var stageInsertBtn = target.closest('[data-action="stage-insert"]');
    if (stageInsertBtn) { state.stageInsertFlowId = parseInt(stageInsertBtn.dataset.flowId); state.stageInsertFormIdx = parseInt(stageInsertBtn.dataset.insertIdx); renderFlowDetailPage(); return; }

    if (target.closest('[data-action="stage-insert-cancel"]')) { state.stageInsertFormIdx = null; state.stageInsertFlowId = null; renderFlowDetailPage(); return; }

    var insertConfirm = target.closest('[data-action="stage-insert-confirm"]');
    if (insertConfirm) { handleStageInsert(insertConfirm.dataset.flowId, parseInt(insertConfirm.dataset.insertIdx), false, null); return; }

    var insertParallel = target.closest('[data-action="stage-insert-parallel"]');
    if (insertParallel) { handleStageInsert(insertParallel.dataset.flowId, parseInt(insertParallel.dataset.insertIdx), true, insertParallel.dataset.parallelGroup); return; }

    // === FEATURE 4: Combobox item selection ===
    var comboItem = target.closest('.async-combobox-item[data-combobox-select]');
    if (comboItem) { selectComboboxItem(comboItem.dataset.comboboxId, comboItem.dataset.comboboxSelect, comboItem.dataset.comboboxLabel); return; }

    var comboRemove = target.closest('[data-action="combobox-remove"]');
    if (comboRemove) { clearCombobox(comboRemove.dataset.comboboxId); return; }

    // === FEATURE 5: File viewer ===
    var fileViewerBtn = target.closest('[data-action="open-file-viewer"]');
    if (fileViewerBtn) { state.fileViewerDocId = parseInt(fileViewerBtn.dataset.docId); state.fileViewerId = parseInt(fileViewerBtn.dataset.fileIdx); state.fileViewerPage = 1; state.fileViewerZoom = 100; navigateTo('file-viewer'); return; }

    if (target.closest('[data-action="file-viewer-back"]')) { e.preventDefault(); state.docDetailId = state.fileViewerDocId; state.docDetailTab = 'ficheiros'; navigateTo('doc-detail'); return; }

    if (target.closest('[data-action="file-viewer-prev"]')) { if (state.fileViewerPage > 1) { state.fileViewerPage--; renderFileViewer(); } return; }
    if (target.closest('[data-action="file-viewer-next"]')) { state.fileViewerPage++; renderFileViewer(); return; }
    if (target.closest('[data-action="file-viewer-zoom-in"]')) { state.fileViewerZoom = Math.min(200, state.fileViewerZoom + 25); renderFileViewer(); return; }
    if (target.closest('[data-action="file-viewer-zoom-out"]')) { state.fileViewerZoom = Math.max(50, state.fileViewerZoom - 25); renderFileViewer(); return; }
    if (target.closest('[data-action="file-viewer-download"]')) { showToast('Download simulado'); return; }
    if (target.closest('[data-action="file-viewer-print"]')) { showToast('Impressão simulada'); return; }

    // === FEATURE 3: Stage insert user dropdown item ===
    var userItem = target.closest('.stage-insert-user-item');
    if (userItem) {
      var uInput = document.getElementById('stage-insert-user-input');
      if (uInput) uInput.value = userItem.dataset.userName;
      var uDropdown = document.getElementById('stage-insert-user-dropdown');
      if (uDropdown) uDropdown.innerHTML = '';
      return;
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.id === 'doc-sort-select') { state.documents.sort = e.target.value; state.documents.page = 1; renderDocuments(); }
    if (e.target.id === 'flow-sort-select') { state.flows.sort = e.target.value; state.flows.page = 1; renderFlows(); }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'global-search') { debouncedGlobalSearch(e.target.value.trim()); }
    if (e.target.id === 'command-input') { renderCommandResults(e.target.value.trim()); }
    if (e.target.id === 'search-page-input') { state.search.query = e.target.value.trim(); debouncedPageSearch(state.search.query); }

    // Feature 3: Stage insert user search
    if (e.target.id === 'stage-insert-user-input') {
      var query = e.target.value.trim();
      var dropdown = document.getElementById('stage-insert-user-dropdown');
      if (dropdown) {
        var users = filterUsersForInsert(query);
        if (users.length > 0 && query.length > 0) {
          var uhtml = '';
          users.forEach(function(u) {
            uhtml += '<div class="stage-insert-user-item" data-user-name="' + u.name + '"><span style="width:22px;height:22px;border-radius:50%;color:white;font-size:8px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;background:' + u.gradient + '">' + u.initials + '</span> ' + u.name + ' <span style="color:var(--gray-400);font-size:11px">(' + u.dept + ')</span></div>';
          });
          dropdown.innerHTML = '<div class="stage-insert-user-dropdown">' + uhtml + '</div>';
        } else {
          dropdown.innerHTML = '';
        }
      }
    }

    // Feature 4: Combobox input
    if (e.target.classList.contains('async-combobox-input') && e.target.dataset.comboboxId) {
      handleComboboxInput(e.target.dataset.comboboxId, e.target.value.trim());
    }
  });

  // Feature 4: Combobox focus (show recent items)
  document.addEventListener('focus', function(e) {
    if (e.target.classList.contains('async-combobox-input') && e.target.dataset.comboboxId) {
      handleComboboxInput(e.target.dataset.comboboxId, e.target.value.trim());
    }
  }, true);

  // Feature 4: Combobox blur (hide dropdown with delay)
  document.addEventListener('blur', function(e) {
    if (e.target.classList.contains('async-combobox-input') && e.target.dataset.comboboxId) {
      var cbId = e.target.dataset.comboboxId;
      setTimeout(function() {
        var dd = document.getElementById('combobox-dropdown-' + cbId);
        if (dd) dd.style.display = 'none';
      }, 200);
    }
  }, true);

  // Feature 1: Preview card hover (mouseenter/mouseleave)
  document.addEventListener('mouseenter', function(e) {
    var previewEl = e.target.closest('[data-preview-type]');
    if (previewEl) {
      clearTimeout(_previewHideTimer);
      showPreviewCard(previewEl.dataset.previewType, previewEl.dataset.previewId, previewEl);
    }
  }, true);

  document.addEventListener('mouseleave', function(e) {
    var previewEl = e.target.closest('[data-preview-type]');
    if (previewEl) {
      hidePreviewCard();
    }
  }, true);

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); var cp = document.getElementById('command-palette'); if (cp && cp.classList.contains('open')) closeCommandPalette(); else openCommandPalette(); return; }
    if (e.key === 'Escape') {
      var cp2 = document.getElementById('command-palette');
      if (cp2 && cp2.classList.contains('open')) { closeCommandPalette(); return; }
      document.querySelectorAll('.modal-overlay.open').forEach(function (m) { m.classList.remove('open'); });
      var notifP = document.getElementById('notif-panel');
      if (notifP && notifP.classList.contains('open')) notifP.classList.remove('open');
      return;
    }
    var cp3 = document.getElementById('command-palette');
    if (cp3 && cp3.classList.contains('open')) {
      var items = cp3.querySelectorAll('.command-item');
      var activeItem = cp3.querySelector('.command-item.active');
      var currentIdx = -1;
      items.forEach(function (item, i) { if (item.classList.contains('active')) currentIdx = i; });
      if (e.key === 'ArrowDown') { e.preventDefault(); if (activeItem) activeItem.classList.remove('active'); var ni = currentIdx < items.length - 1 ? currentIdx + 1 : 0; if (items[ni]) { items[ni].classList.add('active'); items[ni].scrollIntoView({ block: 'nearest' }); } }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (activeItem) activeItem.classList.remove('active'); var pi = currentIdx > 0 ? currentIdx - 1 : items.length - 1; if (items[pi]) { items[pi].classList.add('active'); items[pi].scrollIntoView({ block: 'nearest' }); } }
      else if (e.key === 'Enter') { e.preventDefault(); if (activeItem && activeItem.dataset.command) executeCommand(activeItem.dataset.command); }
    }
  });

  // Handle browser back/forward
  window.addEventListener('popstate', function() {
    // Simple fallback: go to documents list from detail
    if (state.currentPage === 'file-viewer') { state.docDetailId = state.fileViewerDocId; state.docDetailTab = 'ficheiros'; navigateTo('doc-detail'); }
    else if (state.currentPage === 'doc-detail') navigateTo('documents');
    else if (state.currentPage === 'flow-detail') navigateTo('flows');
  });
}

// ==================== PART 7: INIT ====================

document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var loginPage = document.getElementById('login-page');
      var app = document.getElementById('app');
      if (loginPage) loginPage.classList.add('hidden');
      if (app) app.classList.remove('hidden');
      renderHome();
      updateNotifBadge();
    });
  }

  setupEventDelegation();
  initComboboxes();

  var appEl = document.getElementById('app');
  if (appEl) { var notifPanel = document.createElement('div'); notifPanel.id = 'notif-panel'; notifPanel.className = 'notif-panel'; appEl.appendChild(notifPanel); }

  var toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  var mobileBtn = document.getElementById('mobile-menu-btn');
  if (mobileBtn) { mobileBtn.addEventListener('click', function () { var sidebar = document.getElementById('sidebar'); if (sidebar) sidebar.classList.toggle('open'); }); }
});

function initComboboxes() {
  // Replace entity input in create doc modal
  var entityGroup = document.getElementById('create-doc-entity');
  if (entityGroup) {
    var parentDiv = entityGroup.closest('.form-group');
    if (parentDiv) {
      var recentEntities = [
        { id: 'e1', title: 'Empresa ABC, Lda.', subtitle: 'NIF: 509000111', icon: 'E', color: 'var(--teal-500)' },
        { id: 'e2', title: 'ABC Consulting, S.A.', subtitle: 'NIF: 509000222', icon: 'A', color: 'var(--orange-500)' },
        { id: 'e3', title: 'TechSupply, Lda.', subtitle: 'NIF: 509000333', icon: 'T', color: 'var(--purple)' }
      ];
      parentDiv.innerHTML = '<label>Entidade</label>' + renderAsyncCombobox('doc-entity', 'Pesquisar entidade...', searchEntities, function(id, label) { /* entity selected */ }, recentEntities);
    }
  }

  // Replace folder input in create doc modal
  var folderInput = document.getElementById('create-doc-folder');
  if (folderInput) {
    var parentDiv2 = folderInput.closest('.form-group');
    if (parentDiv2) {
      var recentFolders = store.folders.slice(0, 3).map(function(f) {
        return { id: f.id, title: f.name, subtitle: f.status + ' · ' + getDocsByFolder(f.id).length + ' docs', icon: 'P', color: 'var(--orange-500)' };
      });
      parentDiv2.innerHTML = '<label>Pasta</label>' + renderAsyncCombobox('doc-folder', 'Associar a pasta...', searchFolders, function(id, label) { /* folder selected */ }, recentFolders);
    }
  }

  // Replace document input in create flow modal
  var flowDocInput = document.getElementById('create-flow-doc');
  if (flowDocInput) {
    var parentDiv3 = flowDocInput.closest('.form-group');
    if (parentDiv3) {
      var recentDocs = store.documents.slice(0, 3).map(function(d) {
        return { id: d.id, title: d.title, subtitle: d.ref + ' · ' + d.type, icon: 'D', color: 'var(--teal-600)' };
      });
      parentDiv3.innerHTML = '<label>Documento Associado</label>' + renderAsyncCombobox('flow-doc', 'Pesquisar documento...', searchDocuments, function(id, label) { /* doc selected */ }, recentDocs);
    }
  }
}

// Global function exposure
window.openModal = openModal;
window.closeModal = closeModal;
window.navigateTo = navigateTo;
window.openCommandPalette = openCommandPalette;
window.closeCommandPalette = closeCommandPalette;
window.toggleAdvancedFilters = toggleAdvancedFilters;
window.showToast = showToast;
window.showPreviewCard = showPreviewCard;
window.hidePreviewCard = hidePreviewCard;
window.renderAsyncCombobox = renderAsyncCombobox;
