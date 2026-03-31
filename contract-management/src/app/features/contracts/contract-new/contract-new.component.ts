import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Party {
  name: string;
  role: string;
  taxId: string;
  contact: string;
}

interface UploadedFile {
  name: string;
  size: string;
  type: string;
}

@Component({
  selector: 'app-contract-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <button class="back-link" (click)="goBack()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Contracts
          </button>
          <h1>New Contract</h1>
          <p class="subtitle">Fill in the details below to create a new contract.</p>
        </div>
      </div>

      <!-- Section 1: General Information -->
      <div class="glass-card">
        <div class="section-header">
          <div class="section-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <h2>General Information</h2>
            <p>Basic contract details</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group col-span-2">
            <label for="title">Title <span class="required">*</span></label>
            <input id="title" type="text" [(ngModel)]="form.title" placeholder="Enter contract title" class="form-input" />
          </div>

          <div class="form-group">
            <label for="type">Type <span class="required">*</span></label>
            <select id="type" [(ngModel)]="form.type" class="form-input">
              <option value="">Select type...</option>
              <option *ngFor="let t of contractTypes" [value]="t">{{ t }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="department">Department <span class="required">*</span></label>
            <select id="department" [(ngModel)]="form.department" class="form-input">
              <option value="">Select department...</option>
              <option *ngFor="let d of departments" [value]="d">{{ d }}</option>
            </select>
          </div>

          <div class="form-group col-span-2">
            <label for="description">Description</label>
            <textarea id="description" [(ngModel)]="form.description" placeholder="Describe the contract scope and objectives..." class="form-input textarea" rows="3"></textarea>
          </div>
        </div>
      </div>

      <!-- Section 2: Dates & Value -->
      <div class="glass-card">
        <div class="section-header">
          <div class="section-icon icon-amber">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h2>Dates & Value</h2>
            <p>Contract timeline and financial details</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="startDate">Start Date <span class="required">*</span></label>
            <input id="startDate" type="date" [(ngModel)]="form.startDate" class="form-input" />
          </div>

          <div class="form-group">
            <label for="endDate">End Date <span class="required">*</span></label>
            <input id="endDate" type="date" [(ngModel)]="form.endDate" class="form-input" />
          </div>

          <div class="form-group">
            <label for="value">Contract Value</label>
            <input id="value" type="number" [(ngModel)]="form.value" placeholder="0.00" class="form-input" min="0" step="0.01" />
          </div>

          <div class="form-group">
            <label for="currency">Currency</label>
            <select id="currency" [(ngModel)]="form.currency" class="form-input">
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - US Dollar</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div class="form-group">
            <label for="paymentTerms">Payment Terms</label>
            <input id="paymentTerms" type="text" [(ngModel)]="form.paymentTerms" placeholder="e.g. Net 30" class="form-input" />
          </div>

          <div class="form-group toggle-group">
            <label>Auto-Renew</label>
            <div class="toggle-wrap" (click)="form.autoRenew = !form.autoRenew">
              <div class="toggle" [class.active]="form.autoRenew">
                <div class="toggle-knob"></div>
              </div>
              <span class="toggle-label">{{ form.autoRenew ? 'Enabled' : 'Disabled' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Parties -->
      <div class="glass-card">
        <div class="section-header">
          <div class="section-icon icon-purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div>
            <h2>Parties</h2>
            <p>Organizations or individuals involved</p>
          </div>
        </div>

        <div class="parties-list">
          <div *ngFor="let party of form.parties; let i = index" class="party-row">
            <div class="party-number">{{ i + 1 }}</div>
            <div class="party-fields">
              <div class="form-group">
                <label>Name <span class="required">*</span></label>
                <input type="text" [(ngModel)]="party.name" placeholder="Organization or person name" class="form-input" />
              </div>
              <div class="form-group">
                <label>Role</label>
                <select [(ngModel)]="party.role" class="form-input">
                  <option value="Client">Client</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>
              <div class="form-group">
                <label>Tax ID</label>
                <input type="text" [(ngModel)]="party.taxId" placeholder="Tax identification number" class="form-input" />
              </div>
              <div class="form-group">
                <label>Contact</label>
                <input type="text" [(ngModel)]="party.contact" placeholder="Email or phone" class="form-input" />
              </div>
            </div>
            <button class="remove-party-btn" (click)="removeParty(i)" *ngIf="form.parties.length > 1" title="Remove party">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <button class="add-btn" (click)="addParty()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Party
        </button>
      </div>

      <!-- Section 4: Documents -->
      <div class="glass-card">
        <div class="section-header">
          <div class="section-icon icon-emerald">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <div>
            <h2>Documents</h2>
            <p>Attach relevant files to the contract</p>
          </div>
        </div>

        <div class="upload-area" (click)="fileInput.click()"
             (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)"
             [class.drag-active]="isDragOver">
          <input #fileInput type="file" multiple (change)="onFileSelect($event)" style="display:none" />
          <div class="upload-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <p class="upload-text">Drag and drop files here, or <span class="upload-link">browse</span></p>
          <p class="upload-hint">PDF, DOCX, XLSX up to 25MB each</p>
        </div>

        <div class="file-list" *ngIf="uploadedFiles.length > 0">
          <div class="file-item" *ngFor="let file of uploadedFiles; let i = index">
            <div class="file-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div class="file-info">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
            </div>
            <button class="file-remove" (click)="removeFile(i)" title="Remove file">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Section 5: Notes -->
      <div class="glass-card">
        <div class="section-header">
          <div class="section-icon icon-slate">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <h2>Additional Notes</h2>
            <p>Any extra information or internal remarks</p>
          </div>
        </div>

        <div class="form-group">
          <textarea [(ngModel)]="form.notes" placeholder="Add any relevant notes, internal references, or special conditions..." class="form-input textarea" rows="4"></textarea>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="form-footer">
        <button class="btn btn-outline" (click)="goBack()">Cancel</button>
        <button class="btn btn-outline" (click)="saveAsDraft()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save as Draft
        </button>
        <button class="btn btn-primary" (click)="submitForApproval()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          Submit for Approval
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --glass-bg: rgba(255, 255, 255, 0.65);
      --glass-blur: 16px;
      --glass-border: rgba(255, 255, 255, 0.35);
      --teal-400: #2dd4bf;
      --teal-500: #14b8a6;
      --teal-600: #0d9488;
      --teal-700: #0f766e;
      --teal-50: rgba(20, 184, 166, 0.06);
      --teal-100: rgba(20, 184, 166, 0.12);
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
      --gray-500: #6b7280;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --gray-900: #111827;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
      --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --radius-xl: 18px;
      --radius-full: 9999px;
      --hero-gradient: linear-gradient(135deg, #0d9488, #14b8a6, #2dd4bf);
      display: block;
    }

    .page {
      max-width: 820px;
      margin: 0 auto;
      padding: 0 0 40px;
    }

    /* Page Header */
    .page-header {
      margin-bottom: 28px;
    }
    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      background: none; border: none; cursor: pointer;
      color: var(--gray-400); font-size: 13px; font-weight: 500;
      padding: 0; margin-bottom: 8px;
      transition: color 200ms;
    }
    .back-link:hover { color: var(--teal-500); }
    h1 {
      margin: 0; font-size: 26px; font-weight: 800;
      color: var(--gray-900); letter-spacing: -0.03em;
    }
    .subtitle {
      margin: 4px 0 0; font-size: 14px; color: var(--gray-400);
    }

    /* Glass Cards */
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: 28px;
      margin-bottom: 16px;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 250ms;
    }
    .glass-card:hover {
      box-shadow: var(--shadow-md);
    }

    /* Section Header */
    .section-header {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 22px;
    }
    .section-icon {
      width: 42px; height: 42px; border-radius: 11px;
      background: var(--teal-50);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      color: var(--teal-600);
    }
    .section-icon.icon-amber { background: rgba(245,158,11,0.08); color: #d97706; }
    .section-icon.icon-purple { background: rgba(139,92,246,0.08); color: #7c3aed; }
    .section-icon.icon-emerald { background: rgba(16,185,129,0.08); color: #059669; }
    .section-icon.icon-slate { background: rgba(100,116,139,0.08); color: #475569; }
    .section-header h2 {
      margin: 0; font-size: 16px; font-weight: 700; color: var(--gray-800);
    }
    .section-header p {
      margin: 2px 0 0; font-size: 12px; color: var(--gray-400);
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .col-span-2 { grid-column: span 2; }

    .form-group {
      display: flex; flex-direction: column; gap: 6px;
    }
    .form-group label {
      font-size: 12px; font-weight: 600; color: var(--gray-600);
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .required { color: #ef4444; }

    .form-input {
      padding: 10px 14px;
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: 14px; color: var(--gray-800);
      background: rgba(255,255,255,0.7);
      transition: border-color 200ms, box-shadow 200ms;
      outline: none;
      font-family: inherit;
    }
    .form-input:focus {
      border-color: var(--teal-400);
      box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
    }
    .form-input::placeholder { color: var(--gray-300); }
    .form-input.textarea { resize: vertical; min-height: 60px; }
    select.form-input { cursor: pointer; }

    /* Toggle */
    .toggle-group { justify-content: flex-start; }
    .toggle-wrap {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      padding-top: 2px;
    }
    .toggle {
      width: 44px; height: 24px;
      border-radius: var(--radius-full);
      background: var(--gray-200);
      position: relative;
      transition: background 200ms;
    }
    .toggle.active { background: var(--teal-500); }
    .toggle-knob {
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
      position: absolute;
      top: 3px; left: 3px;
      transition: transform 200ms;
    }
    .toggle.active .toggle-knob { transform: translateX(20px); }
    .toggle-label { font-size: 13px; color: var(--gray-500); }

    /* Parties */
    .parties-list {
      display: flex; flex-direction: column; gap: 12px;
      margin-bottom: 16px;
    }
    .party-row {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 16px;
      background: rgba(255,255,255,0.5);
      border: 1px solid var(--gray-100);
      border-radius: var(--radius-lg);
    }
    .party-number {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--teal-50); color: var(--teal-600);
      font-size: 12px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 20px;
    }
    .party-fields {
      flex: 1; display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .remove-party-btn {
      background: none; border: none; cursor: pointer;
      color: var(--gray-300); padding: 4px; margin-top: 20px;
      border-radius: var(--radius-sm);
      transition: color 200ms, background 200ms;
    }
    .remove-party-btn:hover { color: #ef4444; background: rgba(239,68,68,0.06); }

    .add-btn {
      display: inline-flex; align-items: center; gap: 8px;
      background: none; border: 1px dashed var(--gray-300);
      border-radius: var(--radius-md);
      padding: 10px 20px;
      color: var(--teal-600); font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 200ms;
    }
    .add-btn:hover {
      border-color: var(--teal-400);
      background: var(--teal-50);
    }

    /* Upload Area */
    .upload-area {
      border: 2px dashed var(--gray-200);
      border-radius: var(--radius-lg);
      padding: 36px 24px;
      text-align: center;
      cursor: pointer;
      transition: all 250ms;
      background: rgba(255,255,255,0.4);
    }
    .upload-area:hover, .upload-area.drag-active {
      border-color: var(--teal-400);
      background: var(--teal-50);
    }
    .upload-icon { color: var(--gray-300); margin-bottom: 10px; }
    .upload-area:hover .upload-icon,
    .upload-area.drag-active .upload-icon { color: var(--teal-500); }
    .upload-text {
      margin: 0 0 4px; font-size: 14px; color: var(--gray-500);
    }
    .upload-link { color: var(--teal-600); font-weight: 600; text-decoration: underline; }
    .upload-hint {
      margin: 0; font-size: 12px; color: var(--gray-400);
    }

    /* File List */
    .file-list {
      margin-top: 14px;
      display: flex; flex-direction: column; gap: 6px;
    }
    .file-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.6);
      border: 1px solid var(--gray-100);
      border-radius: var(--radius-md);
    }
    .file-icon { color: var(--teal-500); flex-shrink: 0; }
    .file-info { flex: 1; display: flex; align-items: center; gap: 10px; min-width: 0; }
    .file-name {
      font-size: 13px; font-weight: 600; color: var(--gray-700);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .file-size { font-size: 11px; color: var(--gray-400); flex-shrink: 0; }
    .file-remove {
      background: none; border: none; cursor: pointer;
      color: var(--gray-300); padding: 4px;
      border-radius: var(--radius-sm);
      transition: color 200ms;
    }
    .file-remove:hover { color: #ef4444; }

    /* Footer */
    .form-footer {
      display: flex; align-items: center; justify-content: flex-end;
      gap: 10px; padding-top: 12px;
    }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 11px 24px;
      border-radius: var(--radius-md);
      font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 200ms;
      border: none;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid var(--gray-200);
      color: var(--gray-600);
    }
    .btn-outline:hover {
      border-color: var(--gray-300);
      background: var(--gray-50);
    }
    .btn-primary {
      background: var(--hero-gradient);
      color: #fff;
      box-shadow: 0 2px 8px rgba(13,148,136,0.3);
    }
    .btn-primary:hover {
      box-shadow: 0 4px 16px rgba(13,148,136,0.4);
      transform: translateY(-1px);
    }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .col-span-2 { grid-column: span 1; }
      .party-fields { grid-template-columns: 1fr; }
      .form-footer { flex-direction: column; }
      .form-footer .btn { width: 100%; justify-content: center; }
    }
  `]
})
export class ContractNewComponent {

  contractTypes = [
    'Service Agreement', 'Supply Contract', 'NDA', 'Lease',
    'Consulting', 'Partnership', 'Maintenance', 'License'
  ];

  departments = [
    'Legal', 'Finance', 'IT', 'Human Resources',
    'Administration', 'Commercial', 'Operations'
  ];

  form = {
    title: '',
    type: '',
    department: '',
    description: '',
    startDate: '',
    endDate: '',
    value: null as number | null,
    currency: 'EUR',
    paymentTerms: '',
    autoRenew: false,
    parties: [{ name: '', role: 'Client', taxId: '', contact: '' }] as Party[],
    notes: ''
  };

  uploadedFiles: UploadedFile[] = [];
  isDragOver = false;

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/app/contracts']);
  }

  addParty(): void {
    this.form.parties.push({ name: '', role: 'Client', taxId: '', contact: '' });
  }

  removeParty(index: number): void {
    this.form.parties.splice(index, 1);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addFiles(input.files);
    }
    input.value = '';
  }

  private addFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sizeStr = f.size < 1024 * 1024
        ? (f.size / 1024).toFixed(0) + ' KB'
        : (f.size / (1024 * 1024)).toFixed(1) + ' MB';
      this.uploadedFiles.push({
        name: f.name,
        size: sizeStr,
        type: f.name.split('.').pop() || 'file'
      });
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  saveAsDraft(): void {
    const data = { ...this.form, files: this.uploadedFiles, status: 'draft' };
    console.log('Save as Draft:', data);
  }

  submitForApproval(): void {
    const data = { ...this.form, files: this.uploadedFiles, status: 'pending_approval' };
    console.log('Submit for Approval:', data);
  }
}
