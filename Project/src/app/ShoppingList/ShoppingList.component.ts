import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/Ingredient.model';

@Component({
  selector: 'app-ShoppingList',
  templateUrl: './ShoppingList.component.html',
  styleUrls: ['./ShoppingList.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];
  constructor() {}

  ngOnInit() {}
}
