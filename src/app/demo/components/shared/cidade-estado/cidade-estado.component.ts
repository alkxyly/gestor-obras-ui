import { Component, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Cidade, Estado, IbgeService } from 'src/app/demo/service/ibge.service';

@Component({
  selector: 'app-select-localidade',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CidadeEstadoComponent),
      multi: true
    }
  ],
  template: `
    <div [formGroup]="group" class="grid p-fluid">
      <div class="col-12 md:col-6">
        <p-dropdown 
          [options]="estados" 
          formControlName="estado" 
          optionLabel="nome" 
          placeholder="Estado"
          [filter]="true"
          filterBy="nome"
          [showClear]="true"
          (onChange)="onEstadoChange($event)">
        </p-dropdown>
      </div>
      <div class="col-12 md:col-6">
        <p-dropdown 
          [options]="cidades" 
          formControlName="cidade" 
          optionLabel="nome" 
          placeholder="Cidade"
          [filter]="true" 
          filterBy="nome" 
          [showClear]="true">
        </p-dropdown>
      </div>
    </div>
  `
})
export class CidadeEstadoComponent implements ControlValueAccessor, OnInit, OnDestroy {
  group: FormGroup;
  estados: Estado[] = [];
  cidades: Cidade[] = [];
  loadingCidades = false;
  private sub = new Subscription();

  // Funções do ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private fb: FormBuilder, private ibgeService: IbgeService) {
    this.group = this.fb.group({
      estado: [null, Validators.required],
      cidade: [{ value: null, disabled: true }, Validators.required]
    });
  }

  ngOnInit() {
    this.ibgeService.getEstados().subscribe(res => {
        this.estados = res;
        if (this._pendingWriteValue) {
           this.writeValue(this._pendingWriteValue);
           this._pendingWriteValue = null;
        }
    });

    // Notifica o formulário pai sempre que houver mudança interna
    this.sub.add(
      this.group.valueChanges.subscribe(val => {
        this.onChange(val);
        this.onTouched();
      })
    );
  }

  onEstadoChange(event: any) {
    const estado = event.value;
    const cidadeCtrl = this.group.get('cidade');

    if (estado) {
      this.loadingCidades = true;
      cidadeCtrl?.reset();
      this.ibgeService.getCidadesPorEstado(estado.id).subscribe(res => {
        this.cidades = res;
        cidadeCtrl?.enable();
        this.loadingCidades = false;
      });
    }
  }
  _pendingWriteValue: any = null;
  writeValue(obj: any): void { 
      if (!obj) {
          this.group.reset({}, { emitEvent: false });
          return;
      }
      
      if (this.estados.length === 0) {
          this._pendingWriteValue = obj;
          return;
      }

      const siglaOuNomeEstado = obj.estado?.sigla || (typeof obj.estado === 'string' ? obj.estado : obj.estado?.nome);
      const nomeCidade = obj.cidade?.nome || (typeof obj.cidade === 'string' ? obj.cidade : null);

      const foundEstado = this.estados.find(e => e.sigla === siglaOuNomeEstado || e.nome === siglaOuNomeEstado);
      if (foundEstado) {
          this.group.get('estado')?.setValue(foundEstado, { emitEvent: false });
          
          this.loadingCidades = true;
          this.ibgeService.getCidadesPorEstado(foundEstado.id).subscribe(res => {
              this.cidades = res;
              this.group.get('cidade')?.enable({ emitEvent: false });
              this.loadingCidades = false;
              
              if (nomeCidade) {
                 const foundCidade = this.cidades.find(c => c.nome === nomeCidade);
                 this.group.get('cidade')?.setValue(foundCidade || { nome: nomeCidade }, { emitEvent: false });
              }
          });
      } else {
          this.group.patchValue(obj, { emitEvent: false });
      }
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { isDisabled ? this.group.disable() : this.group.enable(); }

  ngOnDestroy() { this.sub.unsubscribe(); }
}