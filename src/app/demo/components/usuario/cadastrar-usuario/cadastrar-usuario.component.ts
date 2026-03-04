import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/demo/service/usuario.service';

@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.scss'],
  providers: [MessageService]
})
export class CadastrarUsuarioComponent implements OnInit {

  usuarioForm: FormGroup;

  perfis = [
    { label: 'Administrador', value: 'ADMINISTRADOR' },
    { label: 'Engenheiro', value: 'ENGENHEIRO' },
    { label: 'Encarregado', value: 'ENCARREGADO' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpfCnpj: ['', Validators.required],
      telefone: [''],
      senha: ['', Validators.required],
      confirmacaoSenha: ['', Validators.required],
      cargo: ['', Validators.required],
      perfil: [''],
      ativo: [true]
    }, { validators: this.senhasIguaisValidator });
  }

  get f() { return this.usuarioForm.controls; }

  senhasIguaisValidator(control: AbstractControl): ValidationErrors | null {
    const senha = control.get('senha')?.value;
    const confirmacaoSenha = control.get('confirmacaoSenha')?.value;

    if (senha && confirmacaoSenha && senha !== confirmacaoSenha) {
      return { senhasDiferentes: true };
    }
    return null;
  }

  salvar() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const usuarioData = { ...this.usuarioForm.value };

    if (usuarioData.cpfCnpj) {
      usuarioData.cpfCnpj = usuarioData.cpfCnpj.replace(/\D/g, '');
    }

    this.usuarioService.cadastrar(usuarioData).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso!' });
        setTimeout(() => {
          this.router.navigate(['/usuarios/listar-usuarios']);
        }, 1000);
      }
    });
  }
}
