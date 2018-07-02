import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Recipe} from '../../Recipe.model';

@Component({
  selector: 'app-RecipeItem',
  templateUrl: './RecipeItem.component.html',
  styleUrls: ['./RecipeItem.component.css']
})
export class RecipeItemComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('recipe') r: Recipe;
  @Output() selectRecipe = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }
  onSelectRecipe() {
    this.selectRecipe.emit();

  }

}
