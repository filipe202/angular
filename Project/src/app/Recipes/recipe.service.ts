import { Injectable, EventEmitter } from '@angular/core';
import { Recipe } from './Recipe.model';
import { Ingredient } from '../shared/Ingredient.model';
import { ShoppingListService } from '../ShoppingList/shoppingList.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
 private recipes: Recipe[] = [
    new Recipe(
      'Pasta alla Norma',
      'Recipe by: Debi Mazar and Gabriele Corcos',
      'http://www.fnstatic.co.uk/images/content/recipe/pasta-alla-norma.jpeg',
      [
        new Ingredient('Pasta',  3),
        new Ingredient('Tomato',  2)
      ]
    ),
    new Recipe(
      'Burger',
      'with cheese',
      'https://www.deliverymuch.com.br/media/5a8445fa2009c.png',
      [  new Ingredient('Burger',  1),
      new Ingredient('Cheese',  1)]
    )
  ];

constructor(private shoppingListService:  ShoppingListService) { }

getRecipes() {
  return this.recipes.slice();
}
sendIngredientsToShoppingList(ingredients:  Ingredient[])  {
  this.shoppingListService.addIngredients(ingredients);
}



}
