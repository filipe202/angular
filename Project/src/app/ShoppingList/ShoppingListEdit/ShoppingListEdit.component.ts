import { Component, OnInit } from '@angular/core';
import {Ingredient} from '../../shared/Ingredient.model';
import { ShoppingListService } from '../shoppingList.service';

@Component({
  selector: 'app-ShoppingListEdit',
  templateUrl: './ShoppingListEdit.component.html',
  styleUrls: ['./ShoppingListEdit.component.css']
})
export class ShoppingListEditComponent implements OnInit {
  constructor(private shoppingListService:  ShoppingListService) {}

  ngOnInit() {
  }
  addIngredient(nameInput: HTMLInputElement, numberInput: HTMLInputElement)  {

    this.shoppingListService.addIngredient(new  Ingredient(nameInput.value, numberInput.valueAsNumber));

  }

}
