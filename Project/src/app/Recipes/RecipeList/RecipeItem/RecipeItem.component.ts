import { Component, OnInit, Input} from '@angular/core';
import {Recipe} from '../../Recipe.model';
import { RecipeService } from '../../recipe.service';

@Component({
  selector: 'app-RecipeItem',
  templateUrl: './RecipeItem.component.html',
  styleUrls: ['./RecipeItem.component.css']
})
export class RecipeItemComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('recipe') r: Recipe;
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }
  onSelectRecipe() {
    this.recipeService.recipeSelected.emit(this.r);

  }

}
