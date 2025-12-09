import { CadastrarLocatarioDTO, Endereco } from "../model";

export class LocatarioMapper{

    static toCadastrarLocatarioDTO(formValues: any): CadastrarLocatarioDTO{
        const endereco = new Endereco();
        endereco.logradouro = formValues.logradouro; 
        endereco.bairro = formValues.bairro; 
        endereco.cidade = formValues.cidade;
        endereco.estado = formValues.estado;
        endereco.numero = formValues.numero;
        endereco.complemento = formValues.complemento; 
        endereco.cep = formValues.cep; 
        
        const locatario = new CadastrarLocatarioDTO(); 
        locatario.nome = formValues.nome; 
        locatario.email = formValues.email; 
        locatario.celular = formValues.celular.replace(/\D/g, '');   
        locatario.cnh = formValues.cnh; 
        locatario.cpf = formValues.cpf.replace(/\D/g, ''); 
        locatario.rg = formValues.rg; 
        locatario.dataNascimento = formValues.dataNascimento;
        locatario.dataVencimentoCnh = formValues.dataVencimentoCnh;
        locatario.endereco = endereco;
        return locatario;
      }
}

