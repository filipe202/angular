import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/Ingredient.model';
import { ShoppingListService } from './shoppingList.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ShoppingList',
  templateUrl: './ShoppingList.component.html',
  styleUrls: ['./ShoppingList.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  private subscription:  Subscription;
  ingredients: Ingredient[];
  constructor(private shoppingListService:  ShoppingListService) {}

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.subscription  =   this.shoppingListService.ingredientsChanged.subscribe((ingredients: Ingredient[])  =>  {
      this.ingredients = ingredients;
    }
  );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
