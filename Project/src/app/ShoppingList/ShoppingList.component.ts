import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/Ingredient.model';
import { ShoppingListService } from './shoppingList.service';

@Component({
  selector: 'app-ShoppingList',
  templateUrl: './ShoppingList.component.html',
  styleUrls: ['./ShoppingList.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];
  constructor(private shoppingListService:  ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.shoppingListService.ingredientsChanged.subscribe((ingredients: Ingredient[])  =>  {
      this.ingredients = ingredients;
    }
  );
  }


}
