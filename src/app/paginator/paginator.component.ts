import { Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginator;
  muestreo:string;
  paginas: number[];
  desde: number;
  hasta: number;
  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
    
  }

  ngOnChanges(changes: SimpleChanges ){
    let paginadorActualizado = changes['paginator'];
    if (paginadorActualizado.previousValue){
      this.initPaginator();
    }

  }
  

  private initPaginator():void{
    // mostrar un paginador que se contraiga y expanda automaticamente
    let paginaActual = this.paginator.number;
    let totalPaginas = this.paginator.totalPages;
    let a = Math.max(1, paginaActual-4);
    let b = Math.min(totalPaginas, paginaActual + 4);
    this.desde = Math.min(a, totalPaginas -5);
    this.hasta = Math.max(b ,6);
    // cuantas paginas son en total
    if (this.paginator.totalPages > 5){
        this.paginas =  new Array(this.hasta - this.desde + 1).fill(0).map((_valor,indice)=> indice + this.desde);
    } else{
      this.paginas = new Array(this.paginator.totalPages).fill(0).map((_valor,indice)=>{
        return indice + 1;
      })
    }

  }

}
