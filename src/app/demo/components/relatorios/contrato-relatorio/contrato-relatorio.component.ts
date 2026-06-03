import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ContratoService } from 'src/app/demo/service/contrato.service';
import { ContratoDTO, OcorrenciaTotalDTO, QuilometroPercorridoDTO } from '../../core/model';
import { ContratoRelatorioService } from 'src/app/demo/service/contrato-relatorio.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


interface ContractSummary {
  valorProduzido: number;
  totalRelatorios: number;
  mediaDiaria: number;
}


@Component({
  selector: 'app-contrato-relatorio',
  templateUrl: './contrato-relatorio.component.html',
  styleUrl: './contrato-relatorio.component.scss'
})
export class ContratoRelatorioComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  contratos: ContratoDTO[] = [];
  usuariosKm: QuilometroPercorridoDTO[] = [];
  ocorrenciaTotal: OcorrenciaTotalDTO[] = [];

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private contratoService: ContratoService,
    private contratoRelatorioService: ContratoRelatorioService) {
    this.initForm();
  }

  private initForm() {
    this.filterForm = this.fb.group({
      contratoId: [null, Validators.required],
      dateRange: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.carregarContratos();

  }



  private carregarContratos() {
    this.contratoService.listarPorResponsavel().subscribe((contratos) => {
      this.contratos = contratos;
    })
  }

  onFilter() {
    if (this.filterForm.invalid) {
      // Aqui você poderia disparar um Toast do PrimeNG
      return;
    }

    const { contratoId, dateRange } = this.filterForm.value;

    const formatData = (d: Date) => d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';
    const dataInicio = formatData(dateRange[0]);
    const dataFim = formatData(dateRange[1]);

    console.log('Buscando dados para o contrato:', contratoId, 'no período:', dataInicio, 'até', dataFim);

    this.contratoRelatorioService.listarContratoRelatorio(contratoId, dataInicio, dataFim).subscribe((response) => {
      this.usuariosKm = response.quilometrosPercorridos;
      this.ocorrenciaTotal = response.ocorrenciaTotal;
    })
  }


  exportPdf() {
    try {
      const doc = new jsPDF('p', 'pt', 'a4');

      doc.setFontSize(16);
      doc.text('Relatório de Contrato', 40, 40);

      doc.setFontSize(12);
      doc.text('Resumo do Usuário', 40, 70);

      const columnsUsuario = [
        { header: 'Usuário', dataKey: 'nome' },
        { header: 'Quilômetros', dataKey: 'total' },
        { header: 'Valor Produzido', dataKey: 'valorProduzido' },
        { header: 'Dias Sol', dataKey: 'qtdDiasSol' },
        { header: 'Dias Chuva', dataKey: 'qtdDiasChuvoso' },
        { header: 'Dias Nublados', dataKey: 'qtdDiasNublado' }
      ];

      const rowsUsuario = this.usuariosKm.map(u => ({
        nome: u.nome,
        total: u.total ? `${u.total} km` : '0 km',
        valorProduzido: u.valorProduzido != null ? `R$ ${u.valorProduzido.toFixed(2)}` : 'R$ 0.00',
        qtdDiasSol: u.qtdDiasSol || 0,
        qtdDiasChuvoso: u.qtdDiasChuvoso || 0,
        qtdDiasNublado: u.qtdDiasNublado || 0
      }));

      autoTable(doc, {
        columns: columnsUsuario,
        body: rowsUsuario,
        startY: 80,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      const finalYUsuario = (doc as any).lastAutoTable.finalY || 80;

      doc.text('Resumo de Ocorrências', 40, finalYUsuario + 30);

      const columnsOcorrencia = [
        { header: 'Ocorrência', dataKey: 'descricao' },
        { header: 'Quantidade', dataKey: 'total' },
        { header: 'Valor Unitário', dataKey: 'valor' },
        { header: 'Valor Total', dataKey: 'valor_total' }
      ];

      const rowsOcorrencia = this.ocorrenciaTotal.map(o => ({
        descricao: o.descricao,
        total: o.total,
        valor: o.valor != null ? `R$ ${o.valor.toFixed(2)}` : 'R$ 0.00',
        valor_total: o.valor_total != null ? `R$ ${o.valor_total.toFixed(2)}` : 'R$ 0.00'
      }));

      autoTable(doc, {
        columns: columnsOcorrencia,
        body: rowsOcorrencia,
        startY: finalYUsuario + 40,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      doc.save('relatorio_contrato.pdf');
    } catch (e) {
      console.error('Erro ao exportar PDF:', e);
    }
  }

  exportExcel() {
    console.log('Exportando relatório em Excel...');
    // TODO: Adicionar lógica para gerar/baixar o Excel
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
