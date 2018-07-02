import { Component, OnInit } from '@angular/core';
import { Recipe } from './Recipe.model';

@Component({
  selector: 'app-Recipes',
  templateUrl: './Recipes.component.html',
  styleUrls: ['./Recipes.component.css']
})
export class RecipesComponent implements OnInit {
  currentRecipe: Recipe;
  constructor() { }

  ngOnInit() {
  }
  openRecipeDetail(recipe: Recipe)  {
    this.currentRecipe  =  recipe;
  }

}
