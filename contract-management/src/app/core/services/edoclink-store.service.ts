import { Injectable, signal, computed } from '@angular/core';

export interface EdocUser {
  id: number;
  name: string;
  initials: string;
  dept: string;
  gradient: string;
}

export interface EdocDocument {
  id: number;
  title: string;
  type: string;
  status: string;
  ref: string;
  date: string;
  entityName: string;
  classificationPath: string;
  folderId: number;
  files: { name: string; size: string; type: string }[];
  additionalFields: Record<string, string>;
}

export interface EdocFolder {
  id: number;
  name: string;
  parentId: number | null;
  status: string;
  date: string;
  description: string;
}

export interface FlowStage {
  name: string;
  userId: number | null;
  status: 'completed' | 'current' | 'pending';
  date: string;
  note: string;
  files: { name: string; size: string; type: string }[];
  parallelGroup?: string | null;
}

export interface EdocFlow {
  id: number;
  title: string;
  type: string;
  status: string;
  ref: string;
  date: string;
  folderId: number;
  deadline: string | null;
  stages: FlowStage[];
}

export interface EdocContract {
  id: number;
  title: string;
  code: string;
  type: string;
  status: string;
  description: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  department: string;
  parties: { name: string; role: string; taxId: string; contact: string }[];
  documents: { id: number; name: string; size: string; type: string; uploadedAt: string; uploadedBy: number }[];
  workflow: { id: number; name: string; type: 'approval' | 'signature' | 'review'; assigneeId: number; status: 'completed' | 'current' | 'pending' | 'rejected'; completedAt: string; comments: string }[];
  tags: string[];
  autoRenew: boolean;
  paymentTerms: string;
  notes: string;
}

export interface EdocNotification {
  id: number;
  text: string;
  time: string;
  read: boolean;
  type: string;
  refId: number;
}

export interface EdocActivity {
  id: number;
  userId: number;
  action: string;
  target: string;
  targetType: string;
  targetId: number;
  time: string;
}

@Injectable({ providedIn: 'root' })
export class EdoclinkStoreService {
  // All the data from the mockup - use the exact same data as in app.js

  readonly users: EdocUser[] = [
    { id: 1, name: 'Filipe Correia', initials: 'FC', dept: 'Administração', gradient: 'linear-gradient(135deg,#0ABAB5,#089E9A)' },
    { id: 2, name: 'João Silva', initials: 'JS', dept: 'Jurídico', gradient: 'linear-gradient(135deg,#0ABAB5,#089E9A)' },
    { id: 3, name: 'Maria Santos', initials: 'MS', dept: 'Financeiro', gradient: 'linear-gradient(135deg,#F5A623,#D97706)' },
    { id: 4, name: 'Ana Oliveira', initials: 'AO', dept: 'Recursos Humanos', gradient: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' },
    { id: 5, name: 'Pedro Costa', initials: 'PC', dept: 'TI', gradient: 'linear-gradient(135deg,#10B981,#059669)' },
    { id: 6, name: 'Carla Mendes', initials: 'CM', dept: 'Administração', gradient: 'linear-gradient(135deg,#EC4899,#DB2777)' },
    { id: 7, name: 'Rui Ferreira', initials: 'RF', dept: 'Financeiro', gradient: 'linear-gradient(135deg,#F59E0B,#D97706)' },
    { id: 8, name: 'Sofia Almeida', initials: 'SA', dept: 'Direção Geral', gradient: 'linear-gradient(135deg,#6366F1,#4F46E5)' }
  ];

  // Copy ALL 20 documents from the mockup app.js (store.documents array)
  readonly documents: EdocDocument[] = [
    { id: 1, title: 'Relatório Financeiro Q4 2024', type: 'Correspondência Recebida', status: 'Pronto', ref: 'DOC-2024/5678', date: '2024-03-15', entityName: 'Empresa ABC, Lda.', classificationPath: 'Financeiro > Relatórios > Trimestrais', folderId: 3, files: [{ name: 'Relatorio_Q4_2024.pdf', size: '2.4 MB', type: 'pdf' }, { name: 'Dados_Financeiros_Q4.xlsx', size: '1.1 MB', type: 'xlsx' }, { name: 'Parecer_Auditoria.pdf', size: '856 KB', type: 'pdf' }], additionalFields: { entryNumber: 'ENT-2024/00456', department: 'Financeiro', value: '125.000,00 €', confidential: 'Não' } },
    { id: 2, title: 'Proposta Orçamental 2025', type: 'Documento Interno', status: 'Em edição', ref: 'DOC-2024/9012', date: '2024-03-20', entityName: '', classificationPath: 'Financeiro > Orçamentos', folderId: 3, files: [{ name: 'Proposta_Orcamental_2025.docx', size: '3.2 MB', type: 'docx' }], additionalFields: { department: 'Financeiro', value: '2.500.000,00 €', confidential: 'Sim' } },
    { id: 3, title: 'Contrato de Prestação de Serviços — ABC Consulting', type: 'Contrato', status: 'Pronto', ref: 'DOC-2024/1234', date: '2024-03-10', entityName: 'ABC Consulting, S.A.', classificationPath: 'Jurídico > Contratos > Prestação de Serviços', folderId: 4, files: [{ name: 'Contrato_Prestacao_Servicos.pdf', size: '4.2 MB', type: 'pdf' }, { name: 'Anexo_Tecnico.pdf', size: '1.8 MB', type: 'pdf' }], additionalFields: { contractNumber: 'CTR-2024/0089', department: 'Jurídico', value: '125.000,00 €' } },
    { id: 4, title: 'Ata da Reunião de Direção — 5 Março', type: 'Ata', status: 'Encerrado', ref: 'DOC-2024/3344', date: '2024-03-05', entityName: '', classificationPath: 'Administração > Atas', folderId: 6, files: [{ name: 'Ata_Direcao_05Mar.pdf', size: '1.2 MB', type: 'pdf' }], additionalFields: { meetingDate: '2024-03-05', participants: 'Direção Executiva' } },
    { id: 5, title: 'Ofício — Resposta ao Pedido de Informação', type: 'Correspondência Expedida', status: 'Pronto', ref: 'DOC-2024/5566', date: '2024-03-01', entityName: 'Câmara Municipal de Lisboa', classificationPath: 'Administração > Ofícios', folderId: 7, files: [{ name: 'Oficio_Resposta_CML.pdf', size: '890 KB', type: 'pdf' }, { name: 'Anexos_Documentais.pdf', size: '2.3 MB', type: 'pdf' }], additionalFields: { outgoingNumber: 'SAI-2024/00234', department: 'Administração' } },
    { id: 6, title: 'Memorando Interno — Política de Teletrabalho', type: 'Memorando', status: 'Pronto', ref: 'DOC-2024/6677', date: '2024-03-18', entityName: '', classificationPath: 'RH > Políticas', folderId: 8, files: [{ name: 'Memorando_Teletrabalho.pdf', size: '456 KB', type: 'pdf' }], additionalFields: { department: 'Recursos Humanos' } },
    { id: 7, title: 'Relatório Mensal Março — Departamento TI', type: 'Documento Interno', status: 'Em edição', ref: 'DOC-2024/7788', date: '2024-03-25', entityName: '', classificationPath: 'TI > Relatórios', folderId: 9, files: [{ name: 'Relatorio_TI_Marco.docx', size: '1.5 MB', type: 'docx' }], additionalFields: { department: 'TI' } },
    { id: 8, title: 'Contrato de Fornecimento de Equipamento', type: 'Contrato', status: 'Pronto', ref: 'DOC-2024/8899', date: '2024-02-28', entityName: 'TechSupply, Lda.', classificationPath: 'Jurídico > Contratos > Fornecimento', folderId: 5, files: [{ name: 'Contrato_Fornecimento_Tech.pdf', size: '3.8 MB', type: 'pdf' }], additionalFields: { contractNumber: 'CTR-2024/0076', value: '45.000,00 €', department: 'TI' } },
    { id: 9, title: 'Correspondência — Notificação Fiscal', type: 'Correspondência Recebida', status: 'Pronto', ref: 'DOC-2024/9900', date: '2024-03-12', entityName: 'Autoridade Tributária', classificationPath: 'Financeiro > Fiscal', folderId: 3, files: [{ name: 'Notificacao_AT.pdf', size: '234 KB', type: 'pdf' }], additionalFields: { entryNumber: 'ENT-2024/00467', department: 'Financeiro' } },
    { id: 10, title: 'Proposta Comercial — Rev. 3', type: 'Documento Interno', status: 'Pronto', ref: 'DOC-2024/1235', date: '2024-03-12', entityName: 'Cliente XYZ, S.A.', classificationPath: 'Comercial > Propostas', folderId: 4, files: [{ name: 'Proposta_Rev3.docx', size: '2.1 MB', type: 'docx' }], additionalFields: { value: '85.000,00 €', department: 'Comercial' } },
    { id: 11, title: 'Relatório de Auditoria Interna 2024', type: 'Documento Interno', status: 'Em edição', ref: 'DOC-2024/1100', date: '2024-03-22', entityName: '', classificationPath: 'Administração > Auditoria', folderId: 6, files: [{ name: 'Auditoria_2024_Draft.docx', size: '4.5 MB', type: 'docx' }], additionalFields: { department: 'Administração', confidential: 'Sim' } },
    { id: 12, title: 'Ofício à Segurança Social', type: 'Correspondência Expedida', status: 'Pronto', ref: 'DOC-2024/1201', date: '2024-03-08', entityName: 'Segurança Social', classificationPath: 'RH > Obrigações Legais', folderId: 8, files: [{ name: 'Oficio_SS.pdf', size: '567 KB', type: 'pdf' }], additionalFields: { outgoingNumber: 'SAI-2024/00198', department: 'RH' } },
    { id: 13, title: 'Ata da Assembleia Geral — Fevereiro', type: 'Ata', status: 'Encerrado', ref: 'DOC-2024/1302', date: '2024-02-20', entityName: '', classificationPath: 'Administração > Atas', folderId: 6, files: [{ name: 'Ata_AG_Fev2024.pdf', size: '2.0 MB', type: 'pdf' }], additionalFields: { meetingDate: '2024-02-20', participants: 'Acionistas' } },
    { id: 14, title: 'Contrato de Manutenção — Sistemas AVAC', type: 'Contrato', status: 'Pronto', ref: 'DOC-2024/1403', date: '2024-02-15', entityName: 'ClimaTech, S.A.', classificationPath: 'Jurídico > Contratos > Manutenção', folderId: 5, files: [{ name: 'Contrato_AVAC.pdf', size: '1.9 MB', type: 'pdf' }], additionalFields: { contractNumber: 'CTR-2024/0065', value: '18.000,00 €', department: 'Facilities' } },
    { id: 15, title: 'Memorando — Formação Obrigatória 2024', type: 'Memorando', status: 'Pronto', ref: 'DOC-2024/1504', date: '2024-03-01', entityName: '', classificationPath: 'RH > Formação', folderId: 8, files: [{ name: 'Memo_Formacao_2024.pdf', size: '345 KB', type: 'pdf' }], additionalFields: { department: 'RH' } },
    { id: 16, title: 'Pedido de Informação — Projeto Infraestrutura', type: 'Correspondência Expedida', status: 'Pronto', ref: 'DOC-2024/1605', date: '2024-03-19', entityName: 'Ministério das Infraestruturas', classificationPath: 'Administração > Ofícios', folderId: 7, files: [{ name: 'Pedido_Info_Infraestrutura.pdf', size: '678 KB', type: 'pdf' }], additionalFields: { outgoingNumber: 'SAI-2024/00256', department: 'Administração' } },
    { id: 17, title: 'Nota Interna — Encerramento Escritórios Páscoa', type: 'Documento Interno', status: 'Pronto', ref: 'DOC-2024/1706', date: '2024-03-20', entityName: '', classificationPath: 'Administração > Comunicações', folderId: 6, files: [{ name: 'Nota_Pascoa.pdf', size: '123 KB', type: 'pdf' }], additionalFields: { department: 'Administração' } },
    { id: 18, title: 'Correspondência — Pedido de Colaboração ANPC', type: 'Correspondência Recebida', status: 'Em edição', ref: 'DOC-2024/1807', date: '2024-03-23', entityName: 'ANPC', classificationPath: 'Administração > Correspondência', folderId: 7, files: [{ name: 'Pedido_ANPC.pdf', size: '445 KB', type: 'pdf' }], additionalFields: { entryNumber: 'ENT-2024/00489', department: 'Administração' } },
    { id: 19, title: 'Contrato ABC Consulting — Assinado', type: 'Contrato', status: 'Pronto', ref: 'DOC-2024/1908', date: '2024-03-15', entityName: 'ABC Consulting, S.A.', classificationPath: 'Jurídico > Contratos', folderId: 4, files: [{ name: 'Contrato_ABC_Assinado.pdf', size: '5.1 MB', type: 'pdf' }], additionalFields: { contractNumber: 'CTR-2024/0089', value: '125.000,00 €' } },
    { id: 20, title: 'Relatório de Despesas Q1 2024', type: 'Documento Interno', status: 'Anulado', ref: 'DOC-2024/2009', date: '2024-03-10', entityName: '', classificationPath: 'Financeiro > Relatórios', folderId: 3, files: [{ name: 'Despesas_Q1_ANULADO.xlsx', size: '980 KB', type: 'xlsx' }], additionalFields: { department: 'Financeiro' } }
  ];

  // Copy ALL 10 folders from mockup
  readonly folders: EdocFolder[] = [
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
  ];

  // Copy ALL 13 flows from mockup
  readonly flows: EdocFlow[] = [
    // INCLUDE ALL 13 FLOWS from store.flows in the mockup app.js
    // Each with their full stages arrays
    // I'll include the first few and you must include ALL 13
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
  ];

  readonly contracts: EdocContract[] = [
    {
      id: 1, title: 'IT Consulting Services Agreement', code: 'CTR-2024/001', type: 'Service', status: 'Pending Approval',
      description: 'Master services agreement for IT consulting and software development support, covering architecture review, code audit, and technical advisory services for the digital transformation program.',
      createdBy: 1, createdAt: '2024-03-10', updatedAt: '2024-03-22', startDate: '2024-04-01', endDate: '2025-03-31',
      value: 125000, currency: 'EUR', department: 'IT',
      parties: [
        { name: 'ABC Consulting, S.A.', role: 'Service Provider', taxId: 'PT509123456', contact: 'joao.silva@abc-consulting.pt' },
        { name: 'Our Company, Lda.', role: 'Client', taxId: 'PT507654321', contact: 'contracts@ourcompany.pt' }
      ],
      documents: [
        { id: 1, name: 'Contract_IT_Services_v3.pdf', size: '4.2 MB', type: 'pdf', uploadedAt: '2024-03-10', uploadedBy: 1 },
        { id: 2, name: 'Technical_Annex.pdf', size: '1.8 MB', type: 'pdf', uploadedAt: '2024-03-10', uploadedBy: 1 },
        { id: 3, name: 'Pricing_Schedule.xlsx', size: '320 KB', type: 'xlsx', uploadedAt: '2024-03-12', uploadedBy: 3 },
        { id: 4, name: 'SLA_Document.docx', size: '890 KB', type: 'docx', uploadedAt: '2024-03-15', uploadedBy: 2 }
      ],
      workflow: [
        { id: 1, name: 'Registration', type: 'review', assigneeId: 1, status: 'completed', completedAt: '2024-03-10', comments: 'Contract received and registered in the system.' },
        { id: 2, name: 'Legal Review', type: 'review', assigneeId: 2, status: 'completed', completedAt: '2024-03-12', comments: 'Legally validated. No observations.' },
        { id: 3, name: 'Financial Approval', type: 'approval', assigneeId: 1, status: 'current', completedAt: '', comments: '' },
        { id: 4, name: 'Director Signature', type: 'signature', assigneeId: 8, status: 'pending', completedAt: '', comments: '' },
        { id: 5, name: 'Archive', type: 'review', assigneeId: 6, status: 'pending', completedAt: '', comments: '' }
      ],
      tags: ['IT', 'Consulting', 'Digital Transformation'], autoRenew: true, paymentTerms: 'Net 30',
      notes: 'Priority contract for the digital transformation program. Ensure all technical annexes are reviewed by IT team lead before final approval.'
    },
    {
      id: 2, title: 'Office Lease Agreement - Lisbon HQ', code: 'CTR-2024/002', type: 'Lease', status: 'Active',
      description: 'Commercial lease for the main headquarters office space at Avenida da Liberdade, including parking and common areas.',
      createdBy: 6, createdAt: '2024-01-15', updatedAt: '2024-02-01', startDate: '2024-02-01', endDate: '2027-01-31',
      value: 216000, currency: 'EUR', department: 'Administration',
      parties: [
        { name: 'Imobiliaria Lisboa, S.A.', role: 'Landlord', taxId: 'PT501234567', contact: 'contratos@imobiliaria.pt' },
        { name: 'Our Company, Lda.', role: 'Tenant', taxId: 'PT507654321', contact: 'admin@ourcompany.pt' }
      ],
      documents: [
        { id: 5, name: 'Lease_Agreement_Signed.pdf', size: '5.1 MB', type: 'pdf', uploadedAt: '2024-02-01', uploadedBy: 6 },
        { id: 6, name: 'Floor_Plans.pdf', size: '12.3 MB', type: 'pdf', uploadedAt: '2024-01-20', uploadedBy: 6 }
      ],
      workflow: [
        { id: 1, name: 'Draft Review', type: 'review', assigneeId: 6, status: 'completed', completedAt: '2024-01-16', comments: 'Draft reviewed and approved.' },
        { id: 2, name: 'Legal Validation', type: 'review', assigneeId: 2, status: 'completed', completedAt: '2024-01-20', comments: 'All clauses validated.' },
        { id: 3, name: 'Board Approval', type: 'approval', assigneeId: 8, status: 'completed', completedAt: '2024-01-25', comments: 'Approved unanimously.' },
        { id: 4, name: 'Signing', type: 'signature', assigneeId: 8, status: 'completed', completedAt: '2024-02-01', comments: 'Signed by both parties.' }
      ],
      tags: ['Real Estate', 'HQ', 'Lisbon'], autoRenew: true, paymentTerms: 'Monthly, 5th of each month',
      notes: 'Annual rent review clause in section 7.3. Insurance must be renewed annually.'
    },
    {
      id: 3, title: 'NDA - Project Phoenix', code: 'CTR-2024/003', type: 'NDA', status: 'Pending Signature',
      description: 'Non-disclosure agreement for the confidential Project Phoenix initiative, covering all proprietary technology and business strategy information.',
      createdBy: 5, createdAt: '2024-03-18', updatedAt: '2024-03-24', startDate: '2024-04-01', endDate: '2026-03-31',
      value: 0, currency: 'EUR', department: 'IT',
      parties: [
        { name: 'TechPartner Global, Inc.', role: 'Receiving Party', taxId: 'US-EIN 82-1234567', contact: 'legal@techpartner.com' },
        { name: 'Our Company, Lda.', role: 'Disclosing Party', taxId: 'PT507654321', contact: 'legal@ourcompany.pt' }
      ],
      documents: [
        { id: 7, name: 'NDA_Phoenix_Final.pdf', size: '1.2 MB', type: 'pdf', uploadedAt: '2024-03-20', uploadedBy: 5 },
        { id: 8, name: 'Scope_Definition.docx', size: '450 KB', type: 'docx', uploadedAt: '2024-03-18', uploadedBy: 5 }
      ],
      workflow: [
        { id: 1, name: 'Drafting', type: 'review', assigneeId: 5, status: 'completed', completedAt: '2024-03-18', comments: 'NDA drafted based on standard template.' },
        { id: 2, name: 'Legal Review', type: 'review', assigneeId: 2, status: 'completed', completedAt: '2024-03-20', comments: 'Reviewed. Added clause 4.2 for IP protection.' },
        { id: 3, name: 'Internal Signature', type: 'signature', assigneeId: 1, status: 'current', completedAt: '', comments: '' },
        { id: 4, name: 'External Signature', type: 'signature', assigneeId: 8, status: 'pending', completedAt: '', comments: '' }
      ],
      tags: ['NDA', 'Confidential', 'Project Phoenix'], autoRenew: false, paymentTerms: 'N/A',
      notes: 'Ensure the partner signs within 5 business days. Follow up with legal@techpartner.com if delayed.'
    },
    {
      id: 4, title: 'Equipment Supply Contract', code: 'CTR-2024/004', type: 'Supply', status: 'Signed',
      description: 'Supply of networking and server equipment for the new data center expansion project.',
      createdBy: 5, createdAt: '2024-02-10', updatedAt: '2024-03-01', startDate: '2024-03-01', endDate: '2024-09-30',
      value: 45000, currency: 'EUR', department: 'IT',
      parties: [
        { name: 'TechSupply, Lda.', role: 'Supplier', taxId: 'PT508765432', contact: 'vendas@techsupply.pt' },
        { name: 'Our Company, Lda.', role: 'Buyer', taxId: 'PT507654321', contact: 'procurement@ourcompany.pt' }
      ],
      documents: [
        { id: 9, name: 'Supply_Contract_Signed.pdf', size: '3.8 MB', type: 'pdf', uploadedAt: '2024-03-01', uploadedBy: 5 },
        { id: 10, name: 'Equipment_List.xlsx', size: '156 KB', type: 'xlsx', uploadedAt: '2024-02-15', uploadedBy: 5 }
      ],
      workflow: [
        { id: 1, name: 'Registration', type: 'review', assigneeId: 5, status: 'completed', completedAt: '2024-02-10', comments: '' },
        { id: 2, name: 'Validation', type: 'review', assigneeId: 2, status: 'completed', completedAt: '2024-02-14', comments: '' },
        { id: 3, name: 'Approval', type: 'approval', assigneeId: 1, status: 'completed', completedAt: '2024-02-20', comments: 'Approved.' },
        { id: 4, name: 'Signature', type: 'signature', assigneeId: 8, status: 'completed', completedAt: '2024-03-01', comments: 'Signed by both parties.' }
      ],
      tags: ['Equipment', 'Data Center'], autoRenew: false, paymentTerms: 'Net 60',
      notes: 'Delivery expected in 3 batches. First batch by April 15.'
    },
    {
      id: 5, title: 'HVAC Maintenance Agreement', code: 'CTR-2024/005', type: 'Service', status: 'Expired',
      description: 'Annual maintenance contract for HVAC systems across all office locations.',
      createdBy: 7, createdAt: '2023-03-01', updatedAt: '2024-03-01', startDate: '2023-04-01', endDate: '2024-03-31',
      value: 18000, currency: 'EUR', department: 'Facilities',
      parties: [
        { name: 'ClimaTech, S.A.', role: 'Service Provider', taxId: 'PT506543210', contact: 'suporte@climatech.pt' },
        { name: 'Our Company, Lda.', role: 'Client', taxId: 'PT507654321', contact: 'facilities@ourcompany.pt' }
      ],
      documents: [
        { id: 11, name: 'HVAC_Maintenance_Contract.pdf', size: '1.9 MB', type: 'pdf', uploadedAt: '2023-03-01', uploadedBy: 7 }
      ],
      workflow: [
        { id: 1, name: 'Review', type: 'review', assigneeId: 7, status: 'completed', completedAt: '2023-03-05', comments: '' },
        { id: 2, name: 'Approval', type: 'approval', assigneeId: 1, status: 'completed', completedAt: '2023-03-10', comments: 'Approved.' },
        { id: 3, name: 'Signature', type: 'signature', assigneeId: 8, status: 'completed', completedAt: '2023-03-15', comments: '' }
      ],
      tags: ['HVAC', 'Maintenance', 'Facilities'], autoRenew: false, paymentTerms: 'Quarterly',
      notes: 'Contract expired. Renewal under negotiation with updated terms.'
    },
    {
      id: 6, title: 'Strategic Partnership Agreement', code: 'CTR-2024/006', type: 'Partnership', status: 'Draft',
      description: 'Strategic partnership framework for joint ventures in the renewable energy sector across the Iberian peninsula.',
      createdBy: 8, createdAt: '2024-03-20', updatedAt: '2024-03-25', startDate: '2024-05-01', endDate: '2029-04-30',
      value: 500000, currency: 'EUR', department: 'Executive Board',
      parties: [
        { name: 'GreenEnergy Iberia, S.L.', role: 'Partner', taxId: 'ES-B12345678', contact: 'partnerships@greenenergy.es' },
        { name: 'Our Company, Lda.', role: 'Partner', taxId: 'PT507654321', contact: 'ceo@ourcompany.pt' }
      ],
      documents: [
        { id: 12, name: 'Partnership_Draft_v1.docx', size: '2.3 MB', type: 'docx', uploadedAt: '2024-03-20', uploadedBy: 8 }
      ],
      workflow: [
        { id: 1, name: 'Drafting', type: 'review', assigneeId: 8, status: 'current', completedAt: '', comments: '' }
      ],
      tags: ['Partnership', 'Renewable Energy', 'Strategic'], autoRenew: true, paymentTerms: 'As per project milestones',
      notes: 'High priority. Board approval required before proceeding to legal review.'
    },
    {
      id: 7, title: 'HR Software License Agreement', code: 'CTR-2024/007', type: 'Service', status: 'Rejected',
      description: 'Annual license for HR management software platform including payroll, attendance, and performance modules.',
      createdBy: 4, createdAt: '2024-03-05', updatedAt: '2024-03-18', startDate: '2024-04-01', endDate: '2025-03-31',
      value: 35000, currency: 'EUR', department: 'Human Resources',
      parties: [
        { name: 'HRTech Solutions, Lda.', role: 'Licensor', taxId: 'PT509876543', contact: 'sales@hrtech.pt' },
        { name: 'Our Company, Lda.', role: 'Licensee', taxId: 'PT507654321', contact: 'hr@ourcompany.pt' }
      ],
      documents: [
        { id: 13, name: 'License_Agreement.pdf', size: '2.1 MB', type: 'pdf', uploadedAt: '2024-03-05', uploadedBy: 4 }
      ],
      workflow: [
        { id: 1, name: 'Submission', type: 'review', assigneeId: 4, status: 'completed', completedAt: '2024-03-05', comments: 'Submitted for review.' },
        { id: 2, name: 'IT Review', type: 'review', assigneeId: 5, status: 'completed', completedAt: '2024-03-10', comments: 'Security concerns with data hosting location.' },
        { id: 3, name: 'Approval', type: 'approval', assigneeId: 1, status: 'rejected', completedAt: '2024-03-18', comments: 'Rejected: vendor does not comply with GDPR hosting requirements. Please find alternative vendor.' }
      ],
      tags: ['Software', 'HR', 'License'], autoRenew: false, paymentTerms: 'Annual upfront',
      notes: 'Rejected due to GDPR non-compliance. HR team exploring alternative vendors.'
    },
    {
      id: 8, title: 'Cleaning Services Contract', code: 'CTR-2024/008', type: 'Service', status: 'Cancelled',
      description: 'Daily cleaning services for office premises including sanitization and waste management.',
      createdBy: 6, createdAt: '2024-01-10', updatedAt: '2024-02-28', startDate: '2024-02-01', endDate: '2025-01-31',
      value: 24000, currency: 'EUR', department: 'Facilities',
      parties: [
        { name: 'LimpaPro, Lda.', role: 'Service Provider', taxId: 'PT502345678', contact: 'geral@limpapro.pt' },
        { name: 'Our Company, Lda.', role: 'Client', taxId: 'PT507654321', contact: 'facilities@ourcompany.pt' }
      ],
      documents: [
        { id: 14, name: 'Cleaning_Contract.pdf', size: '1.5 MB', type: 'pdf', uploadedAt: '2024-01-10', uploadedBy: 6 }
      ],
      workflow: [
        { id: 1, name: 'Review', type: 'review', assigneeId: 6, status: 'completed', completedAt: '2024-01-12', comments: '' },
        { id: 2, name: 'Approval', type: 'approval', assigneeId: 1, status: 'completed', completedAt: '2024-01-15', comments: 'Approved.' },
        { id: 3, name: 'Signature', type: 'signature', assigneeId: 8, status: 'completed', completedAt: '2024-01-20', comments: '' }
      ],
      tags: ['Cleaning', 'Facilities'], autoRenew: false, paymentTerms: 'Monthly',
      notes: 'Contract cancelled due to service quality issues. New vendor procurement in progress.'
    }
  ];

  readonly notifications: EdocNotification[] = [
    { id: 1, text: 'João Silva enviou etapa "Parecer" de PROC-2024/3456', time: '2024-03-25 14:45', read: false, type: 'flow', refId: 4 },
    { id: 2, text: 'Novo documento registado: Relatório Mensal Março', time: '2024-03-25 13:00', read: false, type: 'doc', refId: 7 },
    { id: 3, text: 'Prazo a vencer amanhã: Aprovação Contrato ABC', time: '2024-03-25 09:00', read: false, type: 'deadline', refId: 1 },
    { id: 4, text: 'Ana Oliveira terminou pasta "Projeto Beta — Fase 1"', time: '2024-03-25 12:00', read: false, type: 'folder', refId: 9 },
    { id: 5, text: 'Fluxo PROC-2024/7788 terminado com sucesso', time: '2024-03-22 09:00', read: false, type: 'flow', refId: 3 },
    { id: 6, text: 'Pedro Costa adicionou ficheiro a DOC-2024/4455', time: '2024-03-25 11:00', read: true, type: 'doc', refId: 8 }
  ];

  readonly activities: EdocActivity[] = [
    { id: 1, userId: 2, action: 'enviou etapa "Parecer" de', target: 'PROC-2024/3456', targetType: 'flow', targetId: 4, time: '2024-03-25 14:45' },
    { id: 2, userId: 3, action: 'registou', target: 'Relatório Mensal Março', targetType: 'doc', targetId: 7, time: '2024-03-25 13:00' },
    { id: 3, userId: 4, action: 'terminou pasta', target: 'Projeto Beta — Fase 1', targetType: 'folder', targetId: 9, time: '2024-03-25 12:00' },
    { id: 4, userId: 5, action: 'adicionou ficheiro a', target: 'DOC-2024/4455', targetType: 'doc', targetId: 8, time: '2024-03-25 11:00' },
    { id: 5, userId: 1, action: 'aprovou etapa de', target: 'PROC-2024/8900', targetType: 'flow', targetId: 8, time: '2024-03-24 16:00' },
    { id: 6, userId: 6, action: 'criou pasta', target: 'Administração > Atas 2024', targetType: 'folder', targetId: 6, time: '2024-03-24 10:00' },
    { id: 7, userId: 8, action: 'assinou', target: 'Contrato TechSupply', targetType: 'doc', targetId: 8, time: '2024-03-23 14:00' },
    { id: 8, userId: 7, action: 'devolveu etapa de', target: 'PROC-2024/1404', targetType: 'flow', targetId: 9, time: '2024-03-23 09:00' }
  ];

  // Helper methods
  getUser(id: number): EdocUser {
    return this.users.find(u => u.id === id) ?? { id: 0, name: 'Sistema', initials: 'SIS', dept: '', gradient: 'linear-gradient(135deg,#94A3B8,#64748B)' };
  }

  getFolder(id: number): EdocFolder | undefined {
    return this.folders.find(f => f.id === id);
  }

  getSubfolders(parentId: number | null): EdocFolder[] {
    return this.folders.filter(f => f.parentId === parentId);
  }

  getRootFolders(): EdocFolder[] {
    return this.folders.filter(f => f.parentId === null);
  }

  getDocsByFolder(folderId: number): EdocDocument[] {
    return this.documents.filter(d => d.folderId === folderId);
  }

  getFlowsByFolder(folderId: number): EdocFlow[] {
    return this.flows.filter(f => f.folderId === folderId);
  }

  getPendingTasks(): EdocFlow[] {
    return this.flows.filter(f => {
      if (f.status !== 'Pendente') return false;
      const currentStage = f.stages.find(s => s.status === 'current');
      return currentStage?.userId === 1;
    });
  }

  getUrgentTasks(): EdocFlow[] {
    return this.getPendingTasks().filter(f => this.daysUntilDeadline(f.deadline) <= 2);
  }

  daysUntilDeadline(deadline: string | null): number {
    if (!deadline) return 999;
    const now = new Date();
    const dl = new Date(deadline);
    return Math.ceil((dl.getTime() - now.getTime()) / 86400000);
  }

  getUnreadNotifications(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  getContract(id: number): EdocContract | undefined {
    return this.contracts.find(c => c.id === id);
  }

  formatCurrency(value: number, currency: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  }

  daysUntilExpiry(endDate: string): number {
    const now = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - now.getTime()) / 86400000);
  }

  searchAll(query: string): { documents: EdocDocument[]; folders: EdocFolder[]; flows: EdocFlow[] } {
    if (!query || query.length < 2) return { documents: [], folders: [], flows: [] };
    const q = query.toLowerCase();
    return {
      documents: this.documents.filter(d => d.title.toLowerCase().includes(q) || d.ref.toLowerCase().includes(q) || d.type.toLowerCase().includes(q) || d.entityName?.toLowerCase().includes(q)),
      folders: this.folders.filter(f => f.name.toLowerCase().includes(q)),
      flows: this.flows.filter(f => f.title.toLowerCase().includes(q) || f.ref.toLowerCase().includes(q) || f.type.toLowerCase().includes(q))
    };
  }
}
