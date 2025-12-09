export class DataUtil{
   static truncateDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;   

    }
    
    static converterDataISOparaYYYYMMDD(dataISO: string): string {
        const data = new Date(dataISO);
        return DataUtil.truncateDate(data);
    }

    /**
   * Converte uma data no formato YYYY-MM-DD para DD/MM/YYYY.
   * @param dateStr A string da data no formato YYYY-MM-DD.
   * @returns A data no formato DD/MM/YYYY.
   */
  static formatToBrazilianDate(dateStr: string): string {
    if (!dateStr) {
      throw new Error('A data não pode ser vazia.');
    }

    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) {
      throw new Error('Formato de data inválido. Esperado YYYY-MM-DD.');
    }

    return `${day}/${month}/${year}`;
  }

  static obterDiasSemana(): any[]{
    return  [
    {id: 0, descricao: 'Domingo'},
    {id: 1,descricao: 'Segunda-feira'},
    {id: 2, descricao: 'Terça-feira'},
    {id: 3, descricao: 'Quarta-feira'},
    {id: 4, descricao: 'Quinta-feira'},
    {id: 5, descricao: 'Sexta-feira'},
    {id: 6,descricao: 'Sábado' }];
  }

  static obterPeriodos(){
    return [{
        id: 7,
        descricao: 'Semanal'
      }];
    }
}