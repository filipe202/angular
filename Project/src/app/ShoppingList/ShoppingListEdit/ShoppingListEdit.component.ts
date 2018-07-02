import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Ingredient} from '../../shared/Ingredient.model';

@Component({
  selector: 'app-ShoppingListEdit',
  templateUrl: './ShoppingListEdit.component.html',
  styleUrls: ['./ShoppingListEdit.component.css']
})
export class ShoppingListEditComponent implements OnInit {
  @Output() ingredientAdded = new EventEmitter<Ingredient>();
  constructor() { }

  ngOnInit() {
  }
  addIngredient(nameInput: HTMLInputElement, numberInput: HTMLInputElement)  {
    this.ingredientAdded.emit(new  Ingredient(nameInput.value, numberInput.valueAsNumber));

  }

}
