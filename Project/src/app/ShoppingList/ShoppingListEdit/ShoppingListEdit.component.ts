import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Ingredient } from '../../shared/Ingredient.model';
import { ShoppingListService } from '../shoppingList.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ShoppingListEdit',
  templateUrl: './ShoppingListEdit.component.html',
  styleUrls: ['./ShoppingListEdit.component.css']
})
export class ShoppingListEditComponent implements OnInit, OnDestroy {
  constructor(private shoppingListService: ShoppingListService) {}
  @ViewChild('f') shopListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemId: number;
  editedItem: Ingredient;
  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (id: number) => {
        this.editMode = true;
        this.editedItemId = id;
        this.editedItem = this.shoppingListService.getIngredient(id);
        this.shopListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editedItemId,
        this.shopListForm.value.name,
        this.shopListForm.value.amount
      );
    } else {
      this.shoppingListService.addIngredient(
        new Ingredient(
          this.shopListForm.value.name,
          this.shopListForm.value.amount
        )
      );
    }
    this.resetForm();
  }
  onClear() {
    this.resetForm();
  }
  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemId);
    this.resetForm();
  }
  resetForm() {
    this.shopListForm.reset();
    this.editMode = false;
    this.editedItemId = null;
    this.editedItem = null;
  }
}
