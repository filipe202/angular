import { Component, OnInit } from '@angular/core';
import { Recipe } from './Recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-Recipes',
  templateUrl: './Recipes.component.html',
  styleUrls: ['./Recipes.component.css'],
  providers: [RecipeService]
})
export class RecipesComponent implements OnInit {
  currentRecipe: Recipe;
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.recipeSelected.subscribe((recipe: Recipe) =>  {
      this.currentRecipe = recipe;
    });

  }

}
