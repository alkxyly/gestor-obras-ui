// ibge.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Estado {
    id: number;
    sigla: string;
    nome: string;
}

export interface Cidade {
    id: number;
    nome: string;
}

@Injectable({ providedIn: 'root' })
export class IbgeService {
    private readonly API = 'https://servicodados.ibge.gov.br/api/v1/localidades';

    constructor(private http: HttpClient) { }

    getEstados(): Observable<Estado[]> {
        return this.http.get<Estado[]>(`${this.API}/estados?orderBy=nome`);
    }

    getCidadesPorEstado(ufId: number): Observable<Cidade[]> {
        return this.http.get<Cidade[]>(`${this.API}/estados/${ufId}/municipios?orderBy=nome`);
    }
}