import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../Recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-RecipeDetail',
  templateUrl: './RecipeDetail.component.html',
  styleUrls: ['./RecipeDetail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;
  constructor(private recipeService:  RecipeService) { }

  ngOnInit() {

  }

  sendIngredientsToShoppingList()  {
      this.recipeService.sendIngredientsToShoppingList(this.recipe.ingredients);
  }
}
