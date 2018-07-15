import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/Ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  constructor() {}

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(id: number) {
    return this.ingredients[id];
  }
  deleteIngredient(id: number) {
    this.ingredients.splice(id, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  updateIngredient(id: number, name: string, amount: number) {
    this.ingredients[id].name = name;
    this.ingredients[id].amount = amount;
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
