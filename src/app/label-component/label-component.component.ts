import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'label-component',
  templateUrl: './label-component.component.html',
  styleUrls: ['./label-component.component.scss']
})
export class LabelComponentComponent implements OnInit, OnChanges {
  @Input("label") labelIn:string;
  @Input("color") colorIn:string;
  public color:string;
  public label:string;
  
  constructor() { }

  ngOnInit(): void {
    this.color = this.colorIn;
    this.label= this.labelIn;
    debugger;
  }
  ngOnChanges(changes: SimpleChanges ){
    this.color = changes['color'].currentValue;
    debugger;
    this.label = changes['label'].currentValue;
    
  

  }

}
