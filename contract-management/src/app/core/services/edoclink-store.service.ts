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
