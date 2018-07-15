import { Injectable } from '@angular/core';
import { Recipe } from './Recipe.model';
import { Ingredient } from '../shared/Ingredient.model';
import { ShoppingListService } from '../ShoppingList/shoppingList.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [
    new Recipe(
      'Pasta alla Norma',
      'Recipe by: Debi Mazar and Gabriele Corcos',
      'http://www.fnstatic.co.uk/images/content/recipe/pasta-alla-norma.jpeg',
      [new Ingredient('Pasta', 3), new Ingredient('Tomato', 2)]
    ),
    new Recipe(
      'Burger',
      'with cheese',
      'https://www.deliverymuch.com.br/media/5a8445fa2009c.png',
      [new Ingredient('Burger', 1), new Ingredient('Cheese', 1)]
    )
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    const recipe = this.recipes[id];
    return recipe;
  }
  sendIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }
  updateRecipe(id: number, newRecipe: Recipe) {
    this.recipes[id] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }
  deleteRecipe(id: number) {
    this.recipes.splice(id, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
