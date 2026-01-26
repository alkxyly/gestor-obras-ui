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
    this.ibgeService.getEstados().subscribe(res => this.estados = res);

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
  writeValue(obj: any): void { if (obj) this.group.patchValue(obj, { emitEvent: false }); }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { isDisabled ? this.group.disable() : this.group.enable(); }

  ngOnDestroy() { this.sub.unsubscribe(); }
}